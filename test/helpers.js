var exec = require('child_process').execFile,
    fs = require('fs'),
    assert = require('assert'),
    har2ammoPath = './index.js';

function getFileContent(path) {
    return fs.readFileSync(path, 'utf8');
}

var helpers = module.exports = {
    getEtalon: function (path) {
        if (!path) {
            return;
        }
        var fullPath = 'test/etalons/' + path + '.txt';
        return getFileContent(fullPath);
    },
    getResult: function (path) {
        if (!path) {
            return;
        }
        var fullPath = 'test/results/' + path + '.txt',
            result = getFileContent(fullPath);
        fs.unlinkSync(fullPath);
        return result;
    },
    getConfig: function (path) {
        if (!path) {
            return;
        }
        if (path.indexOf('.js') !== -1) {
            return ' -c test/configs/' + path ;
        }
        return ' -c test/configs/' + path + '.json';
    },
    getHar: function (path) {
        if (!path) {
            return;
        }
        return ' -i test/har/' + path + '.har';
    },
    getOut: function (path) {
        if (!path) {
            return;
        }
        return ' -o test/results/' + path + '.txt';
    },
    har2ammo: function (args, callback) {

        args = args && args.split(' ') || [];

        exec(har2ammoPath, args, function (error, stdout) {
            //@todo how about stderr checking?
            //@todo add status (return) codes checking
            callback(error, stdout);
        });
    },
    removeLineBreaks: function (str) {
        return str.replace(/\r?\n|\r/, '');
    },
    test: function (fileName, etalonFileName, harfile, hasJs) {
        return function (done) {
            var etalon = helpers.getEtalon(etalonFileName || fileName),
                config = helpers.getConfig(fileName + '.config' + (hasJs ? '.js' : '')),
                input = helpers.getHar( harfile ? harfile : 'ya.ru'),
                output = helpers.getOut(fileName);

            //console.log('config', config + input + output);

            helpers.har2ammo(config + input + output, function (error) {
                var toTest = helpers.getResult(fileName);
                assert.ifError(error);
                assert.equal(etalon, toTest);
                done();
            });
        };

    }
};
