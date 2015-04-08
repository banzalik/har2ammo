#!/usr/bin/env node
/* exported har2ammo, colors */
var program = require('commander'),
    colors = require('colors'), // подсветка вывода данных
    config = {
        'autoTag': true,
        'host': null,
        'excludeHostRegexp': false,
        'pathFilterRegexp': false,
        'excludePathFilterRegexp': false,
        'clearCookies': false,
        'customCookies': false,
        'replaceDateInURL': false,
        'repeat': 0,
        'customHeaders': [{
            'name': 'User-Agent',
            'value': 'yandex-tank yandex-tank/har2ammo'
        }],
        'replaceData': {
            headers: false,
            content: false,
            cookies: false,
            every: false
        }
    }, Har2Ammo;

Har2Ammo = function (program, config) {
    var _ = require('lodash'),
        url = require('url'),
        fs = require('fs'),
        Chance = require('chance'),
        chance = new Chance(),
        path = require('path'),
        hasRepeat = false,
        configLibs = {
            chance: chance,
            _: _
        };

    this.har = null;
    this.host = null;
    this.cookieNumber = null;
    this.log = {
        ammos: 0,
        totalAmmos: 0,
        loop: 0,
        config: {}
    };

    this.init = function () {

        this.checkParams();
        this.getHAR();
        this.getConfig();
        this.host = this.getBaseHost();
        this.filterHar();
        this.beforeProcess();
        this.process();
        this.afterProcess();
    };

    this.checkParams = function () {
        var error;
        if (!program.input) {
            program.help();
        }

        if (!this.ifExistsFile(program.input)) {
            error = 'File ' + program.input + ' not exist!';
            console.error(error.red);
            process.exit(1);
        }

        if (program.config && !this.ifExistsFile(program.config)) {
            error = 'File ' + program.config + ' not exist!';
            console.error(error.red);
            process.exit(1);
        }
    };

    this.getHAR = function () {
        var har, error;
        try {
            har = this.parseJsonFile(program.input);
        } catch (e) {
            error = 'Can\'t parse HAR file - ' + e.message;
            console.error(error.red);
            process.exit(2);
        }

        if (har && har.log && har.log.entries && har.log.entries.length) {
            this.har = har.log.entries;
        } else {
            error = 'Invalid HAR file.';
            console.error(error.red);
            process.exit(2);
        }
    };

    this.parseJsonFile = function (filename) {
        var content = fs.readFileSync(this.pathNormalise(filename), 'utf8');
        return JSON.parse(content);
    };

    this.getConfigFile = function (filename) {
        return require(this.pathNormalise(filename));
    };

    this.getConfig = function () {
        if (!program.config) {
            this.config = config;
            return;
        }

        var conf = this.getConfigFile(program.config);
        this.config = _.extend(config, conf);
        this.log.config = this.config;
        //console.log(this.config);
    };

    this.pathNormalise = function (filePath) {
        var pwd = process.cwd();
        return path.resolve(pwd, filePath);
    };

    this.filterHar = function () {
        var newHar = [],
            hostFilterEnabled = !(this.config.host === false || this.config.host === 'false'),
            hostFilter = hostFilterEnabled && new RegExp(this.host),
            pathFilterEnabled = !(!this.config.pathFilterRegexp && this.config.pathFilterRegexp !== 'false'),
            pathFilter = pathFilterEnabled && new RegExp(this.config.pathFilterRegexp),
            excludeHostRegexpEnabled = !(!this.config.excludeHostRegexp && this.config.excludeHostRegexp !== 'false'),
            excludeHostRegexp = excludeHostRegexpEnabled && new RegExp(this.config.excludeHostRegexp),
            excludePathFilterRegexpEnabled = !(!this.config.excludePathFilterRegexp &&
            this.config.excludePathFilterRegexp !== 'false'),
            excludePathFilterRegexp = excludePathFilterRegexpEnabled && new RegExp(this.config.excludePathFilterRegexp);

        _.each(this.har, function (item) {
            var host = item.request.url,
                parsedUrl = url.parse(host),
                path = parsedUrl.path;

            host = parsedUrl.hostname;

            if (hostFilter && !hostFilter.test(host)) {
                return;
            }

            if (excludeHostRegexp && excludeHostRegexp.test(host)) {
                return;
            }

            if (pathFilter && !pathFilter.test(path)) {
                return;
            }

            if (excludePathFilterRegexp && excludePathFilterRegexp.test(path)) {
                return;
            }

            newHar.push(item);
        });

        this.har = newHar;
    };

    this.getBaseHost = function () {
        var host;

        if (program.host) {
            host = program.host;
        } else if (this.config.host) {
            host = this.config.host;
        } else {
            var firstHost = this.har[0].request.url;
            host = url.parse(firstHost).hostname;
        }

        return host;
    };

    this.process = function () {
        var i = 0;
        do {
            if (i && !hasRepeat) {
                hasRepeat = true;
            }
            this.processCustomCookies();
            i++;
            this.log.loop = i;
        } while (i < parseInt(this.config.repeat));
    };

    this.processCustomCookies = function () {

        if (_.isArray(this.config.customCookies)) {
            var i, length = this.config.customCookies.length;
            for (i = 0; i < length; i++) {
                this.cookieNumber = i;
                this.processGo();
            }
        } else {
            this.processGo();
        }
    };

    this.processGo = function () {
        var self = this;
        _.forEach(this.har, function (elem) {
            if (elem.request) {
                self.processHarItem(elem.request);
            }
        });
    };

    this.processHarItem = function (request) {
        var req = this.buildRequests(request);
        if (!hasRepeat) {
            this.log.ammos++;
        }
        this.log.totalAmmos++;
        this.returnData(req);
    };

    this.absToRelUrl = function (path) {
        var data = url.parse(path),
            newPath = data.path || data.pathname;

        return this.replaceDate(newPath, this.config.replaceDateInURL);
    };

    this.replaceDate = function (str, config, hasTag) {
        if (config) {
            var toReplace;
            if (config === true) {
                toReplace = Date.now();
            } else {
                toReplace = config;
            }
            if (hasTag) {
                toReplace = '';
            }
            return str.replace(/\d{13}/g, toReplace);
        }
        return str;
    };

    this.buildRequests = function (request) {
        var resp, respSize, tag = '', req = [],
            method = request.method,
            target = this.absToRelUrl(request.url),
            httpVersion = request.httpVersion || 'HTTP/1.1',
            self = this,
            post = '';

        req.push(method + ' ' + target + ' ' + httpVersion + '\r\n');

        if (method === 'POST') {
            if (request.postData && request.postData.text) {
                post = this.replaceContent(request.postData.text);
                req.push('Content-Length: ' + Buffer.byteLength(post, 'utf8') + '\r\n');
            } else {
                req.push('Content-Length: 0\r\n');
            }
        }

        if (this.config.customHeaders.length) {
            request.headers = this.extend(request.headers, this.config.customHeaders);
        }

        _.each(request.headers, function (item) {
            var string;
            switch (item.name) {
                case 'Cookie':
                    if (self.config.customCookies) {
                        var cookie;
                        if (self.cookieNumber === null) {
                            cookie = self.config.customCookies;
                        } else {
                            cookie = self.config.customCookies[self.cookieNumber];
                        }
                        string = item.name + ': ' + cookie + '\r\n';
                        req.push(string);
                        break;
                    }
                    if (!self.config.clearCookies) {
                        string = item.name + ': ' + item.value + '\r\n';
                        req.push(string);
                        string = self.replaceCookies(string);
                        break;
                    }
                    break;
                case 'Content-Length':
                    break;
                default :
                    string = item.name + ': ' + item.value + '\r\n';
                    string = self.replaceHeaders(string);
                    req.push(string);
                    break;
            }

        });

        //req.push('\n');
        req.push(post);
        req.push('\r\n');

        resp = this.concatArray(req);

        if (this.config.autoTag) {
            tag = ' ' + this.replaceDate(url.parse(request.url).pathname, this.config.replaceDateInURL, true)
                .replace(/\.|\//g, '_').replace(/^__/g, '_');
        }

        respSize = Buffer.byteLength(resp, 'utf8') + tag + '\n';

        return respSize + resp;
    };

    this.concatArray = function (array) {
        var str = '';
        _.each(array, function (elem) {
            str += elem;
        });
        return str;
    };

    this.ifExistsFile = function (path) {
        return fs.existsSync(path);
    };

    this.returnData = function (data) {
        if (!program.output) {
            console.log(data);
        } else {
            fs.appendFileSync(program.output, data);
        }
    };

    this.beforeProcess = function () {
        if (program.output) {
            fs.writeFileSync(program.output, '');
        }
    };

    this.afterProcess = function () {
        if (program.log) {
            fs.writeFileSync(program.log, JSON.stringify(this.log));
        }
    };

    this.replaceHeaders = function (data) {
        var replaceConfig = this.config.replaceData.headers;
        return this.replaceEvery(this.replaceData(data, replaceConfig));
    };

    this.replaceContent = function (data) {
        var replaceConfig = this.config.replaceData.content;
        return this.replaceEvery(this.replaceData(data, replaceConfig));
    };

    this.replaceCookies = function (data) {
        var replaceConfig = this.config.replaceData.cookies;
        return this.replaceEvery(this.replaceData(data, replaceConfig));

    };

    this.replaceEvery = function (data) {
        var replaceConfig = this.config.replaceData.every;
        return this.replaceData(data, replaceConfig);
    };

    this.replaceData = function (data, replaceConfig) {
        if (!replaceConfig) {
            return data;
        }
        var self = this,
            localData = data;
        if (_.isArray(replaceConfig)) {
            _.forEach(replaceConfig, function (dataItem) {
                localData = self.replaceWorker(dataItem, localData);
            });
        } else if (_.isObject(replaceConfig)) {
            localData = self.replaceWorker(replaceConfig, localData);
        }
        return localData;
    };

    this.replaceWorker = function (dataItem, localData) {
        var rgx;
        if (_.isString(dataItem.match)) {
            rgx = new RegExp(_.escapeRegExp(dataItem.match));
        } else if (_.isRegExp(dataItem.match)) {
            rgx = new RegExp(dataItem.match);
        } else {
            return localData;
        }
        if (_.isString(dataItem.data)) {
            return localData.replace(rgx, dataItem.data);
        } else if (_.isFunction(dataItem.data)) {
            var toReplace = dataItem.data(localData, configLibs);
            if (_.isString(toReplace)) {
                return localData.replace(rgx, toReplace);
            }
        }
        return localData;
    };

    this.extend = function (to, from) {
        var resultArray = [];
        to.forEach(function (elem) {
            var index = _.findIndex(from, {name: elem.name});
            if (index !== -1) {
                resultArray.push(from[index]);
                from[index] = '';
            }
            else {
                resultArray.push(elem);
            }
        });
        resultArray = resultArray.concat(_.compact(from));

        return resultArray;
    };

    this.init();
};

program
    .version('0.3.6')
    .option('-i, --input <file>', 'path to HAR file')
    .option('-o, --output <file> [required]', 'path to ammo.txt file')
    .option('-h, --host <hostname>', 'base host, strong val')
    .option('-c, --config <file> [required]', 'parh to config file')
    .option('-l, --log <file>', 'parh to write log file')
    .parse(process.argv);

program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    har2ammo -i input.har -o ammo.txt');
    console.log('    har2ammo -c config.json -i input.har -o ammo.txt');
    console.log('');
});

program.parse(process.argv);

var har2ammo = new Har2Ammo(program, config);
