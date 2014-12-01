var assert = require("assert"),
    helpers = require("./helpers.js"),
    removeLineBrakes = helpers.removeLineBrakes,
    getEtalon = helpers.getEtalon,
    har2ammo = helpers.har2ammo;

describe("Help output", function () {
    var etalonHelp = getEtalon("help"),
        realHelp = har2ammo();

    it("should be same as etalon", function () {
        assert.equal(etalonHelp, realHelp);
    })
});

describe('Version', function () {
    var etalonVersion = removeLineBrakes(getEtalon('version')),
        packageVersion = require('../package.json').version,
        realVersion = removeLineBrakes(har2ammo("-V"));

    it("of the package should same as version of etalon", function () {
        assert.equal(etalonVersion, packageVersion);
    });

    it('of the har2ammo executable should be same as version as etalon', function () {
        assert.equal(etalonVersion, realVersion);
    });
});
