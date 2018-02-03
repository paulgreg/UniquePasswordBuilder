var urlInput            = document.getElementById('url');
var passwordInput       = document.getElementById('password');
var algorithmInput      = document.getElementById('algorithm');
var difficultyScryptInput = document.getElementById('difficultyScrypt');
var difficultyArgon2Input = document.getElementById('difficultyArgon2');
var usersaltInput       = document.getElementById('usersalt');
var outputTextarea      = document.getElementById('output');
var detailsLink         = document.getElementById('details');
var revealpasswordInput = document.getElementById('revealpassword');
var optionsLink         = document.querySelector('a.options');
var optionsDiv          = document.querySelector('div.options');
var copyImg             = document.querySelector('img.copy');

function save () {
    chrome.storage.local.set({
        'prefs': {
            'algorithm': algorithmInput.value,
            'difficulty': difficultyScryptInput.value,
            'difficultyArgon2': difficultyArgon2Input.value,
            'usersalt': usersaltInput.value,
            'revealpassword': revealpasswordInput.checked,
            'options': !optionsDiv.classList.contains('hidden')
        }
    });
}

function load (data) {
    if (data && data.prefs) {
        algorithmInput.value = data.prefs.algorithm || "scrypt";
        difficultyScryptInput.value = data.prefs.difficulty || "8192";
        difficultyArgon2Input.value = data.prefs.difficultyArgon2 || 10;
        usersaltInput.value = data.prefs.usersalt || '';
        revealpasswordInput.checked = data.prefs.revealpassword;
        data.prefs.options && optionsDiv.classList.remove('hidden');
    } else {
        algorithmInput.value = "scrypt";
        difficultyInput.value = 8192;
    }
}

function setErrorMessage (message, error) {
    if (error) {
        outputTextarea.classList.add('error');
    }
    copyImg.classList.add('hidden');
    outputTextarea.value = message;
}

function compute (evt) {
    try {
        outputTextarea.classList.remove('error');
        outputTextarea.classList.remove('hide');

        var password = passwordInput.value;
        if (password.length === 0) {
            setErrorMessage('Please type a strong password');
        } else if (!/[a-z]/.test(password)) {
            setErrorMessage('Password needs lower-case characters', true);
        } else if (!/[A-Z]/.test(password)) {
            setErrorMessage('Password needs upper-case characters', true);
        } else if (!/[\d]/.test(password)) {
            setErrorMessage('Password needs numerical characters', true);
        } else if (password.length < 8) {
            setErrorMessage('Password should be at least 8 characters', true);
        } else {
            var algorithm = algorithmInput.value;
            var difficultyValue = parseInt(algorithmInput.value === 'scrypt' ? difficultyScryptInput.value : difficultyArgon2Input.value, 10);
            var difficulty = (difficultyValue > 0) ? difficultyValue : 1;
            var usersalt = usersaltInput.value && usersaltInput.value != '0' ? usersaltInput.value : '';
            copyImg.classList.remove('hidden');
            if (revealpasswordInput.checked === true) {
                outputTextarea.classList.add('hide');
            }
            if (evt && evt.keyCode === 13) {
                outputTextarea.disabled = false;
                outputTextarea.select();
                document.execCommand("copy");
                passwordInput.value = "";
                outputTextarea.disabled = true;
                window.close();
            } else {
                var locationSalt = UniquePasswordBuilder.getSaltOnLocation(urlInput.value);
                UniquePasswordBuilder.generate(algorithm, locationSalt, difficulty, passwordInput.value, usersalt, function(password) {
                    outputTextarea.value = password;
                }, true);
            }
        }
    } catch(e) {
        setErrorMessage(e, true);
    }
}

var changeAlgorithm = function() {
    difficultyScryptInput.className = algorithmInput.value == 'scrypt' ? '' : 'hidden';
    difficultyArgon2Input.className = algorithmInput.value == 'argon2' ? '' : 'hidden';
    compute();
}

algorithmInput.addEventListener('change', changeAlgorithm, false);
urlInput.addEventListener('keyup', compute, false);
passwordInput.addEventListener('keyup', compute, false);
difficultyScryptInput.addEventListener('change', compute, false);
difficultyArgon2Input.addEventListener('change', compute, false);
usersaltInput.addEventListener('keyup', compute, false);
usersaltInput.addEventListener('change', compute, false);
passwordInput.addEventListener('keyup', compute, false);

optionsLink.addEventListener('click', function(e) {
    e.preventDefault();
    optionsDiv.classList.toggle('hidden');
    save();
}, false);

detailsLink.addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.create({ url: "https://paulgreg.me/UniquePasswordBuilder/" });
    window.close();
}, false);

copyImg.addEventListener('click', () => {
    outputTextarea.disabled = false;
    outputTextarea.select();
    document.execCommand("copy");
    outputTextarea.disabled = true;
    passwordInput.value = "";
    window.close();
}, false);

revealpasswordInput.addEventListener('click', function(e) {
    save();
    compute();
}, false);

difficultyScryptInput.addEventListener('change', save, false);
difficultyArgon2Input.addEventListener('change', save, false);
usersaltInput.addEventListener('keyup', save, false);
usersaltInput.addEventListener('change', save, false);

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('prefs', (data) => {
        load(data);
        // timeout to mitigate that bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1310019
        setTimeout(() => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                passwordInput.value = "";
                urlInput.value = tabs[0].url || "";
                compute();
                passwordInput.focus();
            });
        }, 50)
    });
});
