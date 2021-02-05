const request = require("request");
const { Sonos } = require("sonos");

class sono {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.devices = [];
        const DeviceDiscovery = require("sonos").AsyncDeviceDiscovery;
        let discovery = new DeviceDiscovery();
        discovery.discover().then((device, model) => {
            this.devices.push(new Sonos(device.host));
        });
    }
    get_status() {
        for (var device in this.devices) {
            device.currentState().then((state) => {
                if (state) {
                    device.currentTrack().then((track) => {
                        return track;
                    });
                }
            });
        }
    }
}

module.exports = sono;
