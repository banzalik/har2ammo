exports = module.exports = {
    'autoTag': true,
    'host': false,
    'pathFilterRegexp': false,
    'clearCookies': false,
    'customCookies': false,
    'replaceDateInURL': false,
    'repeat': 0,
    'customHeaders': [{
        'name': 'User-Agent',
        'value': 'yandex-tank yandex-tank/har2ammo'
    }],
    'replaceData': {
        tags: [{
            match: '_index_',
            data: 'INDEX-'
        }, {
            match: '_post_',
            data: 'POST-'
        }]
    }
};
