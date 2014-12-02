var test = require('./helpers').test;

describe('Simple', function () {

    it('Default', test('ya.ru'));

    it('Domain first', test('ya.ru.host'));

    it('Default yandex.ru', test('ya.ru.host.yandex'));

    it('Default yandex.ru/system/', test('ya.ru.host.yandex.regexp'));
});
