var test = require('./helpers').test;

describe('Replace', function () {

    it('Default', test('replace.simple', 'replace.simple', 'replace', true));

    it('Headers Simple', test('replace.headers', 'replace.headers', 'replace', true));

    it('Headers Function', test('replace.headers.function', 'replace.headers.function', 'replace', true));

});
