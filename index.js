#!/usr/bin/env node
var program = require('commander'),
    lodash = require('lodash'),
    colors = require('colors'), // подсветка вывода данных
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    config = {
        "autoTag": true,
        "host": null,
        "pathFilterRegexp": false,
        "clearCookies": false,
        "customCookies": false,
        "customHeaders": [{
            "name": "User-Agent",
            "value": "yandex-tank yandex-tank/har2ammo"
        }]
    };

var Har2Ammo = function (program, config, _) {

    this.har = null;
    this.host = null;
    this.cookieNumber = null;

    this.init = function () {

        this.checkParams();
        this.getHAR();
        this.getConfig();
        this.getBaseHost();
        this.filterHar();
        this.beforeProcess();
        this.process();
        this.afterProcess();
    }

    this.checkParams = function () {
        var error;
        if (!program.input) {
            program.help();
        }

        if (!this.ifExistsFile(program.input)) {
            error = 'File ' + program.input + ' not exist!';
            console.log(error.red);
            process.exit();
        }

        if (program.config && !this.ifExistsFile(program.config)) {
            error = 'File ' + program.config + ' not exist!';
            console.log(error.red);
            process.exit();
        }
    }

    this.getHAR = function () {
        var har = this.parseJsonFile(program.input);
        if (har && har.log && har.log.entries && har.log.entries.length) {
            this.har = har.log.entries;
        } else {
            var error = 'Invalid HAR file.';
            console.log(error.red);
        }
    }

    this.parseJsonFile = function(filename) {
        var content = fs.readFileSync(this.pathNormalise(filename), 'utf8');
            return JSON.parse(content);
    }

    this.getConfig = function () {
        if (!program.config) {
            this.config = config;
            return;
        }

        var conf = this.parseJsonFile(program.config);
        this.config = _.extend(config, conf);
    }

    this.pathNormalise = function (filePath) {
        var pwd = process.cwd();
        return path.resolve(pwd, filePath);
    }

    this.filterHar = function () {
        var newHar = [],
            hostFilterEnabled = !(this.host === false || this.host === 'false'),
            hostFilter = hostFilterEnabled && new RegExp(this.host),
            pathFilterEnabled = !(!this.config.pathFilterRegexp && this.config.pathFilterRegexp !== 'false'),
            pathFilter = pathFilterEnabled && new RegExp(this.config.pathFilterRegexp);

        _.each(this.har, function (item) {
            var host = item.request.url,
                parsedUrl = url.parse(host),
                host = parsedUrl.hostname,
                path = parsedUrl.path;
            if (hostFilter && !hostFilter.test(host)) {
                return;
            }
            if (pathFilter && !pathFilter.test(path)) {
                return;
            }
            newHar.push(item);
        });

        this.har = newHar;
    }

    this.getBaseHost = function () {
        if (program.host) {
            this.host = program.host;
        } else if (this.config.host) {
            this.host = this.config.host;
        } else {
            var host = this.har[0].request.url;
            this.host = url.parse(host).hostname
        }
    }

    this.process = function () {

        if (_.isArray(this.config.customCookies)) {
            var i, length = this.config.customCookies.length;
            for (i=0; i < length ; i++) {
                this.cookieNumber = i;
                this.processGo();
            }
        } else {
            this.processGo();
        }
    }

    this.processGo = function() {
        var _self = this;
        _.forEach(this.har, function (elem) {
            if (elem.request) {
                _self.processHarItem(elem.request);
            }
        });
    }

    this.processHarItem = function (request) {
        var req = this.buildRequests(request);

        this.returnData(req);
    }

    this.absToRelUrl = function (path) {
        var data = url.parse(path);
        return data.path || data.pathname;
    }

    this.buildRequests = function (request) {
        var resp, respSize, tag = "", req = [],
            method = request.method,
            target = this.absToRelUrl(request.url),
            self = this;
        post = '';

        req.push(method + ' ' + target + ' ' + request.httpVersion + '\n');

        if (method === "POST") {
            if (request.postData && request.postData.text) {
                req.push('Content-Length: ' + Buffer.byteLength(request.postData.text, 'utf8') + "\n");
                post = request.postData.text;
            } else {
                req.push('Content-Length: 0\n');
            }
        }

        if (this.config.customHeaders.length) {
            request.headers = _.extend(request.headers, this.config.customHeaders);
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
                        string = item.name + ": " + cookie + "\n";
                        req.push(string);
                        break;
                    }
                    if (!self.config.clearCookies) {
                        string = item.name + ": " + item.value + "\n";
                        req.push(string);
                        break;
                    }
                    break;
                case 'Content-Length':
                    break;
                default :
                    string = item.name + ": " + item.value + "\n";
                    req.push(string);
                    break;
            }

        });

        req.push('\n');
        req.push(post);
        req.push('\n\n');

        resp = this.concatArray(req);

        if (this.config.autoTag) {
            tag = " " + url.parse(request.url).pathname;
        }

        respSize = Buffer.byteLength(resp, 'utf8') + tag + '\n';

        return respSize + resp;
    }

    this.concatArray = function (array) {
        var str = "";
        _.each(array, function (elem) {
            str += elem;
        });
        return str;
    }

    this.ifExistsFile = function (path) {
        return fs.existsSync(path);
    }

    this.returnData = function (data) {
        if (!program.output) {
            console.log(data);
        } else {
            fs.appendFileSync(program.output, data);
        }
    }

    this.beforeProcess = function () {
        if (program.output) {
            fs.writeFileSync(program.output, '');
        }
    }

    this.afterProcess = function () {
    }

    this.init();
};

program
    .version('0.1.1')
    .option('-i, --input <file>', 'path to HAR file')
    .option('-o, --output <file> [required]', 'path to ammo.txt file')
    .option('-h, --host <hostname>', 'base host, strong val')
    .option('-c, --config <file> [required]', 'parh to config file')
    .parse(process.argv);

program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    har2ammo -i input.har -o ammo.txt');
    console.log('    har2ammo -c config.json -i input.har -o ammo.txt');
    console.log('');
});

program.parse(process.argv);

var har2ammo = new Har2Ammo(program, config, lodash);
