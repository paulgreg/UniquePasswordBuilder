var UniquePasswordBuilder = (function() {

    function UniquePasswordBuilder(location, rounds) {
        this._scrypt = scrypt_module_factory();
        this._host = location.protocol + '//' + location.host;
        this._rounds = rounds || 1024;
    }

    UniquePasswordBuilder.prototype = {

        insertGenerateActions: function(masterPassword) {
            // generate master password
            var generatedPassword = this.generateUniquePassword(masterPassword);
            delete masterPassword;
            // cleanup : remove previous link
            var allPreviousLinks = document.querySelectorAll('a.uniquePasswordBuilder');
            for(var i = 0; i < allPreviousLinks.length; i++) {
                var previousLink = allPreviousLinks[i];
                if (previousLink.parentNode) {
                    previousLink.parentNode.removeChild(previousLink);
                }
            }

            var allPasswordInputs = document.querySelectorAll('input[type=password]');
            for(var i = 0; i < allPasswordInputs.length; i++) {
                var passwordInput = allPasswordInputs[i];
                link = document.createElement("a");
                link.setAttribute('class', 'uniquePasswordBuilder');
                link.setAttribute('style', 'padding:5px;cursor:pointer;');
                link.appendChild(document.createTextNode("generate password"));
                this.addLinkAction(link, passwordInput, generatedPassword);
                passwordInput.parentNode.insertBefore(link, passwordInput.nextSibling);
            }
        },

        addLinkAction: function(link, passwordInput, generatedPassword) {
            var generateHandler = function(evt) {
                passwordInput.value = generatedPassword;
                var e = evt || window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
            }.bind(this);
            if (link.addEventListener)
                link.addEventListener('click', generateHandler, false);
            else if (link.attachEvent)
                link.attachEvent('onclick', generateHandler);
        },

        generateUniquePassword: function(masterPassword) {
            var outputPassword = masterPassword;
            var hashedPassword = this._scrypt.crypto_scrypt(this._scrypt.encode_utf8(outputPassword), this._scrypt.encode_utf8(this._host), this._rounds, 8, 1, 32)
            outputPassword = this.makeHashHumanReadable(hashedPassword);

            var roundsMessage = (this._rounds > 1) ? ' (in ' + this._rounds + ' rounds)' : '';
            console.log('UniquePasswordBuilder - Generated password: ' + outputPassword + ' for domain: ' + this._host + roundsMessage);
            return outputPassword;
        },

        makeHashHumanReadable: function(array) {
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
        }
    };

    var blockAutoLaunch = window.uniquePasswordBuilderBlockAutoLaunch === true;
    if (!blockAutoLaunch) {
        var u = new UniquePasswordBuilder(window.location, window.uniquePasswordBuilderRounds);
        var password = prompt('Master password ?');
        u.insertGenerateActions(password);
        delete password;
    }

    return UniquePasswordBuilder;
})();
