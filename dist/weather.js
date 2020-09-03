const request = require("request");
const _ = require("lodash");

class weather {
    constructor(api_key, lat, lon, log, config, api) {
        this.api_key = api_key;
        this.lat = lat;
        this.lon = lon;
        this.log = log;
        this.config = config;
        this.api = api;
    }
    update(call) {
        let options = {
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + this.lat + "&lon=" + this.lon + "&units=imperial&appid=" + this.api_key,
            method: "GET"
        };
        const log = this.log;
        request(options, (err, res, body) => {
            if (err !== null && err !== undefined) {
                log.debug("[WEATHER] - " + err);
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
                    update["temp"] = resp["current"]["temp"];
                    update["feels"] = resp["current"]["feels_like"];
                    update["humidity"] = resp["current"]["humidity"];
                    update["wind"] = resp["current"]["wind_speed"];
                    update["id"] = resp["current"]["weather"][0]["id"];
                    update["minutes"] = {};
                    minutely(resp, update, function(result) {
                        result["hourly"] = {};
                        hourly(resp, result, function(result) {
                            result["days"] = {};
                            daily(resp, result, function(result) {
                                hourSort(resp, result, log, function(result) {
                                    return call(result);
                                });
                            });
                        });
                    });
                } else {
                    return null;
                }
            }
        });
    }
}

function formatted(epoch) {
    let d = new Date(0);
    d.setUTCSeconds(epoch);
    return (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}
function hours(epoch) {
    let d = new Date(0);
    d.setUTCSeconds(epoch);
    let hour_num = d.getHours();
    if (hour_num < 10) {
        hour_num = "0" + hour_num;
    }
    return hour_num;
}
function minutes(epoch) {
    let d = new Date(0);
    d.setUTCSeconds(epoch);
    return d.getMinutes();
}
function days(epoch) {
    let d = new Date(0);
    d.setUTCSeconds(epoch);
    return d.getDate();
}
function fulltime(epoch) {
    let min = minutes(epoch);
    if (min < 10) {
        min = "0" + min;
    }
    return hours(epoch) + ":" + min;
}
function weekday(epoch) {
    let d = new Date(0);
    d.setUTCSeconds(epoch);
    switch (d.getDay()) {
    case 0:
        return "Sunday";
    case 1:
        return "Monday";
    case 2:
        return "Tuesday";
    case 3:
        return "Wednesday";
    case 4:
        return "Thursday";
    case 5:
        return "Friday";
    case 6:
        return "Saturday";
    }
}

function minutely(resp, update, call) {
    try {
        for (const [index, element] of resp["minutely"].entries()) {
            update["minutes"][index] = element["precipitation"];
        }
        return call(update);
    } catch {
        return call(update);
    }
}

function hourly(resp, update, call) {
    for (const [place, hour] of resp["hourly"].entries()) {
        update["hourly"][place] = {};
        update["hourly"][place]["name"] = "" + hours(hour["dt"]);
        update["hourly"][place]["temp"] = hour["temp"];
        update["hourly"][place]["id"] = hour["weather"][0]["id"];
    }
    return call(update);
}

function daily(resp, update, call) {
    for (const [place, day] of resp["daily"].entries()) {
        update["days"][place] = {};
        update["days"][place]["name"] = weekday(day["dt"]);
        update["days"][place]["max"] = day["temp"]["max"];
        update["days"][place]["min"] = day["temp"]["min"];
        update["days"][place]["id"] = day["weather"][0]["id"];
    }
    return call(update);
}

function hourSort(resp, update, log, call) {
    let riseadded = false;
    let setadded = false;
    let sunrise_hour = parseInt(hours(resp["current"]["sunrise"]));
    let sunset_hour = parseInt(hours(resp["current"]["sunset"]));
    for (let time = 0; time < _.keys(update["hourly"]).length; time++) {
        if (time !== 0 && update["hourly"][time] !== undefined) {
            let hour = update["hourly"][time];
            let hour_prior = update["hourly"][(time - 1)];
            let spot;
            if (sunrise_hour < parseInt(hour["name"]) && !riseadded && sunrise_hour >= parseInt(hour_prior["name"])) {
                riseadded = true;
                spot = time - 0.5;
                update["hourly"][spot] = {"name": fulltime(resp["current"]["sunrise"]), "temp": "Sunrise", "id": 1};
                update["sunrise"] = spot;
            }
            if (sunset_hour < parseInt(hour["name"]) && !setadded && time !== 0 && sunset_hour >= parseInt(hour_prior["name"])) {
                setadded = true;
                spot = time - 0.5;
                update["hourly"][spot] = {"name": fulltime(resp["current"]["sunset"]), "temp": "Sunset", "id": 2};
                update["sunset"] = spot;
            }
        }
    }
    return call(update);
}

module.exports = weather;