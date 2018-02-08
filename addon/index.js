const urlInput            = document.getElementById('url');
const passwordInput       = document.getElementById('password');
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
        displayIcons();
    }
}

const displayIcons = function() {
    passwordIconMemo.classList.remove('hidden');
    UniquePasswordBuilder.generate("scrypt", '', 2, passwordInput.value, 'salt', function(generatedPassword, hash) {
    passwordIconMemo.innerHTML = chooseIcon(hash[0], hash[1], hash[2], hash[3])
         + chooseIcon(hash[4], hash[5], hash[6], hash[7])
         + chooseIcon(hash[8], hash[9], hash[10], hash[11]);
            }, true);
}

const chooseIcon = function(index, r, g, b) {
var icons = ['address-book',
'address-book-o',
'address-card','adjust',
'american-sign-language-interpreting',
'anchor',
'archive',
'area-chart',
'arrows',
'arrows-h',
'arrows-v',
'assistive-listening-systems',
'asterisk',
'at',
'audio-description',
'balance-scale',
'ban',
'bar-chart',
'barcode',
'bars',
'bath',
'battery-three-quarters',
'bed',
'beer',
'bell',
'bicycle',
'binoculars',
'birthday-cake',
'blind',
'bluetooth',
'bluetooth-b',
'bolt',
'bomb',
'book',
'bookmark',
'braille',
'briefcase',
'bug',
'building',
'bullhorn',
'bullseye',
'bus',
'calculator',
'calendar',
'camera',
'camera-retro',
'car',
'cart-arrow-down',
'cart-plus',
'cc',
'certificate',
'check',
'check-circle',
'check-square',
'child',
'circle',
'circle-thin',
'clone',
'cloud',
'cloud-download',
'cloud-upload',
'code',
'code-fork',
'coffee',
'cog',
'cogs',
'comment',
'commenting',
'comments',
'compass',
'copyright',
'creative-commons',
'credit-card',
'crop',
'crosshairs',
'cube',
'cubes',
'cutlery',
'database',
'deaf',
'desktop',
'diamond',
'download',
'ellipsis-h',
'ellipsis-v',
'envelope',
'envelope-square',
'eraser',
'exchange',
'exclamation',
'external-link',
'external-link-square',
'eye',
'eye-slash',
'eyedropper',
'fax',
'female',
'fighter-jet',
'film',
'filter',
'fire',
'fire-extinguisher',
'flag',
'flag-checkered',
'flask',
'folder',
'gamepad',
'gavel',
'gift',
'glass',
'globe',
'graduation-cap',
'hashtag',
'headphones',
'heart',
'heartbeat',
'history',
'home',
'hourglass',
'hourglass-end',
'hourglass-half',
'hourglass-start',
'i-cursor',
'id-badge',
'id-card',
'inbox',
'industry',
'info',
'info-circle',
'key',
'language',
'laptop',
'leaf',
'level-down',
'level-up',
'life-ring',
'line-chart',
'location-arrow',
'lock',
'low-vision',
'magic',
'magnet',
'male',
'map',
'map-marker',
'map-pin',
'map-signs',
'microchip',
'microphone',
'microphone-slash',
'minus',
'minus-circle',
'minus-square',
'mobile',
'money',
'motorcycle',
'mouse-pointer',
'music',
'object-group',
'object-ungroup',
'paint-brush',
'paper-plane',
'paw',
'pencil',
'pencil-square',
'percent',
'phone',
'phone-square',
'pie-chart',
'plane',
'plug',
'plus',
'plus-circle',
'plus-square',
'podcast',
'print',
'puzzle-piece',
'qrcode',
'question',
'question-circle',
'quote-left',
'quote-right',
'random',
'recycle',
'refresh',
'registered',
'reply',
'reply-all',
'retweet',
'road',
'rocket',
'rss',
'rss-square',
'search',
'search-minus',
'search-plus',
'server',
'share',
'share-square',
'shield',
'ship',
'shopping-bag',
'shopping-basket',
'shopping-cart',
'shower',
'sign-in',
'sign-language',
'signal',
'sitemap',
'sliders',
'sort',
'space-shuttle',
'spinner',
'spoon',
'square',
'star',
'star-half',
'sticky-note',
'street-view',
'suitcase',
'tablet',
'tachometer',
'tag',
'tags',
'tasks',
'taxi',
'television',
'terminal',
'thermometer-three-quarters',
'thumb-tack',
'thumbs-down',
'thumbs-up',
'ticket',
'times',
'times-circle',
'tint',
'trademark',
'trash',
'tree',
'trophy',
'truck',
'tty',
'umbrella',
'universal-access',
'university',
'unlock',
'upload',
'user',
'users',
'video-camera',
'volume-control-phone',
'volume-down',
'volume-up',
'wheelchair',
'wifi',
'wrench'];
return'<i class="fa fa-' + icons[index % icons.length] + '" style="font-size: 1.3em; color: rgb('+ r +', '+ g +', '+ b +');" aria-hidden="true"></i> &nbsp;';
}

