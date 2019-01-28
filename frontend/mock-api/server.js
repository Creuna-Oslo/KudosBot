const express = require('express');
const fs = require('fs');

const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/giveCudos', (req, res) => {
  console.log('GIVING CUDOS');
  res.send('gave cudos');
  fs.readFile('./mock/mock.json', (err, content) => {
    if (err) throw err;
    const userList = JSON.parse(content).userList;
    const cudosRecipients = JSON.parse(content).cudosRecipients;
    const cudosTypes = ['avocado', 'tada', 'unicorn_face'];
    const user = userList[Math.floor(Math.random() * userList.length)];
    const cudosType = cudosTypes[Math.floor(Math.random() * cudosTypes.length)];
    user[cudosType] += 1;

    const cudosRecipient = {
      name: user.id,
      cudosType,
      id: `${user._id}+${Math.random() * 9999}`
    };
    cudosRecipients.push(cudosRecipient);
    fs.writeFile(
      './mock/mock.json',
      JSON.stringify({ cudosRecipients, userList }),
      err => {
        if (err) throw err;
      }
    );
  });
});

app.get('/resetCudos', (req, res) => {
  console.log('Reset cudos');
  fs.readFile('./mock/mock.json', (err, content) => {
    if (err) throw err;
    const cudosRecipients = [];
    const userList = JSON.parse(content).userList;
    userList.map(user => {
      user.avocado = 0;
      user.tada = 0;
      user.unicorn_face = 0;
    });
    fs.writeFile(
      './mock/mock.json',
      JSON.stringify({ cudosRecipients, userList }),
      err => {
        if (err) throw err;
      }
    );
  });
});

app.listen(3000, () => {
  console.log('listening on 3000');
});
