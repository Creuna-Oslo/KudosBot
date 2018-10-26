export function MOCKrequestLoop(previousUserLists, callback) {
  MOCKgetAll().then(nextUserLists => {
    for (let userListName in previousUserLists) {
      const nextUserList = nextUserLists[userListName];
      previousUserLists[userListName].map((previousUser, index) => {
        const nextUser = nextUserList[index];
        const cudosType = userListName.slice(3).toLowerCase();
        const receiver = getReceiverIfNoMatch(
          previousUser,
          nextUser,
          cudosType
        );
        if (receiver) {
          console.log("updating state");
          callback(receiver, nextUserLists);
        }
      });
    }
    //callback({ name: "atle", cudosType: "tada" }, nextUserLists);
    setTimeout(() => MOCKrequestLoop(nextUserLists, callback), 2000);
  });
}

export function MOCKgetAll() {
  return fetch("../../../mock-api/mock/mock.json")
    .then(res => {
      return res.json();
    })
    .then(data => {
      const topUnicorn_face = sortUsers(data, "unicorn_face");
      const topTada = sortUsers(data, "tada");
      const topAvocado = sortUsers(data, "avocado");
      return {
        topUnicorn_face,
        topAvocado,
        topTada
      };
    });
}
export function MOCKgiveCudos() {
  //TODO make get || send {name, cudosType}
  fetch("http://localhost:3000/giveCudos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify()
  });
}
export function MOCKresetCudos() {
  fetch("http://localhost:3000/resetCudos");
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
  return fetch("http://creuna-cudos-server.azurewebsites.net/getAllUserData")
    .then(res => {
      return res.json();
    })
    .then(data => {
      const topUnicorn_face = sortUsers(data, "unicorn_face");
      const topTada = sortUsers(data, "tada");
      const topAvocado = sortUsers(data, "avocado");
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

function getReceiverIfNoMatch(previousUser, nextUser, cudosType) {
  if (previousUser[cudosType] !== nextUser[cudosType]) {
    return {
      name: nextUser.id,
      cudosType
    };
  }
  return false;
}