let topAvocado;
let topConfetti;
let topUnicorn;
const getAvocados = fetch("http://89151c4f.ngrok.io/getTopAvocado")
  .then(res => {
    return res.json();
  })
  .then(data => {
    console.log(data);
    topAvocado = data;
  });
const getConfetti = fetch("http://89151c4f.ngrok.io/getTopConfetti")
  .then(res => {
    return res.json();
  })
  .then(data => {
    topConfetti = data;
  });
const getUnicorns = fetch("http://89151c4f.ngrok.io/getTopUnicorn")
  .then(res => {
    return res.json();
  })
  .then(data => {
    topUnicorn = data;
  });
function createTopThree(user, score, eleClass, index) {
  console.log(index);
  const isLeading = index === 0;
  const $header = isLeading
    ? $(`<img src=./css/${eleClass}.png />`).addClass("icon")
    : $("<div />");
  const $score = $("<div />")
    .addClass("score")
    .text(score + " " + eleClass + "s");
  const $placement = $("<div />")
    .addClass(`${eleClass}-placement placement`)
    .text(index + 1);
  const $name = $("<div/>")
    .addClass("name")
    .text(user.id.toUpperCase());
  if (isLeading) {
    $name.css({ fontSize: "2.5rem" });
    $score.css({ fontSize: "2rem" });
  }
  const $user = $("<div />")
    .addClass("user-wrapper")
    .append($header, $placement, $name, $score);
  return $user;
}
$(document).ready(() => {
  Promise.all([getAvocados, getConfetti, getUnicorns]).then(() => {
    console.log(topUnicorn, topAvocado, topConfetti);
    topUnicorn.map((user, index) =>
      createTopThree(user, user.unicorn_face, "unicorn", index).appendTo(
        ".unicorns"
      )
    );
    topAvocado.map((user, index) =>
      createTopThree(user, user.avocado, "avocado", index).appendTo(".avocados")
    );
    topConfetti.map((user, index) =>
      createTopThree(user, user.tada, "confetti", index).appendTo(".confettis")
    );
  });
});
