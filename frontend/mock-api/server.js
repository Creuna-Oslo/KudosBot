const express = require("express");
const fs = require("fs");

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/giveCudos", (req, res) => {
  console.log("GIVING CUDOS");
  res.send("gave cudos");
  fs.readFile("./mock/mock.json", (err, content) => {
    if (err) throw err;
    let parseJson = JSON.parse(content);

    const cudosTypes = ["avocado", "tada", "unicorn_face"];
    parseJson[Math.floor(Math.random() * parseJson.length)][
      cudosTypes[Math.floor(Math.random() * cudosTypes.length)]
    ] += 1;
    fs.writeFile("./mock/mock.json", JSON.stringify(parseJson), err => {
      if (err) throw err;
    });
  });
});

app.get("/resetCudos", (req, res) => {
  console.log("Reset cudos");
  fs.readFile("./mock/mock.json", (err, content) => {
    if (err) throw err;
    let parseJson = JSON.parse(content);
    parseJson.map(user => {
      user.avocado = 0;
      user.tada = 0;
      user.unicorn_face = 0;
    });
    fs.writeFile("./mock/mock.json", JSON.stringify(parseJson), err => {
      if (err) throw err;
    });
  });
});

app.listen(3000, () => {
  console.log("listening on 3000");
});
