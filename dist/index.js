const http = require('http');
const url = require('url');
const fs = require('fs');
const spot = require('./spotify')
const wet = require('./weather')
const request = require('request');

module.exports = (homebridge) => {
    homebridge.registerPlatform('homebridge-display', 'homebridge-display', HomebridgeDisplay)
}

class HomebridgeDisplay {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        api.on('didFinishLaunching', () => {

            let error_trigger = false; // if this is set to true the webserver is not started

            let boxtype = [];
            let boxes = []; // list of boxes with their appropriate html content

            boxes[0] = fs.readFileSync(__dirname + "/templates/" + this.config.Boxes.Box1 + ".html");
            boxtype[0] = this.config.Boxes.Box1;

            boxes[1] = fs.readFileSync(__dirname + "/templates/" + this.config.Boxes.Box2 + ".html");
            boxtype[1] = this.config.Boxes.Box2;

            boxes[2] = fs.readFileSync(__dirname + "/templates/" + this.config.Boxes.Box3 + ".html");
            boxtype[2] = this.config.Boxes.Box3;

            boxes[3] = fs.readFileSync(__dirname + "/templates/" + this.config.Boxes.Box4 + ".html");
            boxtype[3] = this.config.Boxes.Box4;

            boxes[4] = fs.readFileSync(__dirname + "/templates/" + this.config.Boxes.Box5 + ".html");
            boxtype[4] = this.config.Boxes.Box5;

            boxes[5] = fs.readFileSync(__dirname + "/templates/" + this.config.Boxes.Box6 + ".html");
            boxtype[5] = this.config.Boxes.Box6;

            this.box = [] // list of objects to create for each box

            let storage_path = this.api.user.storagePath() + '/homebridge-display.json';
            let plugin_storage;
            try {
                plugin_storage = JSON.parse(fs.readFileSync(storage_path));
            } catch (err) {
                plugin_storage = {};
            }

            for (let i = 0; i < boxtype.length; i++) { // check for each box type and if its needed config settings are set up
                if (boxtype[i] === 'spotify') {
                    let spot_settings = this.config.Spotify || false;
                    if (spot_settings !== false) {
                        let cid = spot_settings.cid || undefined;
                        let cs = spot_settings.cs || undefined;
                        let refresh = plugin_storage.refresh || undefined;
                        let rurl = spot_settings.rurl || undefined;
                        if (cid === undefined || cs === undefined || rurl === undefined) {
                            this.log.error('Spotify is not done being set up, got to homebridge-display\'s settings to add it.');
                            error_trigger = true;
                        } else {
                            let auth_url = 'https://accounts.spotify.com/authorize?response_type=code&client_id=' + cid + '&scope=user-read-private%20user-read-playback-state%20user-modify-playback-state%20user-library-modify%20user-library-read&redirect_uri=' + encodeURIComponent(rurl);
                            this.spot_obj = new spot(cid, cs, refresh, auth_url, rurl, this.log, this.config, this.api);
                            this.box[i] = this.spot_obj;
                        }
                    } else {
                        this.log.error('Spotify not set up, go to homebridge-display\'s settings to add it.')
                        error_trigger = true;
                    }
                } else if (boxtype[i] === 'weather') {
                    let wet_settings = this.config.Weather || false;
                    if (wet_settings !== false) {
                        let api_key = wet_settings.api_key || undefined;
                        let lat = wet_settings.lat || undefined;
                        let lon = wet_settings.lon || undefined;
                        if (api_key === undefined || lat === undefined || lon === undefined) {
                            this.log.error('Weather is not done being set up, got to homebridge-display\'s settings to add it.');
                            error_trigger = true;
                        } else {
                            this.wet_obj = new wet(api_key, lat, lon, this.log, this.config, this.api);
                            this.box[i] = this.wet_obj;
                        }
                    } else {
                        this.log.error('Weather not set up, go to homebridge-display\'s settings to add it.')
                        error_trigger = true;
                    }
                }
            }
            let background = this.config.Config.background;
            let password_protection = this.config.Config.private;
            if (error_trigger === false) {
                this.createServer(boxes, boxtype, background, password_protection);
            }
        });
    }
    createServer(boxes, boxtype, background, password_protection) {
        const log = this.log;
        let spot_obj;
        let wet_obj;
        for (let i = 0; i < boxtype.length; i++) {
            if (boxtype[i] === 'spotify') {
                spot_obj = this.box[i];
            } else if (boxtype[i] === 'weather') {
                wet_obj = this.box[i];
            }
        }
        const server = http.createServer((req, res) => {
            log.debug('Received HTTP Path - ' + req.url);
            let path = url.parse(req.url, true).pathname;
            let args = url.parse(req.url, true).query;
            if (path === "/static/background-image.jpg") {
                try {
                    let contents = fs.readFileSync(__dirname + "/static/background-image.jpg");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "image/jpeg");
                    res.end(contents);
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(err);
                    return;
                }
            } else if (path === "/static/main.css") {
                try {
                    let contents = fs.readFileSync(__dirname + "/static/main.css");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/css");
                    res.end(contents);
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(err);
                    return;
                }
            } else if (path === "/static/black-home.png") {
                try {
                    let contents = fs.readFileSync(__dirname + "/static/black-home.png");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "image/png");
                    res.end(contents);
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(err);
                    return;
                }
            } else if (path === "/static/placeholder.png") {
                try {
                    let contents = fs.readFileSync(__dirname + "/static/placeholder.png");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "image/png");
                    res.end(contents);
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(err);
                    return;
                }
            } else if (path === "/static/weather-icons.min.css") {
                try {
                    let contents = fs.readFileSync(__dirname + "/static/weather-icons.min.css");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/css");
                    res.end(contents);
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(err);
                    return;
                }
            } else if (path === "/static/home-black-ios.png") {
                try {
                    let contents = fs.readFileSync(__dirname + "/static/home-black-ios.png");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "image/png");
                    res.end(contents);
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(err);
                    return;
                }
            } else if (path === "/static/font/weathericons-regular-webfont.eot") {
                try {
                    let contents = fs.readFile.readFileSync(__dirname + "/static/font/weathericons-regular-webfont.eot");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/vnd.ms-fontobject");
                    res.end(contents);
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(err);
                    return;
                }
            } else if (path === "/static/font/weathericons-regular-webfont.svg") {
                try {
                    let contents = fs.readFileSync(__dirname + "/static/font/weathericons-regular-webfont.svg");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "image/svg+xml");
                    res.end(contents);
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(err);
                    return;
                }
            } else if (path === "/static/font/weathericons-regular-webfont.ttf") {
                try {
                    let contents = fs.readFileSync(__dirname + "/static/font/weathericons-regular-webfont.ttf");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "font/ttf");
                    res.end(contents);
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(err);
                    return;
                }
            } else if (path === "/static/font/weathericons-regular-webfont.woff") {
                try {
                    let contents = fs.readFileSync(__dirname + "/static/font/weathericons-regular-webfont.woff");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "font/woff");
                    res.end(contents);
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(err);
                    return;
                }
            } else if (path === "/static/font/weathericons-regular-webfont.woff2") {
                try {
                    let contents = fs.readFileSync(__dirname + "/static/font/weathericons-regular-webfont.woff2");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "font/woff2");
                    res.end(contents);
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(err);
                    return;
                }
            }
            else if (path === "/home" || path === "/index.html" || path === "/" || path === "") {
                try {
                    let contents = fs.readFileSync(__dirname + "/index.html");
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/html");
                    res.end(contents);
                }
                catch (err) {
                    res.writeHead(500);
                    res.end(err);
                    return;
                }
            } else if (path === "/callback") {
                let code = args.code || undefined;
                if (code === undefined) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/html");
                    res.end(args.error);
                } else {
                    spot_obj.callback(code)
                    res.writeHead(302, {'Location': '/'});
                    res.end();
                }
            } else {
                res.writeHead(404);
                res.end('404 not found')
            }
        });
        const io = require('socket.io').listen(server)
        io.sockets.on('connection', function (socket) {
            socket.on('update', function () { // Spotify update route
                spot_obj.update(function(result) {
                    let spot_data = JSON.stringify(result);
                    // log.debug('[SPOTIFY] - ' + spot_data);
                    socket.emit('update', spot_data);
                });
            });
            socket.on('lyrics', function (data) {
                let options = {
                    url: data,
                    method: 'GET'
                };
                request(options, (err, res, body) => {
                    if (err) {
                        this.log.debug('[LYRICS] - ' + err);
                        socket.emit("lyrics", {});
                    } else {
                        socket.emit("lyrics", body);
                    }
                });
            });
            socket.on('switch', function (data) {
                let switch_name = data[0]
                let state = data[1]
                log.debug('Setting ' + switch_name + ' to ' + state);
            });
            socket.on('news', function (dta) {
                //
            });
            socket.on('iot', function () {
                //
            });
            socket.on('debugger', function (data) {
                log.debug("[CLIENT ERROR] - " + data);
            });
            socket.on('weather', function () {
                wet_obj.update(function(result) {
                    let wet_update = JSON.stringify(result);
                    // log.debug(wet_update);
                    socket.emit('weather', wet_update);
                })
            });
            socket.on('transfer', function (data) {
                spot_obj.put('', {"device_ids": [data]});
                log.debug("[SPOTIFY] - Transferring playback to " + data);
            });
            socket.on('like', function (data) {
                spot_obj.like(data);
                log.debug("[SPOTIFY] - Liked song");
            });
            socket.on('unlike', function (data) {
                spot_obj.unlike(data);
                log.debug("[SPOTIFY] - Unliked song");
            });
            socket.on('next', function () {
                spot_obj.post('/next');
                log.debug("[SPOTIFY] - Next song");
            });
            socket.on('pause', function () {
                spot_obj.put('/pause', null);
                log.debug("[SPOTIFY] - Pause");
            });
            socket.on('back', function () {
                spot_obj.post('/previous');
                log.debug("[SPOTIFY] - Previous song");
            });
            socket.on('resume', function () {
                spot_obj.put('/play', null);
                log.debug("[SPOTIFY] - Resume");
            });
            socket.on('seek', function (data) {
                spot_obj.put('/seek?position_ms=' + data, null);
                log.debug("[SPOTIFY] - Skipping to " + data + "ms");
            });
            socket.on('volume', function (data) {
                spot_obj.put('/volume?volume_percent=' + data, null);
                log.debug("[SPOTIFY] - Volume set to " + data + "%");
            });
            socket.on('shuffle', function (data) {
                spot_obj.put('/shuffle?state=' + data, null);
                log.debug("[SPOTIFY] - Shuffle set to " + data);
            });
            socket.on('repeat', function (data) {
                spot_obj.put('/repeat?state=' + data, null);
                log.debug("[SPOTIFY] - Repeat set to " + data);
            });
        });
        server.on('error', (err) => {
            log.debug(err);
        });
        server.listen(parseInt(this.config.Config.port), () => {
            log('Starting Homebridge-Display server on port ', parseInt(this.config.Config.port));
        });
    }
}