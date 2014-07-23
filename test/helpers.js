var exec = require("execSync").exec,
    har2ammoPath = "./index.js ";

module.exports = {
    getEtalon: function (path) {
        if (!path) {
            return;
        }
        return exec("cat test/etalons/" + path + ".txt").stdout;
    },
    getResult: function (path) {
        if (!path) {
            return;
        }
        return exec("cat test/results/" + path + ".txt").stdout;
    },
    getConfig: function (path) {
        if (!path) {
            return;
        }
        return " -c test/configs/" + path + ".json"
    },
    getHar: function (path) {
        if (!path) {
            return;
        }
        return " -i test/har/" + path + ".har"
    },
    getOut: function (path) {
        if (!path) {
            return;
        }
        return " -o test/results/" + path + ".txt"
    },
    har2ammo: function (params) {
        if (!params) {
            params = ''
        }
        return exec(har2ammoPath + params).stdout;
    },
    cleanN: function(str) {
        return str.replace(/\r?\n|\r/, '')
    }
}