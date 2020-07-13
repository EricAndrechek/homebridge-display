import requests
import json

class homebridge:
    def __init__(self, ip, pin):
        self.ip = ip
        self.header = {'Content-Type': 'Application/json', 'Authorization': pin}
    def get_status(self):
        url = self.ip + '/accessories'
        resp = requests.get(url=url, headers=self.header).json()
        devices = []
        for device in resp['accessories']:
            aid = device['aid']
            name = device['services'][1]['characteristics'][0]['value']
            try:
                state = device['services'][1]['characteristics'][1]['value']
                if type(state) == bool:
                    devices.append({'aid': aid, 'name': name, 'state': state})
            except IndexError:
                pass
        return devices
    def toggle_switch(self, aid, state):
        url = self.ip + '/characteristics'
        data = json.dumps({
            "characteristics": [
                {
                    "aid": int(aid),
                    "iid": 10,
                    "value": state
                }
            ]
        })
        resp = requests.put(url=url, headers=self.header, data=data)