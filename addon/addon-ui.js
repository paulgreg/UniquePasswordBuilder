const urlInput            = document.getElementById('url');
const passwordInput       = document.getElementById('password');
const passwordIconMemo    = document.getElementById('passwordIconMemo');
const algorithmInput      = document.getElementById('algorithm');
const difficultyScryptInput = document.getElementById('difficultyScrypt');
const difficultyArgon2Input = document.getElementById('difficultyArgon2');
const usersaltInput       = document.getElementById('usersalt');
const outputTextarea      = document.getElementById('output');
const detailsLink         = document.getElementById('details');
const hideSensitiveData   = document.getElementById('hideSensitiveData');
const optionsLink         = document.querySelector('a.options');
const optionsDiv          = document.querySelector('div.options');
const copyImg             = document.querySelector('img.copy');

const SCRYPT = 'scrypt'
const ARGON2 = 'argon2'

function save () {
    chrome.storage.local.set({
        'prefs': {
            'algorithm': algorithmInput.value,
            'difficulty': difficultyScryptInput.value,
            'difficultyArgon2': difficultyArgon2Input.value,
            'usersalt': usersaltInput.value,
            'hideSensitiveData': hideSensitiveData.checked,
            'options': !optionsDiv.classList.contains('hidden')
        }
    });
}

function load (data) {
    if (data && data.prefs) {
        algorithmInput.value = data.prefs.algorithm || SCRYPT;
        changeAlgorithm();
        difficultyScryptInput.value = data.prefs.difficulty || "8192";
        difficultyArgon2Input.value = data.prefs.difficultyArgon2 || 10;
        usersaltInput.value = data.prefs.usersalt || '';
        hideSensitiveData.checked = data.prefs.hideSensitiveData;
        data.prefs.options && optionsDiv.classList.remove('hidden');
    } else {
        algorithmInput.value = SCRYPT;
        difficultyScryptInput.value = 8192;
    }
}

function setErrorMessage (message, error) {
    if (error) {
        outputTextarea.classList.add('error');
    }
    copyImg.classList.add('hidden');
    updatePasswordField(message);
}

function updatePasswordField (text) {
    setTimeout(function () {
        outputTextarea.value = text;
    }, 0);
}

function compute (evt) {
    try {
        outputTextarea.classList.remove('error');
        outputTextarea.classList.remove('hide');

        const password = passwordInput.value;
        const result = UniquePasswordBuilder.verifyPassword(password);
        if (!result.success) {
            passwordIconMemo.classList.add('hidden');
            setErrorMessage(result.message, result.error);
        } else {
            const algorithm = algorithmInput.value;
            const difficultyValue = parseInt(algorithmInput.value === SCRYPT ? difficultyScryptInput.value : difficultyArgon2Input.value, 10);
            const difficulty = (difficultyValue > 0) ? difficultyValue : 1;
            const usersalt = usersaltInput.value && usersaltInput.value != '0' ? usersaltInput.value : '';
            copyImg.classList.remove('hidden');

            if (evt && evt.keyCode === 13) {
                outputTextarea.disabled = false;
                outputTextarea.select();
                document.execCommand("copy");
                passwordInput.value = "";
                outputTextarea.disabled = true;
                window.close();
            } else {
                hideData();

                const locationSalt = UniquePasswordBuilder.getSaltOnLocation(urlInput.value);
                if(locationSalt === '') {
                    setErrorMessage('Please enter an url / key', true);
                    return;
                }
                UniquePasswordBuilder.generate(algorithm, locationSalt, difficulty, passwordInput.value, usersalt, function(password) {
                    updatePasswordField(password);
                }, true);
            }
        }
    } catch(e) {
        setErrorMessage(e, true);
    }
}

const changeAlgorithm = function() {
    difficultyScryptInput.className = algorithmInput.value == SCRYPT ? '' : 'hidden';
    difficultyArgon2Input.className = algorithmInput.value == ARGON2 ? '' : 'hidden';
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

hideSensitiveData.addEventListener('click', function(e) {
    save();
    compute();
}, false);

algorithmInput.addEventListener('change', save, false);
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

const hideData = function() {
    if (hideSensitiveData.checked) {
        passwordIconMemo.classList.add('hidden');
        outputTextarea.classList.add('hide');
    } else {
        outputTextarea.classList.remove('hide');
        UniquePasswordBuilder.displayIcons(passwordInput.value, passwordIconMemo);
    }
}
