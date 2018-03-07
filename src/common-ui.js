//UI javascript shared betwween html page and browser addon
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
        usersaltInput.classList.add('hide');
    } else {
        outputField.classList.remove('hide');
        usersaltInput.classList.remove('hide');
        if(passwordInput.value !== '') {
            UniquePasswordBuilder.displayIcons(passwordInput.value, passwordIconMemo);
        }
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

            updatePasswordField("Generating password...");
            UniquePasswordBuilder.generate(algorithm, locationSalt, difficulty, passwordInput.value, usersalt, function(password) {
                updatePasswordField(password);
                saveInputs();
                if (evt && evt.keyCode === 13) {
                    copyToClipboard(null, password);
                    if(onEnter) {
                        onEnter();
                    }
                }
            }, true);
        }
    } catch(e) {
        setErrorMessage(e, true);
    }
};

//save is set by UI scripts...
var save;
var onEnter;

var timeout = null;

var compute = function(evt) {
    clearTimeout(timeout);
    timeout = setTimeout(verifyAndComputePassword.bind(this, save, evt), evt && evt.keyCode === 13 ? 0 : 250);
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

var copyToClipboard = function(evt, password) {
    copyTextToClipboard(password || outputField.textContent);
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
