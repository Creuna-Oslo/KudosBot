let topAvocado;
let topConfetti;
let topUnicorn;
let prevData = {};
let shouldUpdate = false;
fetch("http://89151c4f.ngrok.io/getAllUserData")
  .then(res => {
    return res.json();
  })
  .then(data => {
    prevData = data;
  });
const getAvocados = fetch("http://89151c4f.ngrok.io/getTopList?type=avocado")
  .then(res => {
    console.log(res);
    return res.json();
  })
  .then(data => {
    console.log(data);
    topAvocado = data;
    return data;
  });
const getConfetti = fetch("http://89151c4f.ngrok.io/getTopList?type=tada")
  .then(res => {
    return res.json();
  })
  .then(data => {
    topConfetti = data;
    return data;
  });
const getUnicorns = fetch(
  "http://89151c4f.ngrok.io/getTopList?type=unicorn_face"
)
  .then(res => {
    return res.json();
  })
  .then(data => {
    topUnicorn = data;
    return data;
  });
function createTopThree(user, score, eleClass, index, color) {
  const isLeading = index === 0;
  const $header = isLeading
    ? $(`<img src=./css/${eleClass}.png />`).addClass("icon")
    : $("<div />");
  const $score = $("<div />")
    .addClass("score" + color)
    .text(score + " " + eleClass + "s");
  const $placement = $("<div />")
    .addClass(`${eleClass}-placement placement`)
    .text(index + 1);
  const $name = $("<div/>")
    .addClass("name" + color)
    .text(user.id.toUpperCase());
  const $user = $("<div />")
    .addClass("user-wrapper")
    .append($header, $placement, $name, $score);
  if (isLeading) {
    $name.css({ fontSize: "1.5rem" });
    $score.css({ fontSize: "1.5rem" });
  }
  return $user;
}
$(document).ready(() => {
  Promise.all([getAvocados, getConfetti, getUnicorns]).then(data => {
    update();
  });
  //animate header
  function moveLeft(header, time) {
    const screenWidth = window.innerWidth;
    setTimeout(
      () =>
        header.css({
          transition: `${time}s linear`,
          transform: "translate(-" + screenWidth + "px)"
        }),
      30
    );

    setTimeout(() => {
      header.css({
        transition: `0s`
      });
      header.css({
        transform: "translate(" + 0 + "px)"
      });
      moveLeft(header, time);
    }, time * 1000 - 370);
  }
  const headers = [$(".header1"), $(".header2")];
  moveLeft($(".header1"), 12);
});

setInterval(() => checkForUpdate(), 2000);

function checkForUpdate() {
  let name;
  let emoji;
  fetch("http://89151c4f.ngrok.io/getAllUserData")
    .then(res => {
      return res.json();
    })
    .then(data => {
      data.map((user, i) => {
        console.log("cudos:", prevData[i].cudos, user.cudos);
        if (prevData[i].cudos !== user.cudos) {
          shouldUpdate = true;
          name = user.id;
        }
      });
      prevData = data;
    });
  if (shouldUpdate) {
    clearScoreboard();
    console.log("IS UPDATING");
    update();
    shouldUpdate = false;
  }
  console.log(prevData);
}
function update() {
  console.log("ohijasfhfas");
  topUnicorn.map((user, index) =>
    createTopThree(user, user.unicorn_face, "unicorn", index, " red").appendTo(
      ".unicorns"
    )
  );
  topAvocado.map((user, index) =>
    createTopThree(user, user.avocado, "avocado", index, "").appendTo(
      ".avocados"
    )
  );
  topConfetti.map((user, index) =>
    createTopThree(user, user.tada, "confetti", index, " white").appendTo(
      ".confettis"
    )
  );
}
function clearScoreboard() {
  $(".user-wrapper").remove();
}
