import requests
import datetime

class weather:
    def __init__(self, api, lat, lon):
        self.key = api
        self.lon = lon
        self.lat = lat
    def update(self):
        resp = requests.get("https://api.openweathermap.org/data/2.5/onecall?lat={}&lon={}&units=imperial&appid={}".format(self.lat, self.lon, self.key)).json()
        update = {}
        update['temp'] = resp['current']['temp']
        update['feels'] = resp['current']['feels_like']
        update['humidity'] = resp['current']['humidity']
        update['wind'] = resp['current']['wind_speed']
        update['id'] = resp['current']['weather'][0]['id']
        update['minutes'] = {}
        for place, minute in enumerate(resp['minutely']):
            update['minutes'][place] = minute['precipitation']
        update['hourly'] = {}
        for place, hour in enumerate(resp['hourly']):
            update['hourly'][place] = {}
            update['hourly'][place]['name'] = self.hours(hour["dt"])
            update['hourly'][place]['temp'] = hour['temp']
            update['hourly'][place]['id'] = hour['weather'][0]['id']
        update['days'] = {}
        for place, day in enumerate(resp['daily']):
            update['days'][place] = {}
            update['days'][place]['name'] = self.weekday(day["dt"])
            update['days'][place]['max'] = day['temp']['max']
            update['days'][place]['min'] = day['temp']['min']
            update['days'][place]['id'] = day['weather'][0]['id']
        riseadded = False
        setadded = False
        for time in range(len(update['hourly'])):
            if time != 0:
                hour = update['hourly'][time]
                hour_prior = update['hourly'][(time - 1)]
                sunrise_hour = self.hours(resp['current']['sunrise'])
                sunset_hour = self.hours(resp['current']['sunset'])
                if sunrise_hour < hour['name'] and not riseadded and sunrise_hour >= hour_prior['name']:
                    riseadded = True
                    spot = time - 0.5
                    update['hourly'][spot] = {'name': self.fulltime(resp['current']['sunrise']), 'temp': 'Sunrise', 'id': 1}
                    update['sunrise'] = spot
                if sunset_hour < hour['name'] and not setadded and time != 0 and sunset_hour >= hour_prior['name']:
                    setadded = True
                    spot = time - 0.5
                    update['hourly'][spot] = {'name': self.fulltime(resp['current']['sunset']), 'temp': 'Sunset', 'id': 2}
                    update['sunset'] = spot
        '''
        JSON update should look like:
        {
            'sunrise': 'XX:XX',
            'sunset': 'XX:XX',
            'temp': XX.XX,
            'feels': XX.XX,
            'humidity': XX,
            'wind': X.XX,
            'id': '701', # check https://openweathermap.org/weather-conditions
            'minutes': { # should be 60 data points (so 1 every minute for the course of an hour)
                '0': XX,
                '1': XX...
            },
            'hourly': { # should be 48 of these (so 1 every hour for the course of 48 hours)
                '0': {
                    'name': '6',
                    'temp': XX.XX,
                    'id': '701'
                },
                '1': {
                    'name': '20',
                    'temp': XX.XX,
                    'id': '701'
                }...
            },
            'days': { # should be 7 of these (1 for every day for a week)
                '0': {
                    'name': 'Tuesday',
                    'max': XX.XX,
                    'min': XX.XX,
                    'id': '701'
                },
                '1': {
                    'name': 'Wednesday',
                    'max': XX.XX,
                    'min': XX.XX,
                    'id': '701'
                }...
            }
        }
        '''
        return update
    def formatted(self, epoch):
        return datetime.datetime.fromtimestamp(epoch).strftime('%m-%d-%Y %H:%i:%s')
    def hours(self, epoch):
        return datetime.datetime.fromtimestamp(epoch).strftime('%H')
    def minutes(self, epoch):
        return datetime.datetime.fromtimestamp(epoch).strftime('%M')
    def days(self, epoch):
        return datetime.datetime.fromtimestamp(epoch).strftime('%d')
    def fulltime(self, epoch):
        return datetime.datetime.fromtimestamp(epoch).strftime('%H:%M')
    def weekday(self, epoch):
        return datetime.datetime.fromtimestamp(epoch).strftime('%A')