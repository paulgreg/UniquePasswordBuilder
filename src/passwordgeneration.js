(function(upb) {

    upb.makeHashHumanReadable = function(array) {
        var availableChars = [
            '!','$','+','-','=','_','.',':',';',',','?','#','%','&','(',')','[',']',
            '0','1','2','3','4','5','6','7','8','9',
            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
            'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
        ];

        var password = '';
        for(i = 0; i < array.length; i+=2) {
            var v = array[i] + array[i+1];
            password += availableChars[v % availableChars.length];
        }
        return password;
    };

    upb.generate = function(location, rounds, masterPassword, keyIndex, callback, nolog) {
        if (!masterPassword) {
            throw new Error('master password should not be empty');
        }

        var rounds = rounds || 1024;
        if (!upb.isPowerOfTwo(rounds)) {
            throw new Error('rounds should be a power of two, got ' + rounds);
        }

        var t = +new Date();
        var logN = Math.log2(rounds);
        var host = location.protocol + '//' + location.host;

        var keyIndex = keyIndex && keyIndex != 0 ? "-keyidx:" + keyIndex : "";
        var salt = host + keyIndex;

        scrypt(masterPassword, salt, logN, 8, 32, function(hashedPassword) {
            var outputPassword = upb.makeHashHumanReadable(hashedPassword);

            if (!nolog && console && console.log) {
                var timeMessage = ' in ' + ((+new Date()) - t) / 1000 + ' seconds';
                var roundsMessage = (rounds > 1) ? ' (in ' + rounds + ' rounds)' : '';
                console.log('UniquePasswordBuilder - Generated password: ' + outputPassword + ' for salt (domain + key index): ' + salt + timeMessage + roundsMessage);
            }
            callback(outputPassword);
        });
    };

    upb.isPowerOfTwo = function(x) {
        return ((x != 0) && !(x & (x - 1)));
    };


})(window.UniquePasswordBuilder = window.UniquePasswordBuilder || {});
