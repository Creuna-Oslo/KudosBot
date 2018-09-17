import os
from slackclient import SlackClient

slack_token = os.environ["SLACK_BOT_KEY"]
print(slack_token)
sc = SlackClient(slack_token)

sc.api_call(
  "chat.postMessage",
  channel="#general",
  text="Glad i dere"
)

