var assert = require("assert"),
    help = require("./helpers.js"),
    getEtalon = help.getEtalon,
    har2ammo = help.har2ammo;

describe('Help', function () {
    var etalonHelp = getEtalon('help'),
        realHelp = har2ammo();

    it('Default help', function () {
        assert.equal(etalonHelp, realHelp);
    })
});

describe('Version', function () {
    var etalonVersion = getEtalon('version'),
        packageVersion = require('../package.json').version,
        realVersion = har2ammo("-V");

    it('Package version', function () {
        assert.equal(etalonVersion, packageVersion);
    })

    it('Real version', function () {
        assert.equal(etalonVersion, realVersion);
    })

    it('Real-Package version', function () {
        assert.equal(packageVersion, realVersion);
    })
})
