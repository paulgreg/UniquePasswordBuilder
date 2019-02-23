(function() {
    // Init location
    var displayInfosLink              = document.getElementById('displayInfos')
    var infosDiv                      = document.getElementById('infos')

    var displayInfos = function(e) {
        if(e) e.preventDefault()
        infosDiv.classList.remove('hidden')
        displayInfosLink.classList.add('hidden')
    }

    if (window.location.hash.indexOf('pwa') !== -1) {
        infosDiv.classList.add('hidden')
        displayInfosLink.classList.remove('hidden')
    } else{
        displayInfos()
    }

    var load = function() {
        algorithmInput.value = localStorage.algorithm || UniquePasswordBuilder.SCRYPT
        difficultyScryptInput.value = localStorage.difficulty || 8192
        hideSensitiveData.checked = localStorage.hideSensitiveData === 'true'
        hideData()
        if (localStorage.difficultyArgon2) difficultyArgon2Input.value = localStorage.difficultyArgon2 | 10
        if (localStorage.usersalt) usersaltInput.value = localStorage.usersalt
        if(localStorage.options === 'true') optionsDiv.classList.remove('hidden')
        changeAlgorithm()
        renderDomains()
    }

    save = function() {
        localStorage.algorithm = algorithmInput.value
        localStorage.difficulty = difficultyScryptInput.value
        localStorage.difficultyArgon2 = difficultyArgon2Input.value
        localStorage.usersalt = usersaltInput.value
        localStorage.hideSensitiveData = hideSensitiveData.checked
        localStorage.options = !optionsDiv.classList.contains('hidden')
    }

    var copyBookmarkletToClipboard = function() {
        var algorithmParameters = (algorithmInput.value === 'argon2')
            ? "window.uniquePasswordBuilderAlgorithm='argon2';window.uniquePasswordBuilderDifficulty='" + difficultyArgon2Input.value + "';window.salt='"+usersaltInput.value +"';window.argon2AsmPath='"+ window.location.href + "';"
            : "window.uniquePasswordBuilderAlgorithm='scrypt';window.uniquePasswordBuilderDifficulty='" + difficultyScryptInput.value + "';window.uniquePasswordBuilderKeyIndex='" + usersaltInput.value + "';"
        var bookmarklet = "javascript:(function(){" + algorithmParameters + "document.body.appendChild(document.createElement('script')).src='"+ window.location.href +"upb.min.js';})();"
        copyTextToClipboard(bookmarklet)
    }

    displayInfosLink.addEventListener('click', displayInfos, false)
    document.getElementById('copyBookmarkletToClipboard').addEventListener('click', copyBookmarkletToClipboard, false)


    var domainRegex = /^https?:\/\/(?:[^\/?]+)/i
    var url = document.querySelector('#url')
    url.addEventListener('change', function (e) {
        if (domainRegex.test(url.value)) {
            var domain = domainRegex.exec(url.value)
            saveDomain(domain[0])
            renderDomains()
        }
    }, false)

    function getDomains () {
        var domains = localStorage.domains
        return domains = domains ? JSON.parse(domains) : []
    }

    function saveDomain (domain) {
        var domains = getDomains()
        if (domains.indexOf(domain) !== -1) return
        domains.push(domain)
        localStorage.domains = JSON.stringify(domains)
    }

    function empty(list) {
        while (list.firstChild) {
            list.removeChild(list.firstChild)
        }
    }

    function selectDomain (domain) {
        url.value = domain
    }

    function removeDomain (domain) {
        var domains = getDomains()
        var idx = domains.indexOf(domain)
        domains.splice(idx, 1)
        localStorage.domains = JSON.stringify(domains)
        renderDomains()
    }

    hideSensitiveData.addEventListener('change', renderDomains, false)

    var domainsTitle = document.querySelector('#domainsTitle')
    var list = document.querySelector('#domains')
    function renderDomains () {
        empty(list)
        var domains = getDomains()
        var stop = domains.length === 0 ||hideSensitiveData.checked
        domainsTitle.style.display = stop ? 'none' : 'block'
        if (stop) return

        domains.map(function (domain) {
            if (domain === '') return
            var li = document.createElement('li')
            var aDomain = document.createElement('a')
            var aRemove = document.createElement('a')
            aDomain.innerText = domain
            aDomain.className = 'domain'
            aRemove.innerText = 'remove'
            aRemove.className = 'remove'
            aDomain.addEventListener('click', selectDomain.bind(null, domain), false)
            aRemove.addEventListener('click', removeDomain.bind(null, domain), false)
            li.appendChild(aDomain)
            li.appendChild(aRemove)
            list.appendChild(li)
        })
    }

    load()

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then(function() {
            console.log('service worker registration complete')
        }, function(e) {
            console.log('service worker registration failure:', e)
        })
    }
})()
