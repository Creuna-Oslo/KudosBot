let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let assert = require("assert");
let mongoClient = require("mongodb").MongoClient;
let _security = require("./security.json");
let _cudoType = ["avocado", "unicorn_face", "tada"];
let _emojiDictionary = {
  "129412": ":unicorn_face:",
  "129361": ":avocado:",
  "127881": ":tada:"
};
let _intros = [
  "Oh jolly! ",
  "Is this the real life? Is this just fantasy? No,",
  "This must be your lucky day!"
];
let url = _security.azure;
let {
  SlackOAuthClient
} = require("messaging-api-slack");

let slackClient = SlackOAuthClient.connect(_security.oauth);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.set("port", process.env.PORT || 3001);

app.get("/", (req, res) => {
  res.send("Cudos slash command API up and running");
});

validToken = token => token == _security.token;

validCudoBalance = userData => userData.cudos > 0;

getData = async func => {
  let client = await mongoClient.connect(url);
  let db = client.db("creuna-cudos");
  try {
    return await func(db);
  } finally {
    client.close();
  }
};

getUserData = async user =>
  await getData(
    async db =>
      await db.collection("users").findOne({
        id: user
      })
  );

getTopListData = async type =>
  await getData(
    async db =>
      await db
      .collection("users")
      .find({})
      .sort({
        [type]: -1
      })
      .limit(3)
      .toArray()
  );

getAllUserData = async () =>
  await getData(
    async db =>
      await db
      .collection("users")
      .find({})
      .toArray()
  );

getIntro = () => _intros[Math.floor(Math.random() * _intros.length)];

updateCudos = async (userData, type, value) =>
  await getData(async db =>
    db.collection("users").updateOne({
      id: userData.id
    }, {
      $set: {
        [type]: value
      }
    }));

giveCudos = async (fromUser, toUser, type, message) => {
  if (_cudoType.indexOf(type) <= -1)
    return "Whoops! You have entered an invalid command :scream: Please only use the emojis :avocado:, :unicorn_face: or :tada:, and write your command on the form /givecudos @user :emoji: message";
  let fromUserData = await getUserData(fromUser);
  if (!validCudoBalance(fromUserData))
    return "You don't have enough cudos to peform this action";
  let toUserID = await getToUserID(toUser);
  if (!toUserID) {
    return "Oh, this user doesn't exist.. I'm sure not all your friends are imaginary :cry:";
  }
  let toUserData = await getUserData(toUser);
  await updateCudos(fromUserData, "cudos", fromUserData.cudos - 1);
  await updateCudos(fromUserData, "cudos_given", fromUserData.cudos_given + 1);
  await updateCudos(toUserData, type, toUserData[type] + 1);
  sendMessageToReceiver(fromUser, toUserID, type, message);
  console.log(
    `Wow! You just gave a :${type}: to <@${toUser}> with the message _"${message}"_, I'm sure you made their day! :blush:`
  );
  return `Wow! You just gave a :${type}: to <@${toUser}> with the message _"${message}"_, I'm sure you made their day! :blush:`;
};

sendMessageToReceiver = async (fromUser, toUserID, type, message) => {
  intro = type == "avocado" ? "Holy Guacemole!" : getIntro();
  console.log(
    `${intro} <@${fromUser}> just sent you a :${type}:, with the message: _"${message}"_. Good on you! :sunglasses:`
  );
  slackClient.postMessage(
    toUserID, {
      text: `${intro} <@${fromUser}> just sent you a :${type}:, with the message: _"${message}"_. Good on you! :sunglasses:`
    }, {
      as_user: true
    }
  );
};

getSlackFullName = async (username, type) => {
  let users = await slackClient.getAllUserList();
  let data = "";
  users.map(user => {
    if (user.name == username) {
      data = user.profile[type] == "" ? user.name : user.profile[type];
    }
  });
  return data;
};

getToUserID = async username => {
  let users = await slackClient.getAllUserList();
  let userID = false;
  users.map(user => {
    if (user.name == username) {
      userID = user.id;
    }
  });
  return userID;
};

app.post("/cudos", async (req, res) => {
  let userName = req.body.user_name;
  let userPromise = await getUserData(userName);
  let user = await Promise.all(userPromise);
  if (!validToken(req.body.token)) {
    res.send("Invalid token");
    return;
  }
  let payload = {
    attachments: [{
        title: "Cudos Available",
        text: `:coin: : ${user.cudos}`,
        color: "#F7A70A"
      },
      {
        title: "Cudos Received",
        text: `:avocado: : ${user.avocado}\n :unicorn_face: : ${
          user.unicorn_face
        }\n :tada: : ${user.tada}`,
        color: "#71BC78"
      }
    ]
  };
  res.send(payload);
});

validEmoji = emoji =>
  emoji.codePointAt(0) in _emojiDictionary ?
  _emojiDictionary[emoji.codePointAt(0)].slice(1, -1) :
  emoji.slice(1, -1);

parseGiveCudosParameters = payload => {
  let result = {};
  let textSplit = payload.text.replace(/ +(?= )/g, "").split(" ");
  if (textSplit.length < 3) {
    result.error =
      "Oh bugger! You didn't specify a user, emoji and message, try to write your command on the form /givecudos @user :emoji: message";
    return result;
  }
  result.toUser = textSplit[0].replace("@", "");
  result.fromUser = payload.user_name;
  result.type = validEmoji(textSplit[1]);
  result.message = textSplit.slice(2, textSplit.length).join(" ");
  result.token = payload.token;
  if (!validToken(result.token)) result.error = "Invalid token";
  else if (result.fromUser == result.toUser)
    result.error = "Jeez.. giving cudos to yourself? :exploding_head:";
  return result;
};

app.post("/giveCudos", async (req, res) => {
  let parameters = parseGiveCudosParameters(req.body);
  if (parameters.error) {
    res.send(parameters.error);
    return;
  }
  let result = await Promise.resolve(
    giveCudos(
      parameters.fromUser,
      parameters.toUser,
      parameters.type,
      parameters.message
    )
  );
  res.send({
    text: result
  });
});

app.listen(app.get("port"), () => {
  console.log("Example app listening on port " + app.get("port"));
});

app.get("/getTopList", async (req, res) => {
  let result = await Promise.resolve(getTopListData(req.query.type));
  promises = result.map(async user => {
    user.id = await getSlackFullName(user.id, "real_name");
    return user;
  });
  result = await Promise.all(promises);
  res.send(result);
});

app.get("/getAllUserData", async (req, res) => {
  let result = await Promise.resolve(getAllUserData());
  res.send(result);
});