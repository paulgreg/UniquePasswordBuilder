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

    upb.generate = function(location, rounds, masterPassword, keyIndex) {
        if (!masterPassword) {
            throw new Error('master password should not be empty');
        }

        var rounds = rounds || 1024;
        if (!upb.isPowerOfTwo(rounds)) {
            throw new Error('rounds should be a power of two, got ' + rounds);
        }

        var t = +new Date();
        var scrypt = scrypt_module_factory();
        var host = location.protocol + '//' + location.host;

        var keyIndex = keyIndex && keyIndex != 0 ? "-keyidx:" + keyIndex : "";
        var salt = host + keyIndex;

        var hashedPassword = scrypt.crypto_scrypt(scrypt.encode_utf8(masterPassword), scrypt.encode_utf8(salt), rounds, 8, 1, 32)
        var outputPassword = upb.makeHashHumanReadable(hashedPassword);

        if (console && console.log) {
            var timeMessage = ' in ' + ((+new Date()) - t) / 1000 + ' seconds';
            var roundsMessage = (rounds > 1) ? ' (in ' + rounds + ' rounds)' : '';
            console.log('UniquePasswordBuilder - Generated password: ' + outputPassword + ' for salt (domain + key index): ' + salt + timeMessage + roundsMessage);
        }
        return outputPassword;
    };

    upb.isPowerOfTwo = function(x) {
        while (((x % 2) == 0) && x > 1) {/* While x is even and > 1 */
            x /= 2;
        }
        return (x == 1);
    };


})(window.UniquePasswordBuilder = window.UniquePasswordBuilder || {});
