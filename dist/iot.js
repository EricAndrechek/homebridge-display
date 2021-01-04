const request = require("request");

class iot {
    constructor(pin, port, log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.header = {
            "Content-Type": "Application/json",
            Authorization: pin,
        };
        this.url = "http://localhost:" + port;
    }
    get_status(call) {
        const log = this.log;
        const options = {
            url: this.url + "/accessories",
            method: "GET",
            headers: this.header,
        };
        request(options, (err, res, body) => {
            if (err !== null && err !== undefined) {
                log.debug("[ACCESSORY CONTROL] - " + err);
                return null;
            } else {
                if (body !== undefined) {
                    let resp;
                    try {
                        resp = JSON.parse(body);
                    } catch {
                        return null;
                    }
                    let devices = [];
                    for (const device of resp.accessories) {
                        let aid = device.aid;
                        let name = device.services[1].characteristics[0].value;
                        try {
                            let state =
                                device.services[1].characteristics[1].value;
                            if (typeof state === "boolean") {
                                devices.push({
                                    aid: aid,
                                    name: name,
                                    state: state,
                                });
                            }
                        } catch {
                            // what should be state did not exist so we don't add that data set
                        }
                    }
                    return call(devices);
                } else {
                    return null;
                }
            }
        });
    }
    change_state(aid, state) {
        const log = this.log;
        const options = {
            url: this.url + "/characteristics",
            method: "PUT",
            headers: this.header,
            body: JSON.stringify({
                characteristics: [
                    {
                        aid: parseInt(aid),
                        iid: 10,
                        value: state,
                    },
                ],
            }),
        };
        request(options, (err, res, body) => {
            if (err) {
                log.debug("[ACCESSORY CONTROL] - " + err);
            }
        });
    }
}

module.exports = iot;
