(function(upb) {

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

    upb.generate = function(algorithm, location, difficulty, masterPassword, userSalt, callback, nolog, params) {
        if (!masterPassword) {
            throw new Error('master password should not be empty');
        }

        var host = typeof(location) === "string" ? location : location.protocol + '//' + location.host;
        var userSalt = userSalt && userSalt != 0 ? "-keyidx:" + userSalt : ""; // keyidx is here for legacy reason, to avoid changing password
        var salt = host + userSalt;

        var t = +new Date();
        if(algorithm === 'scrypt') {
            var difficulty = difficulty || 8192;
            if (!upb.isPowerOfTwo(difficulty)) {
                throw new Error('difficulty should be a power of two, got ' + difficulty);
            }
            var logN = Math.log2(difficulty);

            scrypt(masterPassword, salt, logN, 8, 32, function(hashedPassword) {
                var outputPassword = upb.makeHashHumanReadable(hashedPassword);

                if (!nolog && console && console.log) {
                    var timeMessage = ' in ' + ((+new Date()) - t) / 1000 + ' seconds';
                    var difficultyMessage = (difficulty > 1) ? ' (in ' + difficulty + ' difficulty)' : '';
                    console.log('UniquePasswordBuilder - Generated password (scrypt): ' + outputPassword + ' for salt (domain + key index): ' + salt + timeMessage + difficultyMessage);
                }
                callback(outputPassword);
            });
        } else {
            var difficulty = difficulty || 1;
            // https://github.com/antelle/argon2-browser
            argon2.hash({
                pass: masterPassword,
                salt: salt,
                // optional
                time: difficulty, // the number of iterations
                // mem: 1024, // used memory, in KiB
                hashLen: 32, // desired hash length
                // parallelism: 1, // desired parallelism (will be computed in parallel only for PNaCl)
                type: argon2.ArgonType.Argon2d, // or argon2.ArgonType.Argon2i
                distPath: params === undefined ? './dist/' : params.argon2AsmPath // argon2-asm.min.js script location, without trailing slash
            }).then(function (hash) {
                var outputPassword = upb.makeHashHumanReadable(hash.hash);

                if (!nolog && console && console.log) {
                    var timeMessage = ' in ' + ((+new Date()) - t) / 1000 + ' seconds';
                    var difficultyMessage = (difficulty > 1) ? ' (in ' + difficulty + ' iterations)' : '';
                    console.log('Argon2 results', hash.hash, hash.hashHex, hash.encoded, outputPassword)
                    console.log('UniquePasswordBuilder - Generated password (argon2): ' + outputPassword + ' for salt (domain + user salt): ' + salt + timeMessage + difficultyMessage);
                }
                callback(outputPassword);

            })
            .catch(function (err) { console.error(err.message, err.code)});
        }
    };

    upb.isPowerOfTwo = function(x) {
        return ((x != 0) && !(x & (x - 1)));
    };


})(window.UniquePasswordBuilder = window.UniquePasswordBuilder || {});
