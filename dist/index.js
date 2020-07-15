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
            let path = req.url.split('/');
            if (path.length >= 2 ) {
                switch (path[1])  {
                    case "home":
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/html");
                        res.end('<html><body><h1>' + this.config.Config.background +  req.url + '</h1></body></html>');
                    case "callback":
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/html");
                        res.end('<html><body><h1>' + req.url + '</h1></body></html>');
                    default:
                        res.writeHead(404);
                        res.end()
                }
            } else {
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
            }
        });
        server.listen(this.config.Config.port, () => {
            this.log('Starting Homebridge-Display server on port ', this.config.Config.port);
        });
    }
}