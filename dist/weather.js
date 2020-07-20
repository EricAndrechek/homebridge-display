const request = require('request');

class weather {
    constructor(api_key, lat, lon, log, config, api) {
        this.api_key = api_key;
        this.lat = lat;
        this.lon = lon;
        this.log = log;
        this.config = config;
        this.api = api;
    }
    update() {
        let options = {
            url: 'https://api.openweathermap.org/data/2.5/onecall?lat=' + this.lat + '&lon=' + this.lon + '&units=imperial&appid=' + this.api_key,
            method: 'GET'
        };
        request(options, (err, res, body) => {
            if (err !== null && err !== undefined) {
                log.debug('[WEATHER] - ' + err);
                return null;
            } else {
                if (body !== undefined) {
                    let resp;
                    try {
                        resp = JSON.parse(body);
                    } catch {
                        return null;
                    }
                    let update = {};
                    update['temp'] = resp['current']['temp'];
                    update['feels'] = resp['current']['feels_like'];
                    update['humidity'] = resp['current']['humidity'];
                    update['wind'] = resp['current']['wind_speed'];
                    update['id'] = resp['current']['weather'][0]['id'];
                    update['minutes'] = {};
                    for (const [index, element] of resp['minutely'].entries()) {
                        update['minutes'][index] = element['precipitation'];
                    }
                    update['hourly'] = {};
                    for (const [place, hour] of resp['hourly'].entries()) {
                        update['hourly'][place] = {};
                        update['hourly'][place]['name'] = '' + this.hours(hour["dt"]);
                        update['hourly'][place]['temp'] = hour['temp'];
                        update['hourly'][place]['id'] = hour['weather'][0]['id'];
                    }
                    update['days'] = {};
                    for (const [place, day] of resp['daily'].entries()) {
                        update['days'][place] = {};
                        update['days'][place]['name'] = this.weekday(day["dt"]);
                        update['days'][place]['max'] = day['temp']['max'];
                        update['days'][place]['min'] = day['temp']['min'];
                        update['days'][place]['id'] = day['weather'][0]['id'];
                    }
                    let riseadded = false;
                    let setadded = false;

                    for (let time = 0; time < update['hourly'].length; time++) {
                        if (time !== 0) {
                            let hour = update['hourly'][time];
                            let hour_prior = update['hourly'][(time - 1)];
                            let sunrise_hour = this.hours(resp['current']['sunrise']);
                            let sunset_hour = this.hours(resp['current']['sunset']);
                            if (sunrise_hour < hour['name'] && !riseadded && sunrise_hour >= hour_prior['name']) {
                                riseadded = true;
                                spot = time - 0.5;
                                update['hourly'][spot] = {'name': this.fulltime(resp['current']['sunrise']), 'temp': 'Sunrise', 'id': 1};
                                update['sunrise'] = spot;
                            }
                            if (sunset_hour < hour['name'] && !setadded && time !== 0 && sunset_hour >= hour_prior['name']) {
                                setadded = true;
                                spot = time - 0.5;
                                update['hourly'][spot] = {'name': this.fulltime(resp['current']['sunset']), 'temp': 'Sunset', 'id': 2};
                                update['sunset'] = spot;
                            }
                        }
                    }
                    return update;

                } else {
                    return null;
                }
            }
        });
    }
    formatted(epoch) {
        let d = new Date(0);
        d.setUTCSeconds(epoch);
        return (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    }
    hours(epoch) {
        let d = new Date(0);
        d.setUTCSeconds(epoch);
        return d.getHours();
    }
    minutes(epoch) {
        let d = new Date(0);
        d.setUTCSeconds(epoch);
        return d.getMinutes();
    }
    days(epoch) {
        let d = new Date(0);
        d.setUTCSeconds(epoch);
        return d.getDate();
    }
    fulltime(epoch) {
        let d = new Date(0);
        d.setUTCSeconds(epoch);
        return d.getHours() + ':' + d.getMinutes();
    }
    weekday(epoch) {
        let d = new Date(0);
        d.setUTCSeconds(epoch);
        switch (d.getDay()) {
            case 0:
                return 'Sunday';
            case 1:
                return 'Monday';
            case 2:
                return 'Tuesday';
            case 3:
                return 'Wednesday';
            case 4:
                return 'Thursday';
            case 5:
                return 'Friday';
            case 6:
                return 'Saturday'
        }
    }
}

module.exports = weather