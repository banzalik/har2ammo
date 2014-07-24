var assert = require("assert"),
    utils = require("./helpers.js"),
    getEtalon = utils.getEtalon,
    getResult = utils.getResult,
    har2ammo = utils.har2ammo;

describe('Headers', function () {

    it('Headers off', function () {
        var test = "ya.ru.customHeaders.off",
            etalon = getEtalon(test),
            config = utils.getConfig(test + '.config'),
            input = utils.getHar('ya.ru'),
            output = utils.getOut(test),
            exec = har2ammo(config + input + output)
            toTest = getResult(test);

        assert.equal(etalon, toTest);
    })

    it('Headers off', function () {
        var test = "ya.ru.customHeaders",
            etalon = getEtalon(test),
            config = utils.getConfig(test + '.config'),
            input = utils.getHar('ya.ru'),
            output = utils.getOut(test),
            exec = har2ammo(config + input + output)
            toTest = getResult(test);

        assert.equal(etalon, toTest);
    })
});
