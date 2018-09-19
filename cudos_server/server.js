const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const assert = require("assert");
var mongoClient = require("mongodb").MongoClient;
const _security = require("./security.json");
const _cudoType = ["avocado", "unicorn_face", "tada"];
const url = _security["azure"];
const { SlackOAuthClient } = require("messaging-api-slack");

const slackClient = SlackOAuthClient.connect(_security["oauth"]);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.set("port", 3001);

app.get("/", (req, res) => {
  res.send("Cudos slah command API up and running");
});

app.post("/slack", (req, res) => {
  var data = "";
  req.on("data", chunk => {
    data += chunk.toString();
  });
  req.on("end", () => {
    res.write(data);
    res.end();
  });
});

app.get("/getUserData", (req, res) => {
  const user = req.query.id;
  mongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      var dbo = db.db("creuna-cudos");
      dbo.collection("users").findOne({ id: user }, (err, result) => {
        if (err) throw err;
        res.send(result);
        db.close();
      });
    }
  );
});

app.get("/setData", (req, res) => {
  const type = req.query.type;
  const user = req.query.id;
  const newCudosValue = parseInt(req.query.value);
  mongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      var dbo = db.db("creuna-cudos");
      dbo
        .collection("users")
        .updateOne(
          { id: user },
          { $set: { [type]: newCudosValue } },
          (err, result) => {
            if (err) throw err;
            res.send(result);
            db.close();
          }
        );
    }
  );
});

app.get("/getTopFive", (req, res) => {
  const user = req.query.id;
  mongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      var dbo = db.db("creuna-cudos");
      dbo
        .collection("users")
        .find({})
        .sort({ cudos_given: -1 })
        .limit(5)
        .toArray((err, result) => {
          if (err) throw err;
          res.send(result);
          db.close();
        });
    }
  );
});

validToken = token => token == _security["token"];

validCudoBalance = userData => userData["cudos"] > 0;

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
  await getData(async db => await db.collection("users").findOne({ id: user }));

getTopListData = async type =>
  await getData(
    async db =>
      await db
        .collection("users")
        .find({})
        .sort({ [type]: -1 })
        .limit(3)
        .toArray()
  );

updateCudos = async (userData, type, value) =>
  await getData(async db =>
    db
      .collection("users")
      .updateOne({ id: userData["id"] }, { $set: { [type]: value } })
  );

giveCudos = async (fromUser, toUser, type, message) => {
  if (_cudoType.indexOf(type) <= -1)
    return 'Invalid cudo type, use :avocado:, :unicorn_face: or :tada:';
  var fromUserData = await getUserData(fromUser);
  if (!validCudoBalance(fromUserData))
    return "You don't have enough cudos to peform this action";
  var toUserData = await getUserData(toUser);
  await updateCudos(fromUserData, "cudos", fromUserData.cudos -1);
  await updateCudos(fromUserData, "cudos_given", fromUserData.cudos_given + 1);
  await updateCudos(toUserData, type, toUserData[type] + 1);
  sendMessageToReceiver(fromUser, toUser, type, message);
  return `gave 1 cudo to ${toUser}`;
};

sendMessageToReceiver = async (fromUser, toUser, type, message) => {
  var toUserID = await getToUserID(toUser);
  slackClient.postMessage(
    toUserID,
    {
      text: `${fromUser} har sendt deg en :${type}:, med melding _"${message}"_`
    },
    { as_user: true }
  );
};

getToUserID = async username => {
  var users = await slackClient.getAllUserList();
  var userID = "";
  users.forEach(user => {
    if (user["name"] == username) {
      userID = user["id"];
    }
  });
  return !userID == "" ? userID : false;
};

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.post(
  "/cudos",
  asyncMiddleware(async (req, res, next) => {
    const userName = req.body["user_name"];
    let user = await getUserData(userName);
    var payload = {
      text: `cudos to give: ${user.cudos}\n cudos given: ${
        user.cudos_given
      }\n :avocado: ${user.avocado}\n :unicorn_face: ${
        user.unicorn_face
      }\n :tada: ${user.tada}`
    };
    res.send(payload);
  })
);

parseGiveCudosParameters = payload => {
  var result = {};
  var textSplit = payload.text.split(" ");
  if (textSplit.length < 3) {
    result.error = "Please specify user, cudo type and message";
    return result;
  }
  result.toUser = textSplit[0].substring(1);
  result.fromUser = payload.user_name;
  result.type = textSplit[1].slice(1, -1);
  result.message = textSplit.slice(2, textSplit.length).join(" ");
  result.token = payload.token;
  if (!validToken(result.token)) result.error = "Invalid token";
  else if (result.fromUser == result.toUser)
    result.error = "Jeez.. giving cudos to yourself? :exploding_head:";
  return result;
};

app.post(
  "/giveCudos",
  asyncMiddleware(async (req, res, next) => {
    const parameters = parseGiveCudosParameters(req.body);
    if (parameters.error) {
      res.send(parameters.error);
      return;
    }
    let result = await giveCudos(
      parameters.fromUser,
      parameters.toUser,
      parameters.type,
      parameters.message
    );
    res.send({text: result});
  })
);

app.listen(app.get("port"), () => {
  console.log("Example app listening on port " + app.get("port"));
});

app.get(
  "/getTopList",
  asyncMiddleware(async (req, res, next) => {
    let result = await getTopListData(req.query.type);
    res.send(result);
  })
);
