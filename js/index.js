let topAvocado;
let topConfetti;
let topUnicorn;
const getAvocados = fetch("http://89151c4f.ngrok.io/getTopList?type=avocado")
  .then(res => {
    return res.json();
  })
  .then(data => {
    console.log(data);
    topAvocado = data;
  });
const getConfetti = fetch("http://89151c4f.ngrok.io/getTopList?type=tada")
  .then(res => {
    return res.json();
  })
  .then(data => {
    topConfetti = data;
  });
const getUnicorns = fetch(
  "http://89151c4f.ngrok.io/getTopList?type=unicorn_face"
)
  .then(res => {
    return res.json();
  })
  .then(data => {
    topUnicorn = data;
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
  if (isLeading) {
    $name.css({ fontSize: "1.5rem" });
    $score.css({ fontSize: "1.5rem" });
  }
  const $user = $("<div />")
    .addClass("user-wrapper")
    .append($header, $placement, $name, $score);
  return $user;
}
$(document).ready(() => {
  Promise.all([getAvocados, getConfetti, getUnicorns]).then(() => {
    topUnicorn.map((user, index) =>
      createTopThree(
        user,
        user.unicorn_face,
        "unicorn",
        index,
        " red"
      ).appendTo(".unicorns")
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
  });

  //animate header
  function moveLeft(header, time) {
    const screenWidth = window.innerWidth;
    console.log(screenWidth);
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
      console.log("skip");
      moveLeft(header, time);
    }, time * 1000 + 30);
  }

  const headers = [$(".header1"), $(".header2")];
  moveLeft($(".header1"), 12);
});
