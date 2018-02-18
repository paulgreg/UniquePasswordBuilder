const detailsLink         = document.getElementById('details');
const copyToClipboardBtn  = document.querySelector('img.copy');

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
        algorithmInput.value = data.prefs.algorithm || UniquePasswordBuilder.SCRYPT;
        changeAlgorithm();
        difficultyScryptInput.value = data.prefs.difficulty || "8192";
        difficultyArgon2Input.value = data.prefs.difficultyArgon2 || 10;
        usersaltInput.value = data.prefs.usersalt || '';
        hideSensitiveData.checked = data.prefs.hideSensitiveData;
        data.prefs.options && optionsDiv.classList.remove('hidden');
    } else {
        algorithmInput.value = UniquePasswordBuilder.SCRYPT;
        difficultyScryptInput.value = 8192;
    }
}


//TODO: Manage "Enter" key

// if (evt && evt.keyCode === 13) {
//     outputField.disabled = false;
//     outputField.select();
//     document.execCommand("copy");
//     passwordInput.value = "";
//     outputField.disabled = true;
//     window.close();
// } else {

const compute = function() {
    verifyAndComputePassword(save);
}

const changeAlgorithm = function() {
    difficultyScryptInput.className = algorithmInput.value == UniquePasswordBuilder.SCRYPT ? '' : 'hidden';
    difficultyArgon2Input.className = algorithmInput.value == UniquePasswordBuilder.ARGON2 ? '' : 'hidden';
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

copyToClipboardBtn.addEventListener('click', () => {
    outputField.disabled = false;
    outputField.select();
    document.execCommand("copy");
    outputField.disabled = true;
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


