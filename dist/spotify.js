const request = require('request');
const fs = require('fs');

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
        if (refresh_token === undefined) {
            this.log.error('You have not yet given homebridge-display access to your Spotify account. To do so go to: ' + this.auth_url + '\nthen restart the server.');
        } else {
            this.log.debug('Refreshing access token with refresh token \'' + this.refresh_token + '\'');
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
            } else if (JSON.parse(body).error !== undefined) {
                this.log.debug('[SPOTIFY] - ' + JSON.parse(body).error);
            } else {
                this.access_token = JSON.parse(body).access_token;
                this.log.debug('[SPOTIFY] - Access token generated: ' + JSON.parse(body).access_token)
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
                this.log.debug('[SPOTIFY] - ' + JSON.parse(body).error);
            } else {
                this.access_token = JSON.parse(body).access_token;
                this.refresh_token = JSON.parse(body).refresh_token;
                let plugin_data = {};
                let storage_path = this.api.user.storagePath() + '/homebridge-display.json';
                try {
                    plugin_data = JSON.parse(fs.readFileSync(storage_path));
                } catch (err) {
                    // the file just likely doesn't exist yet but we may need to catch this error so it doesn't override
                }
                plugin_data["refresh"] = this.refresh_token;
                fs.writeFileSync(storage_path, JSON.stringify(plugin_data));
                this.log.debug('[SPOTIFY] - Access token generated: ' + this.access_token)
            }
        });
    }
    get(endpoint) {
        let headers = {
            'Authorization': 'Bearer ' + this.access_token
        };
        let options = {
            url: 'https://api.spotify.com/v1/me/player' + endpoint,
            method: 'GET',
            headers: headers
        };
        request(options, (err, res, body) => {
            this.log.debug(body);
            if (err) {
                this.log.debug('[SPOTIFY] - GET err: ' + err);
                return;
            } else if (JSON.parse(body).error !== undefined) {
                this.log.debug('[SPOTIFY] - GET error: ' + JSON.parse(body).error.message);
                return;
            } else {
                return JSON.parse(body);
            }
        });
    }
    put(endpoint, json_body) {
        let headers = {
            'Authorization': 'Bearer ' + this.access_token,
            'Content-Type': 'application/json'
        };
        let options = {
            url: 'https://api.spotify.com/v1/me/player' + endpoint,
            method: 'PUT',
            headers: headers,
            body: json_body
        };
        request(options, (err, res, body) => {
            if (err) {
                this.log.debug('[SPOTIFY] - ' + err);
            } else if (JSON.parse(body).error !== undefined) {
                this.log.debug('[SPOTIFY] - ' + JSON.parse(body));
            }
        });
    }
    post(endpoint) {
        let headers = {
            'Authorization': 'Bearer ' + this.access_token
        };
        let options = {
            url: 'https://api.spotify.com/v1/me/player' + endpoint,
            method: 'POST',
            headers: headers
        };
        request(options, (err, res, body) => {
            if (err) {
                this.log.debug('[SPOTIFY] - ' + err);
            } else if (JSON.parse(body).error !== undefined) {
                this.log.debug('[SPOTIFY] - ' + JSON.parse(body));
            }
        });
    }
    like(song_id) {
        let headers = {
            'Authorization': 'Bearer ' + this.access_token
        };
        let options = {
            url: 'https://api.spotify.com/v1/me/tracks?ids=' + song_id,
            method: 'PUT',
            headers: headers
        };
        request(options, (err, res, body) => {
            if (err) {
                this.log.debug('[SPOTIFY] - ' + err);
            } else if (JSON.parse(body).error !== undefined) {
                this.log.debug('[SPOTIFY] - ' + JSON.parse(body));
            }
        });
    }
    unlike(song_id) {
        let headers = {
            'Authorization': 'Bearer ' + this.access_token
        };
        let options = {
            url: 'https://api.spotify.com/v1/me/tracks?ids=' + song_id,
            method: 'DELETE',
            headers: headers
        };
        request(options, (err, res, body) => {
            if (err) {
                this.log.debug('[SPOTIFY] - ' + err);
            } else if (JSON.parse(body).error !== undefined) {
                this.log.debug('[SPOTIFY] - ' + JSON.parse(body));
            }
        });
    }
    update() {
        let canupdate = false;
        try {
            if (this.refresh_token) {
                canupdate = true;
            }
        } catch (err) {
            // keep canupdate to false as there is no refresh token
        }
        if (canupdate) {
            let user_playback = this.get('');
            let update_json = {};

            try {
                update_json['is_playing'] = user_playback.is_playing;
            } catch (err) {
                update_json['is_playing'] = false;
            }
            if (update_json.is_playing) {
                try {
                    update_json['device'] = user_playback['device']['name'];
                    update_json['device_type'] = user_playback['device']['type'];
                    update_json['device_id'] = user_playback['device']['id'];
                    update_json['volume'] = user_playback['device']['volume_percent'];
                    update_json['shuffle_state'] = user_playback['shuffle_state'];
                    update_json['repeat_state'] = user_playback['repeat_state'];
                } catch (err) {
                    if (user_playback != {'error': {'status': 429, 'message': 'API rate limit exceeded'}}) {
                        this.log.debug(user_playback);
                    }
                    return {"error": 'cannot update, check logs'};
                }

                let currently_playing = this.get('/currently-playing');
                try {
                    update_json['progress_ms'] = currently_playing['progress_ms'];
                    update_json['img_url'] = currently_playing['item']['album']['images'][0]['url'];
                    let artist_names = []
                    for (const artist of currently_playing['item']['artists']) {
                        artist_names.push(artist['name']);
                    }
                    update_json['artists'] = artist_names.join();
                    update_json['duration_ms'] = currently_playing['item']['duration_ms'];
                    update_json['title'] = currently_playing['item']['name'];
                    update_json['song_id'] = currently_playing['item']['id'];
                } catch (err) {
                    if (currently_playing != {'error': {'status': 429, 'message': 'API rate limit exceeded'}}) {
                        this.log.debug(currently_playing);
                    }
                    return {"error": 'cannot update, check logs'};
                }

                try {
                    let headers = {
                        'Authorization': 'Bearer ' + this.access_token
                    };
                    let options = {
                        url: 'https://api.spotify.com/v1/me/tracks/contains?ids=' + update_json.song_id,
                        method: 'GET',
                        headers: headers
                    };
                    request(options, (err, res, body) => {
                        if (err) {
                            this.log.debug('[SPOTIFY] - ' + err);
                        } else if (JSON.parse(body).error !== undefined) {
                            this.log.debug('[SPOTIFY] - ' + JSON.parse(body));
                        } else {
                            update_json['liked'] = JSON.parse(body)[0];
                        }
                    });
                } catch (err) {
                    // ignore
                }

                let devices = self.get('/devices');
                update_json['avaliable_devices'] = {};
                try {
                    for (const device of devices['devices']) {
                        update_json['avaliable_devices'][device['name']] = device['id'];
                    }
                } catch (err) {
                    if (devices != {'error': {'status': 429, 'message': 'API rate limit exceeded'}}) {
                        this.log.debug(devices);
                    }
                    return {"error": 'cannot update, check logs'};
                }
                return update_json;
            } else {
                return update_json;
            }
        } else {
            return {"error": 'cannot update, check logs'};
        }
    }
}

module.exports = spotify