const detailsLink         = document.getElementById('details');

save = function() {
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
};

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

onEnter =  function() {
    passwordInput.value = "";
    window.close();
};

// TODO:
// + mutualize css


detailsLink.addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.create({ url: "https://paulgreg.me/UniquePasswordBuilder/" });
    window.close();
}, false);

copyToClipboardBtn.addEventListener('click', () => {
    passwordInput.value = "";
    window.close();
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


