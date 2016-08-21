var urlInput            = document.getElementById('url');
var passwordInput       = document.getElementById('password');
var roundsInput         = document.getElementById('rounds');
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
            'rounds': roundsInput.value,
            'keyindex': keyindexInput.value,
            'revealpassword': revealpasswordInput.checked,
            'options': !optionsDiv.classList.contains('hidden')
        }
    });
}

function load (data) {
    if (data && data.prefs) {
        roundsInput.value = data.prefs.rounds || "1024";
        keyindexInput.value = data.prefs.keyindex || 0;
        revealpasswordInput.checked = data.prefs.revealpassword;
        data.prefs.options && optionsDiv.classList.remove('hidden');
    } else {
        roundsInput.value = 1024;
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
            var rounds = (parseInt(roundsInput.value, 10) > 0) ? parseInt(roundsInput.value, 10) : 1;
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
                UniquePasswordBuilder.generate(url, rounds, passwordInput.value, keyindex, function(password) {
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
roundsInput.addEventListener('change', compute, false);
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
    window.close();
    chrome.tabs.create({
        url: "http://paulgreg.me/UniquePasswordBuilder/"
    });
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

roundsInput.addEventListener('change', save, false);
keyindexInput.addEventListener('keyup', save, false);
keyindexInput.addEventListener('change', save, false);

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('prefs', (data) => {
        load(data);
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            passwordInput.value = "";
            urlInput.value = tabs[0].url || "";
            compute();
            passwordInput.focus();
        });
    });
});
