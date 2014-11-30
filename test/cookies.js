
var test = require("./helpers").test;

describe('Cookies', function () {

    it('Cookies on', test('ya.ru'));

    it('Cookies off', test('ya.ru.clearCookies'));

    it('Custom cookies 2', test("ya.ru.customCookies"));

    it('Custom cookies Array once', test('ya.ru.customCookiesArray.1', 'ya.ru.customCookies'));

    it('Custom cookies Array', test("ya.ru.customCookiesArray"));
});
