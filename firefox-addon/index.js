var self             = require('sdk/self');
var data             = require("sdk/self").data;
var tabs             = require("sdk/tabs");
var storage          = require("sdk/simple-storage").storage;
var clipboard        = require("sdk/clipboard");
var { Panel }        = require("sdk/panel");
var { ToggleButton } = require("sdk/ui/button/toggle");

var height = {
    initial: 202,
    expand: 262
};

var panel = Panel({
    contentURL: data.url("panel.html"),
    contentScriptFile: [
        data.url("panel.js"),
        data.url("scrypt-async.js"),
        data.url("passwordgeneration.js")
    ],
    width: 410,
    height: height.initial,
    onMessage: function(message) {
        switch(message.action) {
            case 'options':
                this.height = message.value ? height.expand : height.initial;
            case 'rounds':
            case 'keyindex':
                storage[message.action] = message.value;
                break;
            case 'details':
                panel.hide();
                tabs.open("http://paulgreg.me/UniquePasswordBuilder/");
                break;
            case 'done':
                panel.hide();
                clipboard.set(message.value);
                break;
        }
    },
    onHide: function() {
        button.state('window', {checked: false});
    }
});

var button = ToggleButton({
    id: "uniquepasswordbuilder-link",
    label: "UniquePasswordBuilder",
    icon: {
        "16": "./icon.png",
        "32": "./icon.png",
        "64": "./icon.png"
    },
    onChange: function(state) {
        if (state.checked) {
            panel.postMessage({
                'url': tabs.activeTab.url,
                'rounds': storage.rounds,
                'keyindex': storage.keyindex,
                'options': storage.options
            });
            panel.show({
                position: button
            });
        }
    }
});
