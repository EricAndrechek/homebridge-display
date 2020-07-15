const http = require('http');
const fs = require('fs').promises;

module.exports = (homebridge) => {
    homebridge.registerPlatform('homebridge-display', 'homebridge-display', HomebridgeDisplay)
}

class HomebridgeDisplay {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        api.on('didFinishLaunching', () => {
            this.createServer();
        });
    }
    createServer() {
        const log = this.log;
        const server = http.createServer((req, res) => {
            log.debug('Received HTTP Path - ' + req.url);
            if (req.url === "/static/background-image.jpg") {
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
            } else if (req.url === "/static/main.css") {
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
            } else if (req.url === "/static/black-home.png") {
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
            } else if (req.url === "/static/placeholder.png") {
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
            } else if (req.url === "/static/weather-icons.min.css") {
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
            } else if (req.url === "/static/home-black-ios.png") {
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
            } else if (req.url === "/static/font/weathericons-regular-webfont.eot") {
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
            } else if (req.url === "/static/font/weathericons-regular-webfont.svg") {
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
            } else if (req.url === "/static/font/weathericons-regular-webfont.ttf") {
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
            } else if (req.url === "/static/font/weathericons-regular-webfont.woff") {
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
            } else if (req.url === "/static/font/weathericons-regular-webfont.woff2") {
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
            else if (req.url === "/home" || req.url === "/index.html" || req.url === "/" || req.url === "") {
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
            } else if (req.url === "/callback") {
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/html");
                res.end(req.rul);
            } else {
                res.writeHead(404);
                res.end('404 not found')
            }
        });
        const io = require('socket.io').listen(server)
        io.sockets.on('connection', function (socket) {
            socket.on('update', function () {
                log.debug("requested update");
            });
            socket.on('lyrics', function (data) {
                log.debug("requested lyrics " + data);
            });
            socket.on('switch', function (data) {
                log.debug("requested switch " + data);
            });
            socket.on('news', function (dta) {
                log.debug("requested news");
            });
            socket.on('iot', function () {
                log.debug("requested iot");
            });
            socket.on('debugger', function (data) {
                log.debug("sent debug" + data);
            });
            socket.on('weather', function () {
                log.debug("requested weather");
            });
            socket.on('transfer', function (data) {
                log.debug("requested transfer " + data);
            });
            socket.on('like', function (data) {
                log.debug("sent like" + data);
            });
            socket.on('unlike', function (data) {
                log.debug("sent unlike" + data);
            });
            socket.on('next', function () {
                log.debug("requested next");
            });
            socket.on('pause', function () {
                log.debug("requested pause");
            });
            socket.on('back', function () {
                log.debug("requested back");
            });
            socket.on('resume', function () {
                log.debug("requested resume");
            });
            socket.on('seek', function (data) {
                log.debug("requested seek to " + data);
            });
            socket.on('volume', function (data) {
                log.debug("requested volume to " + data);
            });
            socket.on('shuffle', function (data) {
                log.debug("requested shuffle " + data);
            });
            socket.on('repeat', function (data) {
                log.debug("requested repeat" + data);
            });
        });
        server.on('error', (err) => {
            log.warning(err);
        });
        server.listen(parseInt(this.config.Config.port), () => {
            log('Starting Homebridge-Display server on port ', parseInt(this.config.Config.port));
        });
    }
}