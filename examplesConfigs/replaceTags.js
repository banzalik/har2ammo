module.exports = {
    'replaceData': {
        tags: [{
            match: new RegExp(/_api_openchat_.*/),
            data: '_api_openchat'
        }, {
            match: new RegExp(/_api_event_useraction_.*/),
            data: '_api_event_useraction'
        }]
    }
};
