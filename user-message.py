import os
from slackclient import SlackClient

slack_token = os.environ["SLACK_BOT_KEY"]
sc = SlackClient(slack_token)
print(slack_token)
sc.api_call(
  "chat.postEphemeral",
  channel="#general",
  text="Halla",
  user="@Sondre Ahlgren"
)