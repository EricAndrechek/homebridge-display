const request = require('request');
const fs = require('fs').promises;

class spotify {
    constructor(cid, secret, refresh_token, auth_url, rurl, log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.auth_url = auth_url;
        this.rurl = rurl;
        this.refresh_token = refresh_token;
        this.cid = cid;
        this.secret = secret;
        if (refresh_token === null) {
            this.log.error('You have not yet given homebridge-display access to your Spotify account. To do so go to: ' + this.auth_url + '\nthen restart the server.');
        } else {
            this.refresh()
        }
    }
    refresh() {
        let headers = {
            'Authorization': 'Basic ' + new Buffer(this.cid + ':' + this.secret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        
        let dataString = 'grant_type=refresh_token&refresh_token=' + this.refresh_token;
        
        let options = {
            url: 'https://accounts.spotify.com/api/token',
            method: 'POST',
            headers: headers,
            body: dataString
        };
        
        request(options, (err, res, body) => {
            if (err) {
                this.log.debug('[SPOTIFY] - ' + err);
            } else {
                this.access_token = body.access_token;
                this.log.debug('[SPOTIFY] - Access token generated: ' + body.access_token)
            }
        });
    }
    callback(code) {
        let dataString = 'grant_type=authorization_code&code=' + code + '&redirect_uri=' + this.rurl;
        let headers = {
            'Authorization': 'Basic ' + new Buffer(this.cid + ':' + this.secret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        let options = {
            url: 'https://accounts.spotify.com/api/token',
            method: 'POST',
            headers: headers,
            body: dataString
        };
        
        request(options, (err, res, body) => {
            if (err) {
                this.log.debug('[SPOTIFY] - ' + err);
            } else if (JSON.parse(body).error !== undefined) {
                this.log.debug('[SPOTIFY] - ' + body.error);
            } else {
                this.access_token = JSON.parse(body).access_token;
                this.refresh_token = JSON.parse(body).refresh_token;
                let plugin_data = {};
                let storage_path = this.api.user.storagePath() + 'homebridge-display.json';
                try {
                    plugin_data = JSON.parse(fs.readFileSync(storage_path));
                } catch (err) {
                    // the file just likely doesn't exist yet
                }
                plugin_data["refresh"] = this.refresh_token;
                fs.writeFileSync(storage_path, JSON.stringify(plugin_data));
                this.log.debug('[SPOTIFY] - Access token generated: ' + this.access_token)
            }
        });
    }
}

module.exports = spotify