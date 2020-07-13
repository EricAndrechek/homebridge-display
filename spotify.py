import requests
import json
import random

class Spotify:
    def __init__(self, auth):
        self.auth = auth
        cj = open('config.json', 'r')
        conf_json = json.load(cj)
        cj.close()
        try:
            self.refresh_token = conf_json['spotify']['refresh_token'].strip()
            self.refresh()
        except:
            print("Not logged in via Spotify, go to: {}".format(conf_json['spotify']['auth_url']))
    def login(self, access_token, refresh_token):
        self.access_token = access_token
        self.refresh_token = refresh_token
        cj = open('config.json', 'r')
        conf_json = json.load(cj)
        cj.close()
        conf_json['spotify']['refresh_token'] = self.refresh_token
        conf = open('config.json', 'w')
        json.dump(conf_json, conf)
        conf.close()
    def refresh(self):
        try:
            payload = 'grant_type=refresh_token&refresh_token={}'.format(self.refresh_token)
            headers = {
                'Authorization': 'Basic {}'.format(self.auth),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            r = requests.post(url='https://accounts.spotify.com/api/token', headers=headers, data=payload)
            if r.status_code == 200:
                self.access_token = r.json()['access_token']
            else:
                raise Exception(r.text)
        except AttributeError:
            pass
    def get(self, endpoint):
        r = requests.get(url='https://api.spotify.com/v1/me/player{}'.format(endpoint), headers={'Authorization': 'Bearer {}'.format(self.access_token)})
        return r.json() if len(r.text) > 0 else r.text
    def put(self, endpoint, json_body):
        headers = {
            'Authorization': 'Bearer {}'.format(self.access_token),
            'Content-Type': 'application/json'
        }
        requests.put(url='https://api.spotify.com/v1/me/player{}'.format(endpoint), headers=headers, data=json_body)
    def post(self, endpoint):
        requests.post(url='https://api.spotify.com/v1/me/player{}'.format(endpoint), headers={'Authorization': 'Bearer {}'.format(self.access_token)})
    def update(self):
        canupdate = False
        try:
            if self.refresh_token:
                canupdate = True
        except:
            pass
        if canupdate:
            user_playback = self.get('')
            update_json = {}

            try:
                update_json['is_playing'] = user_playback['is_playing']
            except:
                update_json['is_playing'] = False
            if update_json['is_playing']:
                try:
                    update_json['device'] = user_playback['device']['name']
                    update_json['device_type'] = user_playback['device']['type']
                    update_json['device_id'] = user_playback['device']['id']
                    update_json['volume'] = user_playback['device']['volume_percent']
                    update_json['shuffle_state'] = user_playback['shuffle_state']
                    update_json['repeat_state'] = user_playback['repeat_state']
                except KeyError:
                    if user_playback != {'error': {'status': 429, 'message': 'API rate limit exceeded'}}:
                        print(user_playback)
                    return {"error": 'cannot update, check logs'}

                currently_playing = self.get('/currently-playing')
                try:
                    update_json['progress_ms'] = currently_playing['progress_ms']
                    update_json['img_url'] = currently_playing['item']['album']['images'][0]['url']
                    update_json['artists'] = ", ".join([artist['name'] for artist in currently_playing['item']['artists']])
                    update_json['duration_ms'] = currently_playing['item']['duration_ms']
                    update_json['title'] = currently_playing['item']['name']
                    update_json['song_id'] = currently_playing['item']['id']
                except KeyError:
                    if currently_playing != {'error': {'status': 429, 'message': 'API rate limit exceeded'}}:
                        print(currently_playing)
                    return {"error": 'cannot update, check logs'}
                
                try:
                    liked = requests.get(url='https://api.spotify.com/v1/me/tracks/contains?ids={}'.format(update_json['song_id']), headers={'Authorization': 'Bearer {}'.format(self.access_token)})
                    update_json['liked'] = liked.json()[0]
                except KeyError:
                    pass

                devices = self.get('/devices')
                update_json['avaliable_devices'] = {}
                try:
                    for device in devices['devices']:
                        update_json['avaliable_devices'][device['name']] = device['id']
                except KeyError:
                    if devices != {'error': {'status': 429, 'message': 'API rate limit exceeded'}}:
                        print(devices)
                    return {"error": 'cannot update, check logs'}
                return update_json
            else:
                return update_json
        else:
            return {"error": 'cannot update, check logs'}
    def like_song(self, id):
        headers = {
            'Authorization': 'Bearer {}'.format(self.access_token),
            'Content-Type': 'application/json'
        }
        requests.put(url='https://api.spotify.com/v1/me/tracks?ids={}'.format(id), headers=headers, data=None)
    def unlike_song(self, id):
        headers = {
            'Authorization': 'Bearer {}'.format(self.access_token),
            'Content-Type': 'application/json'
        }
        requests.delete(url='https://api.spotify.com/v1/me/tracks?ids={}'.format(id), headers=headers, data=None)
        