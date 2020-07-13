from flask import Flask, request, send_from_directory, render_template, redirect
from apscheduler.schedulers.background import BackgroundScheduler
import urllib.parse
import requests
import base64
import json
from spotify import Spotify
from flask_socketio import SocketIO, emit
import six
from weather import weather
from homebridge import homebridge
from news import newsfeed

cf = open('config.json', 'r')
conf = json.loads(cf.read())

scope = urllib.parse.quote(conf['spotify']['scopes']).strip()
cid = conf['spotify']['cid'].strip()
secret = conf['spotify']['sec'].strip()
lat = conf['weather']['lat'].strip()
lon = conf['weather']['lon'].strip()
weather_api = conf['weather']['api'].strip()
ip = conf['homebridge']['ip_address'].strip()
pin = conf['homebridge']['pin'].strip()
articles = conf['newsfeed']

auth_str = bytes('{}:{}'.format(cid, secret), 'utf-8')
auth_header = base64.b64encode(auth_str).decode('utf-8')
rurl = conf['spotify']['rurl'].strip()
auth_url = "https://accounts.spotify.com/authorize?response_type=code&client_id={}&scope={}&redirect_uri={}".format(cid, scope, rurl)

app = Flask(__name__, static_url_path='')
spot = Spotify(auth_header)
weath = weather(weather_api, lat, lon)
iot = homebridge(ip, pin)
news = newsfeed(articles)

cf.close()

sched = BackgroundScheduler(daemon=True)
sched.add_job(spot.refresh, 'interval', minutes=60)
sched.start()
socketio = SocketIO(app)

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

@app.route('/static/<path:path>')
def data(path):
    return send_from_directory('static', path)


@app.route('/')
def home():
    return render_template('home.html')


@socketio.on('lyrics')
def get_lyrics(url):
    resp = requests.get(url=url)
    if resp.status_code == 200 and len(resp.json()) > 0:
        socketio.emit("lyrics", json.dumps(resp.json()))
    else:
        socketio.emit("lyrics", json.dumps({"error": resp.text}))

@socketio.on('switch')
def flip_switch(name):
    switch_name = name[0]
    state = name[1]
    print('setting {} to {}'.format(switch_name, state))
    iot.toggle_switch(switch_name, state)

@socketio.on('news')
def get_news():
    socketio.emit('news', json.dumps(news.update()))

@socketio.on('iot')
def iot_update():
    socketio.emit('iot', json.dumps(iot.get_status()))

@socketio.on('debugger')
def get_debug(data):
    print(data)

@socketio.on('weather')
def fetch_weather():
    emit('weather', json.dumps(weath.update()))

@socketio.on('update')
def fetch_update():
    emit('update', json.dumps(spot.update()))

@socketio.on('transfer')
def transfer_playback(device_id):
    spot.put('', json.dumps({"device_ids": [device_id]}))
    print('transfering playback to {}'.format(device_id))

@socketio.on('like')
def like_track(id):
    spot.like_song(id)
    print('liked')

@socketio.on('unlike')
def unlike_track(id):
    spot.unlike_song(id)
    print('unliked')

@socketio.on('next')
def next_track():
    spot.post('/next')
    print('next')

@socketio.on('pause')
def pause_track():
    spot.put('/pause', None)
    print('pause')

@socketio.on('back')
def last_track():
    spot.post('/previous')
    print('back')

@socketio.on('seek')
def seek_pos(pos):
    spot.put('/seek?position_ms={}'.format(pos), None)
    print('seeking to {}ms'.format(pos))

@socketio.on('resume')
def resume_track():
    spot.put('/play', None)
    print('resume')

@socketio.on('volume')
def set_volume(percentage):
    spot.put('/volume?volume_percent={}'.format(percentage), None)
    print('volume set to {}%'.format(percentage))

@socketio.on('shuffle')
def toggle_shuffle(bool):
    spot.put('/shuffle?state={}'.format(bool), None)
    print('shuffle set to {}'.format(bool))

@socketio.on('repeat')
def toggle_repeat(state):
    spot.put('/repeat?state={}'.format(state), None)
    print('repeat set to {}'.format(state))


@app.route('/callback')
def spotfylogin():
    code = request.args.get('code', default = 'ERROR')
    if code != 'ERROR':
        payload = 'grant_type=authorization_code&code={}&redirect_uri={}'.format(code, rurl)
        headers = {
            'Authorization': 'Basic {}'.format(auth_header),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        r = requests.post(url='https://accounts.spotify.com/api/token', headers=headers, data=payload)
        if r.status_code == 200:
            at = r.json()['access_token']
            rt = r.json()['refresh_token']
            spot.login(at, rt)
            return redirect('/')
        else:
            return r.text
    else:
        return request.args.get('error')


if __name__ == "__main__":
    print('begining')
    socketio.run(app, host='0.0.0.0')