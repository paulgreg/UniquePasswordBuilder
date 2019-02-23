(function() {
    // Init location
    var displayInfosLink              = document.getElementById('displayInfos');
    var infosDiv                      = document.getElementById('infos');

    var displayInfos = function(e) {
        if(e) e.preventDefault();
        infosDiv.classList.remove('hidden');
        displayInfosLink.classList.add('hidden');
    }

    if (window.location.hash.indexOf('pwa') !== -1) {
        infosDiv.classList.add('hidden');
        displayInfosLink.classList.remove('hidden');
    } else{
        displayInfos();
    }

    var load = function() {
        algorithmInput.value = localStorage.algorithm || UniquePasswordBuilder.SCRYPT;
        difficultyScryptInput.value = localStorage.difficulty || 8192;
        hideSensitiveData.checked = localStorage.hideSensitiveData === 'true';
        hideData();
        if (localStorage.difficultyArgon2) difficultyArgon2Input.value = localStorage.difficultyArgon2 | 10;
        if (localStorage.usersalt) usersaltInput.value = localStorage.usersalt;
        if(localStorage.options === 'true') optionsDiv.classList.remove('hidden');
        changeAlgorithm();
    }

    save = function() {
        localStorage.algorithm = algorithmInput.value;
        localStorage.difficulty = difficultyScryptInput.value;
        localStorage.difficultyArgon2 = difficultyArgon2Input.value;
        localStorage.usersalt = usersaltInput.value;
        localStorage.hideSensitiveData = hideSensitiveData.checked;
        localStorage.options = !optionsDiv.classList.contains('hidden');
    }

    var copyBookmarkletToClipboard = function() {
        var algorithmParameters;
        if (algorithmInput.value === 'argon2') {
            algorithmParameters = "window.uniquePasswordBuilderAlgorithm='argon2';window.uniquePasswordBuilderDifficulty='" + difficultyArgon2Input.value + "';window.salt='"+usersaltInput.value +"';window.argon2AsmPath='"+ window.location.href + "';";
        }
        else {
            algorithmParameters = "window.uniquePasswordBuilderAlgorithm='scrypt';window.uniquePasswordBuilderDifficulty='" + difficultyScryptInput.value + "';window.uniquePasswordBuilderKeyIndex='" + usersaltInput.value + "';";
        }
        var bookmarklet = "javascript:(function(){" + algorithmParameters + "document.body.appendChild(document.createElement('script')).src='"+ window.location.href +"upb.min.js';})();";
        copyTextToClipboard(bookmarklet);
    }

    displayInfosLink.addEventListener('click', displayInfos, false);
    document.getElementById('copyBookmarkletToClipboard').addEventListener('click', copyBookmarkletToClipboard, false);

    load();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then(function() {
            console.log('service worker registration complete');
        }, function(e) {
            console.log('service worker registration failure:', e);
        });
    }
})();
