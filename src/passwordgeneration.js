(function(upb) {

    var passwordLength = 16;
    upb.SCRYPT = 'scrypt';
    upb.ARGON2 = 'argon2';

    upb.makeHashHumanReadable = function(array) {
        var availableChars = [
            '!','$','+','-','=','_','.',':',';',',','?','#','%','&','(',')','[',']',
            '0','1','2','3','4','5','6','7','8','9',
            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
            'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
        ];

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

    upb.generate = function(algorithm, locationSalt, difficulty, masterPassword, userSalt, callback, nolog, params) {
        if (!masterPassword) {
            throw new Error('master password should not be empty');
        }
        var hashLength = 2 * passwordLength;
        var t = +new Date();
        if(algorithm === 'scrypt') {
            var userSalt = userSalt && userSalt != 0 ? "-keyidx:" + userSalt : ""; // keyidx is here for legacy reason, to avoid changing password
            var salt = locationSalt + userSalt;
            var difficulty = difficulty || 8192;
            if (!upb.isPowerOfTwo(difficulty)) {
                throw new Error('difficulty should be a power of two, got ' + difficulty);
            }
            var logN = Math.log2(difficulty);

            scrypt(masterPassword, salt, logN, 8, hashLength, function(hashedPassword) {
                var outputPassword = upb.makeHashHumanReadable(hashedPassword);

                if (!nolog && console && console.log) {
                    var timeMessage = ' in ' + ((+new Date()) - t) / 1000 + ' seconds';
                    var difficultyMessage = (difficulty > 1) ? ' (in ' + difficulty + ' difficulty)' : '';
                    console.log('UniquePasswordBuilder - Generated password (scrypt): ' + outputPassword + ' for salt (domain + key index): ' + salt + timeMessage + difficultyMessage);
                }
                callback(outputPassword, hashedPassword);
            });
        } else {
            var difficulty = difficulty || 10;
            //Good long salt generated with http://passwordsgenerator.net/
            var salt = locationSalt + '|' + (userSalt || '0') + '|' + '5yB8xbz*BsiMxI8yaz&_9!1u3=ZS$fEH16URassf2OzcZEuvIgt4So0sB2aMAp!SDc#HoHuPZ1_??|X-yw2&J+d+c?AKo-k!ifhH6Qp%25alTVdzE*UAFo9#WduBLCXXZhEjg9V&j#DJQba^e#^NNP';
            // https://github.com/antelle/argon2-browser
            // Info: In Argon2, all the algorithm parameters are used as salt to increase entropy
            // so on change will generate different results...
            var slatLimit = 328;
            if(salt.length > slatLimit) {
                callback("Salt is too long :( Should be " + (salt.length - slatLimit) + " chars shorter...");
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
                    distPath: params === undefined ? '.' : params.argon2AsmPath // argon2-asm.min.js script location, without trailing slash
                }).then(argonCallback);
            };

            applyArgon2(masterPassword, argon2.ArgonType.Argon2i, function (hashArgon2i) {
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

    upb.displayIcons = function(password, iconContainer) {
        iconContainer.classList.remove('hidden');
        upb.generate('scrypt', '', 2, password, 'salt', function(generatedPassword, hash) {
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

//Manage UI

var urlInput                      = document.getElementById('url');
var usefulUrl                     = document.getElementById('usefulUrl');
var passwordInput                 = document.getElementById('password');
var passwordIconMemo              = document.getElementById('passwordIconMemo');
var algorithmInput                = document.getElementById('algorithm');
var difficultyScryptInput         = document.getElementById('difficultyScrypt');
var difficultyArgon2Input         = document.getElementById('difficultyArgon2');
var usersaltInput                 = document.getElementById('usersalt');
var hideSensitiveData             = document.getElementById('hideSensitiveData');
var outputField                   = document.getElementById('output');
var copyToClipboardBtn            = document.getElementById('copyToClipboardBtn');
var optionsLink                   = document.querySelector('a.options');
var optionsDiv                    = document.querySelector('div.options');

var updatePasswordField = function(text) {
    setTimeout(function () {
        outputField.textContent = text;
    }, 0);
};

var setErrorMessage = function(message, error) {
    if (error) {
        outputField.classList.add('error');
    } else {
        outputField.classList.remove('error');
    }
    copyToClipboardBtn.classList.add('hidden');
    updatePasswordField(message);
};

var hideData = function() {
    if (hideSensitiveData.checked) {
        passwordIconMemo.classList.add('hidden');
        outputField.classList.add('hide');
    } else {
        outputField.classList.remove('hide');
        UniquePasswordBuilder.displayIcons(passwordInput.value, passwordIconMemo);
    }
};

var verifyAndComputePassword = function(saveInputs, evt) {
    try {
        outputField.classList.remove('error');
        outputField.classList.remove('hide');

        var password = passwordInput.value;
        var result = UniquePasswordBuilder.verifyPassword(password);
        if (!result.success) {
            passwordIconMemo.classList.add('hidden');
            setErrorMessage(result.message, result.error);
        } else {
            var algorithm = algorithmInput.value;
            var difficultyValue = parseInt(algorithmInput.value === UniquePasswordBuilder.SCRYPT ? difficultyScryptInput.value : difficultyArgon2Input.value, 10);
            var difficulty = (difficultyValue > 0) ? difficultyValue : 1;
            var usersalt = usersaltInput.value && usersaltInput.value != '0' ? usersaltInput.value : '';
            copyToClipboardBtn.classList.remove('hidden');

            hideData();

            var locationSalt = UniquePasswordBuilder.getSaltOnLocation(urlInput.value);
            if(locationSalt === '') {
                usefulUrl.textContent = '';
                setErrorMessage('Please enter an url / key', true);
                return;
            } else {
                usefulUrl.textContent = 'Key used to generate password: ' + locationSalt;
            }

            if (evt && evt.keyCode === 13) {
                copyToClipboard();
                if(onEnter) {
                    onEnter();
                }
                return;
            }

            updatePasswordField("Generating password...");
            UniquePasswordBuilder.generate(algorithm, locationSalt, difficulty, passwordInput.value, usersalt, function(password) {
                updatePasswordField(password);
                saveInputs();
            }, true);
        }
    } catch(e) {
        setErrorMessage(e, true);
    }
};

//save is set by UI scripts...
var save;
var onEnter;

var go = function(evt) {
    verifyAndComputePassword(save, evt);
};

var timeout = null;
var delay = function(fn) {
    clearTimeout(timeout);
    timeout = setTimeout(fn, 250);
};

var compute = function(evt) {
    return delay.bind(this, go(evt));
};

var changeAlgorithm = function() {
    difficultyScryptInput.className = algorithmInput.value === UniquePasswordBuilder.SCRYPT ? '' : 'hidden';
    difficultyArgon2Input.className = algorithmInput.value === UniquePasswordBuilder.ARGON2 ? '' : 'hidden';
    compute();
};

var toggleOptions = function(e) {
    e.preventDefault();
    optionsDiv.classList.toggle('hidden');
};

var copyToClipboard = function() {
    var password = outputField.textContent;
    copyTextToClipboard(password);
};

var copyTextToClipboard = function(value) {
    var hiddenInputToCopy = document.createElement("input");
    document.body.appendChild(hiddenInputToCopy);
    hiddenInputToCopy.value = value;
    hiddenInputToCopy.select();
    document.execCommand("copy");
    hiddenInputToCopy.remove();
    return false;
};

algorithmInput.addEventListener('change', changeAlgorithm, false);
urlInput.addEventListener('keyup', compute, false);
passwordInput.addEventListener('keyup', compute, false);
difficultyScryptInput.addEventListener('change', compute, false);
difficultyArgon2Input.addEventListener('change', compute, false);
usersaltInput.addEventListener('keyup', compute, false);
usersaltInput.addEventListener('change', compute, false);
hideSensitiveData.addEventListener('change', hideData, false);
optionsLink.addEventListener('click', toggleOptions, false);
copyToClipboardBtn.addEventListener('click', copyToClipboard, false);

