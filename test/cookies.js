var assert = require("assert"),
    utils = require("./helpers.js"),
    getEtalon = utils.getEtalon,
    getResult = utils.getResult,
    har2ammo = utils.har2ammo;

describe('Cookies', function () {

    it('Cookies on', test('ya.ru'));

    it('Cookies off', test('ya.ru.clearCookies'));

    it('Custom cookies 2', test("ya.ru.customCookies"));

    it('Custom cookies Array once', test('ya.ru.customCookiesArray.1', 'ya.ru.customCookies'));

    it('Custom cookies Array', test("ya.ru.customCookiesArray"));
});

function test(fileName, etalonFileName) {
    return function () {
        var etalon = getEtalon(etalonFileName || fileName),
            config = utils.getConfig(fileName + '.config'),
            input = utils.getHar('ya.ru'),
            output = utils.getOut(fileName),
            exec = har2ammo(config + input + output),
            toTest = getResult(fileName);

        assert.equal(etalon, toTest);
    }

}