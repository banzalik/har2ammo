var exec = require("execSync").exec,
    fs = require('fs'),
    assert = require("assert"),
    har2ammoPath = "./index.js ";

function getFileContent(path) {
    return fs.readFileSync(path, 'utf8');
}

var helpers = module.exports = {
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
        var cmd = har2ammoPath + params,
            result = exec(cmd);
        if (result.code === 1) {
            throw new Error(result.stdout, cmd);
        }
        return exec(cmd).stdout;
    },
    cleanN: function (str) {
        return str.replace(/\r?\n|\r/, '')
    },
    test: function (fileName, etalonFileName) {
        return function () {
            var etalon = helpers.getEtalon(etalonFileName || fileName),
                config = helpers.getConfig(fileName + '.config'),
                input = helpers.getHar('ya.ru'),
                output = helpers.getOut(fileName),
                exec = helpers.har2ammo(config + input + output),
                toTest = helpers.getResult(fileName);

            assert.equal(etalon, toTest);
        }

    }
}