import requests
import json

r = requests.get("http://10.30.5.57:3001/getUserData?id=mw.olsen")

data = r.json()

print(data["id"])