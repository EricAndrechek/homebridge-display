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
        const server = http.createServer((req, res) => {
            this.log.debug('Received HTTP Path - ' + req.url);
            if (req.url === "/static/background-image.png") {
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
            } else if (req.url === "/static/black-home-ios.png") {
                fs.readFile(__dirname + "/static/black-home-ios.png")
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
            socket.on('update', function (data) {
                this.log("requested update");
            });
        });
        server.on('error', (err) => {
            this.log.warning(err);
        });
        server.listen(parseInt(this.config.Config.port), () => {
            this.log('Starting Homebridge-Display server on port ', parseInt(this.config.Config.port));
        });
    }
}