(function(upb) {

    // That constant is concatenated to the current domain and the user salt before applying the argon2 algorithm.
    // It is a random string generated with http://passwordsgenerator.net/. The goal is to limit rainbow table attacks.
    // If you have any concern, you can safely change that constant but be aware that it will break generated password before the change.
    // @see https://github.com/paulgreg/UniquePasswordBuilder/issues/16
    var ARGON2_PEPPER = '5yB8xbz*BsiMxI8yaz&_9!1u3=ZS$fEH16URassf2OzcZEuvIgt4So0sB2aMAp!SDc#HoHuPZ1_??|X-yw2&J+d+c?AKo-k!ifhH6Qp%25alTVdzE*UAFo9#WduBLCXXZhEjg9V&j#DJQba^e#^NNP'

    var passwordLength = 16;
    upb.SCRYPT = 'scrypt';
    upb.ARGON2 = 'argon2';
    var availableChars = '!$+-=_.:;,?#%&()[]' + '0123456789' + 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    upb.makeHashHumanReadable = function(array) {
        var password = '';
        for(var i = 0; i < array.length; i+=2) {
            var v = array[i] + array[i+1];
            password += availableChars[v % availableChars.length];
        }
        return password;
    };

    upb.getSaltOnLocation = function(input) {
        if (!input) {
            return '';
        }
        if (input.indexOf('//') === -1) {
            return input;
        }

        var parts = input.split('/'); // Extract protocol and host from input value
        return (parts[0]|| '') + '//' + ( parts[2]  || '') ;
    };

    upb.verifyPassword = function(password) {
        if (password.length === 0) {
            return { success: false, message: 'Please type a strong password', error: false};
        }
        if (!/[a-z]/.test(password)) {
            return { success: false, message: 'Password needs lower-case characters', error: true};
        }
        if (!/[A-Z]/.test(password)) {
            return { success: false, message: 'Password needs upper-case characters', error: true};
        }
        if (!/[\d]/.test(password)) {
            return { success: false, message: 'Password needs numerical characters', error: true};
        }
        if (password.length < 8) {
            return { success: false, message: 'Password should be at least 8 characters', error: true};
        }
        return { success: true, message: 'Generating password...', error: false};
    }

    upb.generate = function(algoParams, callback, nolog) {
        if (!algoParams.masterPassword) {
            throw new Error('master password should not be empty');
        }
        var hashLength = 2 * passwordLength;
        var t = +new Date();
        if(algoParams.algorithm === 'scrypt') {
            var userSalt = algoParams.userSalt && algoParams.userSalt != 0 ? "-keyidx:" + algoParams.userSalt : ""; // keyidx is here for legacy reason, to avoid changing password
            var salt = algoParams.locationSalt + userSalt;
            var difficulty = algoParams.difficulty || 8192;
            if (!upb.isPowerOfTwo(difficulty)) {
                throw new Error('difficulty should be a power of two, got ' + difficulty);
            }
            var logN = Math.log2(difficulty);

            scrypt(algoParams.masterPassword, salt, logN, 8, hashLength, function(hashedPassword) {
                var outputPassword = upb.makeHashHumanReadable(hashedPassword);

                if (!nolog && console && console.log) {
                    var timeMessage = ' in ' + ((+new Date()) - t) / 1000 + ' seconds';
                    var difficultyMessage = (difficulty > 1) ? ' (in ' + difficulty + ' difficulty)' : '';
                    console.log('UniquePasswordBuilder - Generated password (scrypt): ' + outputPassword + ' for salt (domain + key index): ' + salt + timeMessage + difficultyMessage);
                }
                callback(outputPassword, hashedPassword);
            });
        } else {
            var difficulty = algoParams.difficulty || 10;
            var salt = algoParams.locationSalt + '|' + (algoParams.userSalt || '0') + '|' + ARGON2_PEPPER;
            // https://github.com/antelle/argon2-browser
            // Info: In Argon2, all the algorithm parameters are used as salt to increase entropy
            // so one change will generate a different result...
            var saltLimit = 328;
            if(salt.length > saltLimit) {
                callback("Salt is too long :( Should be " + (salt.length - saltLimit) + " chars shorter...");
                return;
            }
            var applyArgon2 = function(password, type, argonCallback) {
                return argon2.hash({
                    pass: password,
                    salt: salt, //fail when salt length is >328
                    // optional
                    time: difficulty, // the number of iterations
                    // mem: 1024, // used memory, in KiB
                    hashLen: hashLength, // desired hash length
                    // parallelism: 1, // desired parallelism (will be computed in parallel only for PNaCl)
                    type: type, // argon2.ArgonType.Argon2i or argon2.ArgonType.Argon2d
                    distPath: algoParams.argon2AsmPath === undefined ? '.' : algoParams.argon2AsmPath // argon2-asm.min.js script location, without trailing slash
                }).then(argonCallback);
            };

            applyArgon2(algoParams.masterPassword, argon2.ArgonType.Argon2i, function (hashArgon2i) {
                //  console.log("======>hash", Argon2i.hashHex, Argon2i.encoded);
                applyArgon2(hashArgon2i.hashHex, argon2.ArgonType.Argon2d, function (hashArgon2d) {
                    var outputPassword = upb.makeHashHumanReadable(hashArgon2d.hash);

                    if (!nolog && console && console.log) {
                        var timeMessage = ' in ' + ((+new Date()) - t) / 1000 + ' seconds';
                        var difficultyMessage = (difficulty > 1) ? ' (in ' + difficulty + ' iterations Argon2i then ' + difficulty + ' iterations Argon2d)' : '';
                        console.log('Argon2 results', hashArgon2d.hash, hashArgon2d.hashHex, hashArgon2d.encoded, outputPassword)
                        console.log('UniquePasswordBuilder - Generated password (argon2): ' + outputPassword + ' for salt (domain + user salt): ' + salt + timeMessage + difficultyMessage);
                    }
                    callback(outputPassword, hashArgon2d.hash);
            });
        })
        .catch(function (err) { console.error(err.message, err.code)});
        }
    };

    upb.isPowerOfTwo = function(x) {
        return ((x != 0) && !(x & (x - 1)));
    };

    var iconAlgoParams = { algorithm: 'scrypt', locationSalt: '', difficulty: 2, userSalt: 'salt' };
    upb.displayIcons = function(password, iconContainer) {
        iconContainer.classList.remove('hidden');
        iconAlgoParams.masterPassword = password;
        upb.generate(iconAlgoParams, function(generatedPassword, hash) {
            while (iconContainer.firstChild) {
                iconContainer.removeChild(iconContainer.firstChild);
            }
            upb.chooseIcon(iconContainer, hash[0], hash[1], hash[2], hash[3]);
            upb.chooseIcon(iconContainer, hash[4], hash[5], hash[6], hash[7]);
            upb.chooseIcon(iconContainer, hash[8], hash[9], hash[10], hash[11]);
        }, true);
    };

    upb.icons = ['address-book', 'address-book-o', 'address-card', 'adjust', 'american-sign-language-interpreting', 'anchor', 'archive', 'area-chart', 'arrows', 'arrows-h', 'arrows-v', 'assistive-listening-systems', 'asterisk', 'at', 'audio-description', 'balance-scale', 'ban', 'bar-chart', 'barcode', 'bars', 'bath', 'battery-three-quarters', 'bed', 'beer', 'bell', 'bicycle', 'binoculars', 'birthday-cake', 'blind', 'bluetooth', 'bluetooth-b', 'bolt', 'bomb', 'book', 'bookmark', 'braille', 'briefcase', 'bug', 'building', 'bullhorn', 'bullseye', 'bus', 'calculator', 'calendar', 'camera', 'camera-retro', 'car', 'cart-arrow-down', 'cart-plus', 'cc', 'certificate', 'check', 'check-circle', 'check-square', 'child', 'circle', 'circle-thin', 'clone', 'cloud', 'cloud-download', 'cloud-upload', 'code', 'code-fork', 'coffee', 'cog', 'cogs', 'comment', 'commenting', 'comments', 'compass', 'copyright', 'creative-commons', 'credit-card', 'crop', 'crosshairs', 'cube', 'cubes', 'cutlery', 'database', 'deaf', 'desktop', 'diamond', 'download', 'ellipsis-h', 'ellipsis-v', 'envelope', 'envelope-square', 'eraser', 'exchange', 'exclamation', 'external-link', 'external-link-square', 'eye', 'eye-slash', 'eyedropper', 'fax', 'female', 'fighter-jet', 'film', 'filter', 'fire', 'fire-extinguisher', 'flag', 'flag-checkered', 'flask', 'folder', 'gamepad', 'gavel', 'gift', 'glass', 'globe', 'graduation-cap', 'hashtag', 'headphones', 'heart', 'heartbeat', 'history', 'home', 'hourglass', 'hourglass-end', 'hourglass-half', 'hourglass-start', 'i-cursor', 'id-badge', 'id-card', 'inbox', 'industry', 'info', 'info-circle', 'key', 'language', 'laptop', 'leaf', 'level-down', 'level-up', 'life-ring', 'line-chart', 'location-arrow', 'lock', 'low-vision', 'magic', 'magnet', 'male', 'map', 'map-marker', 'map-pin', 'map-signs', 'microchip', 'microphone', 'microphone-slash', 'minus', 'minus-circle', 'minus-square', 'mobile', 'money', 'motorcycle', 'mouse-pointer', 'music', 'object-group', 'object-ungroup', 'paint-brush', 'paper-plane', 'paw', 'pencil', 'pencil-square', 'percent', 'phone', 'phone-square', 'pie-chart', 'plane', 'plug', 'plus', 'plus-circle', 'plus-square', 'podcast', 'print', 'puzzle-piece', 'qrcode', 'question', 'question-circle', 'quote-left', 'quote-right', 'random', 'recycle', 'refresh', 'registered', 'reply', 'reply-all', 'retweet', 'road', 'rocket', 'rss', 'rss-square', 'search', 'search-minus', 'search-plus', 'server', 'share', 'share-square', 'shield', 'ship', 'shopping-bag', 'shopping-basket', 'shopping-cart', 'shower', 'sign-in', 'sign-language', 'signal', 'sitemap', 'sliders', 'sort', 'space-shuttle', 'spinner', 'spoon', 'square', 'star', 'star-half', 'sticky-note', 'street-view', 'suitcase', 'tablet', 'tachometer', 'tag', 'tags', 'tasks', 'taxi', 'television', 'terminal', 'thermometer-three-quarters', 'thumb-tack', 'thumbs-down', 'thumbs-up', 'ticket', 'times', 'times-circle', 'tint', 'trademark', 'trash', 'tree', 'trophy', 'truck', 'tty', 'umbrella', 'universal-access', 'university', 'unlock', 'upload', 'user', 'users', 'video-camera', 'volume-control-phone', 'volume-down', 'volume-up', 'wheelchair', 'wifi', 'wrench'];
    upb.chooseIcon = function(parent, index, r, g, b) {
        var icon = document.createElement("i");
        icon.setAttribute('class', 'fa fa-' + upb.icons[index % upb.icons.length]);
        icon.setAttribute('style', 'font-size: 1.3em; color: rgb('+ r +', '+ g +', '+ b +');margin-left:5px;');
        icon.setAttribute('aria-hidden', 'true');
        parent.appendChild(icon);
    };

})(window.UniquePasswordBuilder = window.UniquePasswordBuilder || {});
