var assert = require('assert'),
    helpers = require('./helpers.js'),
    removeLineBreaks = helpers.removeLineBreaks,
    getEtalon = helpers.getEtalon,
    har2ammo = helpers.har2ammo;

describe('Help output', function () {
    var etalonHelp = getEtalon('help');

    it('should be same as etalon', function (done) {
        har2ammo('', function (error, realHelp) {
            assert.ifError(error);
            assert.equal(etalonHelp, realHelp);
            done();
        });
    });
});

describe('Version', function () {
    var etalonVersion = removeLineBreaks(getEtalon('version'));

    it('of the package should same as version of etalon', function () {
        var packageVersion = require('../package.json').version;
        assert.equal(etalonVersion, packageVersion);
    });

    it('of the har2ammo executable should be same as version as etalon', function (done) {
        har2ammo('-V', function (error, output) {
            assert.ifError(error);
            var realVersion = removeLineBreaks(output);
            assert.equal(etalonVersion, realVersion);
            done();
        });
    });
});
