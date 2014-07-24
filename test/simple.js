var assert = require("assert"),
    utils = require("./helpers.js"),
    getEtalon = utils.getEtalon,
    getResult = utils.getResult,
    har2ammo = utils.har2ammo;

describe('Simple', function () {

    it('Default', function () {
        var test = "ya.ru",
            etalon = getEtalon(test),
            config = utils.getConfig(test + '.config'),
            input = utils.getHar(test),
            output = utils.getOut(test),
            exec = har2ammo(config + input + output),
            toTest = getResult(test);

        assert.equal(etalon, toTest);
    })

    it('Domain first', function () {
        var test = "ya.ru.host",
            etalon = getEtalon(test),
            config = utils.getConfig(test + '.config'),
            input = utils.getHar('ya.ru'),
            output = utils.getOut(test),
            exec = har2ammo(config + input + output),
            toTest = getResult(test);

        assert.equal(etalon, toTest);
    })

    it('Default yandex.ru', function () {
        var test = "ya.ru.host.yandex",
            etalon = getEtalon(test),
            config = utils.getConfig(test + '.config'),
            input = utils.getHar('ya.ru'),
            output = utils.getOut(test),
            exec = har2ammo(config + input + output),
            toTest = getResult(test);

        assert.equal(etalon, toTest);
    })

    it('Default yandex.ru/system/', function () {
        var test = "ya.ru.host.yandex.regexp",
            etalon = getEtalon(test),
            config = utils.getConfig(test + '.config'),
            input = utils.getHar('ya.ru'),
            output = utils.getOut(test),
            exec = har2ammo(config + input + output),
            toTest = getResult(test);

        assert.equal(etalon, toTest);
    })
});
