var self = require('sdk/self');
var data = require("sdk/self").data;
var { ToggleButton } = require("sdk/ui/button/toggle");
var panels = require("sdk/panel");
var tabs = require("sdk/tabs");
var storage = require("sdk/simple-storage").storage;

var height = {
    initial: 200,
    expand: 260
};

var panel = panels.Panel({
    contentURL: data.url("panel.html"),
    contentScriptFile: [
        data.url("panel.js"),
        data.url("upb-main.min.js")
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
                tabs.open("http://paulgreg.me/UniquePasswordBuilder/");
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
