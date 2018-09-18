import os
from slackclient import SlackClient
import requests
import json


slack_token = os.environ["SLACK_BOT_KEY"]
sc = SlackClient(slack_token)



result = sc.api_call(
  "im.open",
  user="UCU4A4FEC",
  text="hello world"
)

directChannel=result["channel"]["id"]
 
r = requests.get("http://10.30.6.26:3001/getUserData?id=mw.olsen")
data = r.json()
 
 
response = sc.api_call(
	
	"chat.postMessage",
	channel=directChannel,
	text="du har %s cudos! %s" % (data['cudos'], ":taco:")
)


