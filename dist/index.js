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
                fs.readFile(__dirname + "/static/background-image.png")
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
        server.listen(parseInt(this.config.Config.port), () => {
            this.log('Starting Homebridge-Display server on port ', parseInt(this.config.Config.port));
        });
    }
}