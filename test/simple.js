var assert = require("assert"),
    utils = require("./helpers.js"),
    getEtalon = utils.getEtalon,
    getResult = utils.getResult,
    har2ammo = utils.har2ammo;

var test = require('./helpers').test;

describe('Simple', function () {

    it('Default', test('ya.ru'));

    it('Domain first', test('ya.ru.host'));

    it('Default yandex.ru', test('ya.ru.host.yandex'));

    it('Default yandex.ru/system/', test('ya.ru.host.yandex.regexp'));
});
