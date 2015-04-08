var test = require('./helpers').test;

describe('Replace', function () {

    it('Default', test('replace.simple', 'replace.simple', 'replace', true));

    it('Headers Simple', test('replace.headers', 'replace.headers', 'replace', true));

    it('Headers Function', test('replace.headers.function', 'replace.headers.function', 'replace', true));

    it('Tags simple', test('replace.tags', 'replace.tags', 'replace', true));

    it('Tags function', test('replace.tags.function', 'replace.tags.function', 'replace', true));

    it('Tags function 2', test('replace.tags.function2', 'replace.tags.function2', 'replace', true));

});
