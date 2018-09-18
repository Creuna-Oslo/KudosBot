import os
from slackclient import SlackClient


slack_token = os.environ["SLACK_BOT_KEY"]
sc = SlackClient(slack_token)



result = sc.api_call(
  "im.open",
  user="UCU4A4FEC",
  text="hello world"
)

directChannel=result["channel"]["id"]
 
response = sc.api_call(
	"chat.postMessage",
	channel=directChannel,
	text="kan bare du sjå d hær"
)


