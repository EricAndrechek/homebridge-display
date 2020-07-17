const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const spot = require('./spotify')

module.exports = (homebridge) => {
    homebridge.registerPlatform('homebridge-display', 'homebridge-display', HomebridgeDisplay)
}

class HomebridgeDisplay {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        api.on('didFinishLaunching', () => {

            let error_trigger = false; // if this is set to true the webserver is not started

            let boxtype = [];
            let boxes = []; // list of boxes with their appropriate html content

            fs.readFile(__dirname + "/templates/" + this.config.Boxes.Box1 + ".html")
            .then(contents => {
                boxes[0] = contents;
                boxtype[0] = this.config.Boxes.Box1;
                fs.readFile(__dirname + "/templates/" + this.config.Boxes.Box2 + ".html")
                .then(contents => {
                    boxes[1] = contents;
                    boxtype[1] = this.config.Boxes.Box2;
                    fs.readFile(__dirname + "/templates/" + this.config.Boxes.Box3 + ".html")
                    .then(contents => {
                        boxes[2] = contents;
                        boxtype[2] = this.config.Boxes.Box3;
                        fs.readFile(__dirname + "/templates/" + this.config.Boxes.Box4 + ".html")
                        .then(contents => {
                            boxes[3] = contents;
                            boxtype[3] = this.config.Boxes.Box4;
                            fs.readFile(__dirname + "/templates/" + this.config.Boxes.Box5 + ".html")
                            .then(contents => {
                                boxes[4] = contents;
                                boxtype[4] = this.config.Boxes.Box5;
                                fs.readFile(__dirname + "/templates/" + this.config.Boxes.Box6 + ".html")
                                .then(contents => {
                                    boxes[5] = contents;
                                    boxtype[5] = this.config.Boxes.Box6;

                                    this.box = [] // list of objects to create for each box

                                    for (let i = 0; i < boxtype.length; i++) { // check for each box type and if its needed config settings are set up
                                        if (boxtype[i] === 'spotify') {
                                            let spot_settings = this.config.Spotify || false;
                                            if (spot_settings !== false) {
                                                let cid = spot_settings.cid || undefined;
                                                let cs = spot_settings.cs || undefined;
                                                let refresh = spot_settings.refresh || null;
                                                let rurl = spot_settings.rurl || undefined;
                                                if (cid === undefined || cs === undefined || rurl === undefined) {
                                                    this.log.debug('Spotify is not done being set up, got to homebridge-display\'s settings to add it.');
                                                    error_trigger = true;
                                                } else {
                                                    let auth_url = 'https://accounts.spotify.com/authorize?response_type=code&client_id=' + cid + '&scope=user-read-private%20user-read-playback-state%20user-modify-playback-state%20user-library-modify%20user-library-read&redirect_uri=' + encodeURIComponent(rurl);
                                                    this.spot_obj = new spot(cid, cs, refresh, auth_url, rurl, this.log, this.config, this.api);
                                                    this.box[i] = this.spot_obj;
                                                }
                                            } else {
                                                this.log.debug('Spotify not set up, go to homebridge-display\'s settings to add it.')
                                                error_trigger = true;
                                            }
                                        }
                                    }
                                    let background = this.config.Config.background;
                                    let password_protection = this.config.Config.private;
                                    if (error_trigger === false) {
                                        this.createServer(boxes, background, password_protection);
                                    }
                                })
                            })
                        })
                    })
                })
            })
        });
    }
    createServer(boxes, background, password_protection) {
        const log = this.log;
        const server = http.createServer((req, res) => {
            log.debug('Received HTTP Path - ' + req.url);
            let path = url.parse(req.url, true).pathname;
            let args = url.parse(req.url, true).query;
            if (path === "/static/background-image.jpg") {
                fs.readFile(__dirname + "/static/background-image.jpg")
                .then(contents => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "image/jpeg");
                    res.end(contents);
                })
                .catch(err => {
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
            } else if (path === "/static/main.css") {
                fs.readFile(__dirname + "/static/main.css")
                .then(contents => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/css");
                    res.end(contents);
                })
                .catch(err => {
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
            } else if (path === "/static/black-home.png") {
                fs.readFile(__dirname + "/static/black-home.png")
                .then(contents => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "image/png");
                    res.end(contents);
                })
                .catch(err => {
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
            } else if (path === "/static/placeholder.png") {
                fs.readFile(__dirname + "/static/placeholder.png")
                .then(contents => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "image/png");
                    res.end(contents);
                })
                .catch(err => {
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
            } else if (path === "/static/weather-icons.min.css") {
                fs.readFile(__dirname + "/static/weather-icons.min.css")
                .then(contents => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/css");
                    res.end(contents);
                })
                .catch(err => {
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
            } else if (path === "/static/home-black-ios.png") {
                fs.readFile(__dirname + "/static/home-black-ios.png")
                .then(contents => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "image/png");
                    res.end(contents);
                })
                .catch(err => {
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
            } else if (path === "/static/font/weathericons-regular-webfont.eot") {
                fs.readFile(__dirname + "/static/font/weathericons-regular-webfont.eot")
                .then(contents => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/vnd.ms-fontobject");
                    res.end(contents);
                })
                .catch(err => {
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
            } else if (path === "/static/font/weathericons-regular-webfont.svg") {
                fs.readFile(__dirname + "/static/font/weathericons-regular-webfont.svg")
                .then(contents => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "image/svg+xml");
                    res.end(contents);
                })
                .catch(err => {
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
            } else if (path === "/static/font/weathericons-regular-webfont.ttf") {
                fs.readFile(__dirname + "/static/font/weathericons-regular-webfont.ttf")
                .then(contents => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "font/ttf");
                    res.end(contents);
                })
                .catch(err => {
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
            } else if (path === "/static/font/weathericons-regular-webfont.woff") {
                fs.readFile(__dirname + "/static/font/weathericons-regular-webfont.woff")
                .then(contents => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "font/woff");
                    res.end(contents);
                })
                .catch(err => {
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
            } else if (path === "/static/font/weathericons-regular-webfont.woff2") {
                fs.readFile(__dirname + "/static/font/weathericons-regular-webfont.woff2")
                .then(contents => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "font/woff2");
                    res.end(contents);
                })
                .catch(err => {
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
            }
            else if (path === "/home" || path === "/index.html" || path === "/" || path === "") {
                fs.readFile(__dirname + "/index.html")
                .then(contents => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/html");
                    res.end(contents);
                })
                .catch(err => {
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
            } else if (path === "/callback") {
                let code = args.code || undefined;
                if (code === undefined) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/html");
                    res.end(args.error);
                } else {
                    this.spot_obj.callback(code)
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
                //
            });
            socket.on('lyrics', function (data) {
                //
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
                //
            });
            socket.on('transfer', function (data) {
                log.debug("[SPOTIFY] - Transferring playback to " + data);
            });
            socket.on('like', function (data) {
                log.debug("[SPOTIFY] - Liked song");
            });
            socket.on('unlike', function (data) {
                log.debug("[SPOTIFY] - Unliked song");
            });
            socket.on('next', function () {
                log.debug("[SPOTIFY] - Next song");
            });
            socket.on('pause', function () {
                log.debug("[SPOTIFY] - Pause");
            });
            socket.on('back', function () {
                log.debug("[SPOTIFY] - Previous song");
            });
            socket.on('resume', function () {
                log.debug("[SPOTIFY] - Resume");
            });
            socket.on('seek', function (data) {
                log.debug("[SPOTIFY] - Skipping to " + data + "ms");
            });
            socket.on('volume', function (data) {
                log.debug("[SPOTIFY] - Volume set to " + data + "%");
            });
            socket.on('shuffle', function (data) {
                log.debug("[SPOTIFY] - Shuffle set to " + data);
            });
            socket.on('repeat', function (data) {
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