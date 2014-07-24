var exec = require("execSync").exec,
    fs = require('fs'),
    har2ammoPath = "./index.js ";

function getFileContent(path) {
    return fs.readFileSync(path, 'utf8');
}
module.exports = {
    getEtalon: function (path) {
        if (!path) {
            return;
        }
        var fullPath = "test/etalons/" + path + ".txt";
        return getFileContent(fullPath);
    },
    getResult: function (path) {
        if (!path) {
            return;
        }
        var fullPath = "test/results/" + path + ".txt";
        return getFileContent(fullPath);
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
        var cmd = har2ammoPath + params;
        return exec(cmd).stdout;
    },
    cleanN: function (str) {
        return str.replace(/\r?\n|\r/, '')
    }
}