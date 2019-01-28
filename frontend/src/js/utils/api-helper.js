const uuidv1 = require('uuid/v1');

export function MOCKrequestLoop(callback) {
  MOCKgetAll().then(data => {
    callback(data.userLists, data.cudosRecipients);
    setTimeout(() => MOCKrequestLoop(callback), 2000);
  });
}

export function MOCKgetAll() {
  return fetch('../../../mock-api/mock/mock.json')
    .then(res => {
      return res.json();
    })
    .then(data => {
      const topUnicorn_face = sortUsers(data.userList, 'unicorn_face');
      const topTada = sortUsers(data.userList, 'tada');
      const topAvocado = sortUsers(data.userList, 'avocado');
      return {
        userLists: { topUnicorn_face, topAvocado, topTada },
        cudosRecipients: data.cudosRecipients
      };
    });
}
export function MOCKgiveCudos() {
  //TODO make get || send {name, cudosType}
  return fetch('http://127.0.0.1:3000/giveCudos');
}
export function MOCKresetCudos() {
  return fetch('http://127.0.0.1:3000/resetCudos');
}
////////////////////
export function requestLoop(previousUserLists, callback) {
  getAll().then(nextUserLists => {
    for (let userListName in previousUserLists) {
      const nextUserList = nextUserLists[userListName];
      previousUserLists[userListName].map((previousUser, index) => {
        const nextUser = nextUserList[index];

        const receiver = getReceiverIfNoMatch(previousUser, nextUser);
        if (receiver) {
          callback(receiver, nextUserLits);
        }
      });
    }
    //callback({ name: "atle", cudosType: "tada" }, nextUserLists);
    setTimeout(() => requestLoop(nextUserLists, callback), 2000);
  });
}

export function getAll() {
  return fetch('http://creuna-cudos-server.azurewebsites.net/getAllUserData')
    .then(res => {
      return res.json();
    })
    .then(data => {
      const topUnicorn_face = sortUsers(data, 'unicorn_face');
      const topTada = sortUsers(data, 'tada');
      const topAvocado = sortUsers(data, 'avocado');
      return {
        topUnicorn_face,
        topTada,
        topAvocado
      };
    });
}

function sortUsers(userList, cudosType) {
  const newUserList = JSON.parse(JSON.stringify(userList));
  return newUserList
    .sort((user, nextUser) => {
      return user[cudosType] - nextUser[cudosType];
    })
    .reverse();
}

function getRecipientsIfNoMatch(previousUser, nextUser, cudosType) {
  if (previousUser[cudosType] !== nextUser[cudosType]) {
    return {
      name: nextUser.id,
      cudosType,
      id: uuidv1()
    };
  }
  return false;
}
