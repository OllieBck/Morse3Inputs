cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-keyboard.keyboard",
        "file": "plugins/cordova-plugin-keyboard/www/keyboard.js",
        "pluginId": "cordova-plugin-keyboard",
        "clobbers": [
            "window.Keyboard"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.1",
    "cordova-plugin-keyboard": "1.1.5"
};
// BOTTOM OF METADATA
});