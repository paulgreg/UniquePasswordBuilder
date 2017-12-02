var urlInput            = document.getElementById('url');
var passwordInput       = document.getElementById('password');
var difficultyInput         = document.getElementById('difficulty');
var keyindexInput       = document.getElementById('keyindex');
var outputTextarea      = document.getElementById('output');
var detailsLink         = document.getElementById('details');
var revealpasswordInput = document.getElementById('revealpassword');
var optionsLink         = document.querySelector('a.options');
var optionsDiv          = document.querySelector('div.options');
var copyImg             = document.querySelector('img.copy');

function save () {
    chrome.storage.local.set({
        'prefs': {
            'difficulty': difficultyInput.value,
            'keyindex': keyindexInput.value,
            'revealpassword': revealpasswordInput.checked,
            'options': !optionsDiv.classList.contains('hidden')
        }
    });
}

function load (data) {
    if (data && data.prefs) {
        difficultyInput.value = data.prefs.difficulty || "8192";
        keyindexInput.value = data.prefs.keyindex || 0;
        revealpasswordInput.checked = data.prefs.revealpassword;
        data.prefs.options && optionsDiv.classList.remove('hidden');
    } else {
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
            var difficulty = (parseInt(difficultyInput.value, 10) > 0) ? parseInt(difficultyInput.value, 10) : 1;
            var keyindex = (parseInt(keyindexInput.value, 10) > 0) ? parseInt(keyindexInput.value, 10) : 0;
            keyindexInput.value = keyindex;
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
                var url = new URL(urlInput.value);
                UniquePasswordBuilder.generate(url, difficulty, passwordInput.value, keyindex, function(password) {
                    outputTextarea.value = password;
                }, true);
            }
        }
    } catch(e) {
        setErrorMessage(e, true);
    }
}

urlInput.addEventListener('keyup', compute, false);
passwordInput.addEventListener('keyup', compute, false);
difficultyInput.addEventListener('change', compute, false);
keyindexInput.addEventListener('keyup', compute, false);
keyindexInput.addEventListener('change', compute, false);
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

difficultyInput.addEventListener('change', save, false);
keyindexInput.addEventListener('keyup', save, false);
keyindexInput.addEventListener('change', save, false);

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
