module.exports = {
    'replaceData': {
        content: [{
            match: 'FIRSTNAME', data: function (a, e) {
                return a.replace('FIRSTNAME', e.chance.first());
            }
        }, {
            match: 'LASTNAME', data: function (a, e) {
                return a.replace('LASTNAME', e.chance.last());
            }
        }, {
            match: 'testemail%40email.com', data: function (a, e) {
                var t = e.chance.word({length: 32}) + e.chance.email({domain: 'yandextank.com'});
                return a.replace('testemail%40email.com', encodeURIComponent(t));
            }
        }]
    }
};
