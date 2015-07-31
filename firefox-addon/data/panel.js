var urlInput                      = document.getElementById('url');
var passwordInput                 = document.getElementById('password');
var roundsInput                   = document.getElementById('rounds');
var keyindexInput                 = document.getElementById('keyindex');
var outputSpan                    = document.getElementById('output');
var detailsLink                   = document.getElementById('details');
var optionsLink                   = document.querySelector('a.options');
var optionsDiv                    = document.querySelector('div.options');
var copyImg                       = document.querySelector('img.copy');

var timeout = null;
var delay = function(fn, evt) {
    clearTimeout(timeout);
    timeout = setTimeout(fn.bind(undefined, evt), 250);
}

var go = function(evt) {
    try {
        var rounds = (parseInt(roundsInput.value, 10) > 0) ? parseInt(roundsInput.value, 10) : 1;
        var keyindex = (parseInt(keyindexInput.value, 10) > 0) ? parseInt(keyindexInput.value, 10) : 0;
        keyindexInput.value = keyindex;
        var parts = urlInput.value.split('/'); // Extract protocol and host from input value
        urlInput.value = parts[0] + '//' + parts[2] + '/';
        outputSpan.classList.remove('error');
        copyImg.classList.remove('hidden');
        var password = UniquePasswordBuilder.generate({ protocol:parts[0], host:parts[2] }, rounds, passwordInput.value, keyindex, true);
        outputSpan.textContent = password;
        if (evt && evt.keyCode === 13) {
            passwordInput.value = "";
            self.postMessage({ action: 'done', value: password });
        }
    } catch(e) {
        outputSpan.classList.add('error');
        copyImg.classList.add('hidden');
        outputSpan.textContent = e;
    }
}

var delayedGo = delay.bind(undefined, go);

urlInput.addEventListener('keyup', delayedGo, false);
passwordInput.addEventListener('keyup', delayedGo, false);
roundsInput.addEventListener('change', delayedGo, false);
keyindexInput.addEventListener('keyup', delayedGo, false);
keyindexInput.addEventListener('change', delayedGo, false);
passwordInput.addEventListener('keyup', delayedGo, false)

var notify = function(key) {
    return function() {
        self.postMessage({ action: key, 'value': this.value });
    }
}
roundsInput.addEventListener('change', notify('rounds'), false);
keyindexInput.addEventListener('keyup', notify('keyindex'), false);
keyindexInput.addEventListener('change', notify('keyindex'), false);

optionsLink.addEventListener('click', function(e) {
    optionsDiv.classList.toggle('hidden');
    self.postMessage({ action: 'options', 'value': !optionsDiv.classList.contains('hidden') });
    e.preventDefault();
}, false);

copyImg.addEventListener('click', function() {
    self.postMessage({ action: 'done', value: outputSpan.textContent });
    passwordInput.value = "";
}, false)

detailsLink.addEventListener('click', function(e) {
    self.postMessage({ action: 'details' });
    e.preventDefault();
}, false);

self.on('message', function(message) {
    passwordInput.value = "";
    urlInput.value = message.url;
    roundsInput.value = message.rounds || 1024;
    keyindexInput = message.keyindex || 0;

    if (message.options === true) {
        optionsDiv.classList.remove('hidden');
    }

    go();

    passwordInput.focus();
});

