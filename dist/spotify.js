const request = require('request')

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
                this.log.error('[SPOTIFY] - ' + err);
            } else {
                this.access_token = body.access_token;
                this.log.debug('[SPOTIFY] - Access token generated: ' + body.access_token)
            }
        });
    }
    callback(code) {
        let dataString = 'grant_type=authorization_code&code=' + this.refresh_token + '&redirect_uri=' + this.rurl;
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
                this.log.error('[SPOTIFY] - ' + err);
            } else {
                this.access_token = body.access_token;
                this.refresh_token = body.refresh_token;
                this.config.Spotify.refresh = this.refresh_token;
                this.log.debug('[SPOTIFY] - Access token generated: ' + body.access_token)
            }
        });
    }
}

module.exports = spotify