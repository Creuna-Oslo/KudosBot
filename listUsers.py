import os
from slackclient import SlackClient


slack_token = os.environ["SLACK_BOT_KEY"]
sc = SlackClient(slack_token)



result = sc.api_call(
  "users.list"
)


for user in result["members"]:
	print(user["id"], user["name"])

