const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const assert = require("assert");
var mongoClient = require("mongodb").MongoClient;
const _security = require("./security.json");
const _cudoType = ["avocado", "unicorn_face", "tada"];
const url = _security["azure"];

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
        console.log(result);
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
            console.log(result);
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
          console.log(result);
          res.send(result);
          db.close();
        });
    }
  );
});

app.post("/cudos", (req, res) => {
  const payload = req.body;
  const user = payload["user_name"];
  mongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      var dbo = db.db("creuna-cudos");
      dbo.collection("users").findOne({ 'id': user }, (err, result) => {
            if (err) throw err;
        var payload = { text: `cudos to give: ${result["cudos"]}\n cudos given: ${result["cudos_given"]}\n :avocado: ${result["avocado"]}\n :unicorn_face: ${result["unicorn_face"]}\n :tada: ${result["tada"]}` };
            res.send(payload);
            db.close();
          }
        );
    } );
});

validToken = token => token == _security["token"];

validateCudoBalance = userData => userData["cudos"] > 0;

getUserData = async user => {
  let client = await mongoClient.connect(url);
  let db = client.db("creuna-cudos");
  try {
    return await db.collection("users").findOne({ id: user });
  } finally {
    client.close();
  }
};

updateCudos = async (userData, type, value) => {
  let client = await mongoClient.connect(url);
  let db = client.db("creuna-cudos");
  try {
    db.collection("users").updateOne(
      { id: userData["id"] },
      { $set: { [type]: value } }
    );
  } finally {
    client.close();
  }
};

giveCudos = async (fromUser, toUser, type) => {
  if (_cudoType.indexOf(type) > -1) {
    var fromUserData = await getUserData(fromUser);
    var toUserData = await getUserData(toUser);
    var newFromCudosValue = fromUserData["cudos"] - 1;
    var newFromCudosGivenValue = fromUserData["cudos_given"] + 1;
    var newToCudosReceivedValue = toUserData[type] + 1;
    if (validateCudoBalance(fromUserData)) {
      await updateCudos(fromUserData, "cudos", newFromCudosValue);
      await updateCudos(fromUserData, "cudos_given", newFromCudosGivenValue);
      await updateCudos(toUserData, type, newToCudosReceivedValue);
      return { text: `gave 1 cudo to ${toUser}` };

    } else return { text: "You don't have enough cudos to peform this action" };
  } else return { text: "Not a valid cudo type, use :avocado:, :unicorn_face: or :tada:" };
}

validText = (text) => {
  if (text == '') {
    res.send({ text: 'Please specify user, cudo type and message' });
    return;
  }
  var textSplit = text.split(" ");
  if (textSplit.length < 3) {
    res.send({ text: 'Please specify user, cudo type and message' });
    return;
  }
  return textSplit;
}

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.post('/giveCudos', asyncMiddleware(async (req, res, next) => {
  const payload = req.body;
  const textSplit = validText(payload['text']);
  const type = textSplit[1].slice(1, -1);
  //message to be used in message sent to receiving user
  const message = textSplit.slice(2, textSplit.length).join(' ')
  console.log(message);
  const fromUser = payload["user_name"];
  const toUser = textSplit[0].substring(1);
  if(fromUser == toUser){
    res.send({ text: "Jeez.. giving cudos to yourself? :exploding_head:" });
    return;
  }
  const token = payload["token"]
  var response = validToken(token) ?
    await giveCudos(fromUser, toUser, type)
    : { text: "Invalid token" };
  res.send(response);
}));

app.listen(app.get("port"), () => {
  console.log("Example app listening on port " + app.get("port"));
});

//for display
app.get("/getTopAvocado", (req, res) => {
  const user = req.query.id;
  mongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      var dbo = db.db("creuna-cudos");
      dbo
        .collection("users")
        .find({})
        .sort({ avocado: -1 })
        .limit(3)
        .toArray((err, result) => {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
    }
  );
});
app.get("/getTopConfetti", (req, res) => {
  const user = req.query.id;
  mongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      var dbo = db.db("creuna-cudos");
      dbo
        .collection("users")
        .find({})
        .sort({ avocado: -1 })
        .limit(3)
        .toArray((err, result) => {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
    }
  );
});
app.get("/getTopUnicorn", (req, res) => {
  const user = req.query.id;
  mongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      var dbo = db.db("creuna-cudos");
      dbo
        .collection("users")
        .find({})
        .sort({ avocado: -1 })
        .limit(3)
        .toArray((err, result) => {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
    }
  );
});
