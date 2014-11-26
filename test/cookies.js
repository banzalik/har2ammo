var assert = require("assert"),
    utils = require("./helpers.js"),
    getEtalon = utils.getEtalon,
    getResult = utils.getResult,
    har2ammo = utils.har2ammo;

describe('Cookies', function () {

    it('Cookies on', function () {
        var test = "ya.ru",
            etalon = getEtalon(test),
            config = utils.getConfig(test + '.config'),
            input = utils.getHar('ya.ru'),
            output = utils.getOut(test),
            exec = har2ammo(config + input + output),
            toTest = getResult(test);

        assert.equal(etalon, toTest);
    })

    it('Cookies off', function () {
        var test = "ya.ru.clearCookies",
            etalon = getEtalon(test),
            config = utils.getConfig(test + '.config'),
            input = utils.getHar('ya.ru'),
            output = utils.getOut(test),
            exec = har2ammo(config + input + output),
            toTest = getResult(test);

        assert.equal(etalon, toTest);
    })

    it('Custom cookies', function () {
        var test = "ya.ru.customCookies",
            etalon = getEtalon(test),
            config = utils.getConfig(test + '.config'),
            input = utils.getHar('ya.ru'),
            output = utils.getOut(test),
            exec = har2ammo(config + input + output),
            toTest = getResult(test);

        assert.equal(etalon, toTest);
    })

    it('Custom cookies Array once', function () {
        var test = "ya.ru.customCookiesArray.1",
            etalon = getEtalon('ya.ru.customCookies'),
            config = utils.getConfig(test + '.config'),
            input = utils.getHar('ya.ru'),
            output = utils.getOut(test),
            exec = har2ammo(config + input + output),
            toTest = getResult(test);

        assert.equal(etalon, toTest);
    })

    it('Custom cookies Array', function () {
        var test = "ya.ru.customCookiesArray",
            etalon = getEtalon(test),
            config = utils.getConfig(test + '.config'),
            input = utils.getHar('ya.ru'),
            output = utils.getOut(test),
            exec = har2ammo(config + input + output),
            toTest = getResult(test);

        assert.equal(etalon, toTest);
    })
});
