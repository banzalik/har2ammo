var exec = require("exec-sync"),
    har2ammoPath = "./index.js ";

module.exports = {
    getEtalon: function (path) {
        if (!path) {
            return;
        }
        return exec("cat test/etalons/" + path + ".txt");
    },
    getResult: function (path) {
        if (!path) {
            return;
        }
        return exec("cat test/results/" + path + ".txt");
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
        return exec(har2ammoPath + params);
    }
}