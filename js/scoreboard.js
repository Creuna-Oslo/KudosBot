$(document).ready(() => {
  function addCudos(emo, name) {
    const emoImg = $("<img src=./css/" + emo + " />").addClass("emoji");
    const text = $("<p />")
      .addClass("gotCudos")
      .text(name);

    text.appendTo(".header1");
    emoImg.appendTo(".header1");
  }

  addCudos("avocado.png", "MW.OLSEN +");
  addCudos("unicorn.png", "ATLE.KRISTIANSEN");
  addCudos("confetti.png", "K.FINCKENHAGEN");
  addCudos("unicorn.png", "ANDREA CLAUSSEN");
  addCudos("confetti.png", "SONDRE.AHLGREN");
  addCudos("avocado.png", "IAH.DELGADO");
  addCudos("unicorn.png", "SARA.DALFALK");
  addCudos("confetti.png", "ENDRE.GJOLSTAD");
  addCudos("avocado.png", "MW.OLSEN");
  addCudos("unicorn.png", "ATLE.KRISTIANSEN");
  addCudos("confetti.png", "K.FINCKENHAGEN");
  addCudos("unicorn.png", "ANDREA CLAUSSEN");
  addCudos("confetti.png", "SONDRE.AHLGREN");
  addCudos("avocado.png", "IAH.DELGADO");
  addCudos("unicorn.png", "SARA.DALFALK");
  addCudos("confetti.png", "ENDRE.GJOLSTAD");
  addCudos("avocado.png", "MW.OLSEN");
  addCudos("unicorn.png", "ATLE.KRISTIANSEN");
  addCudos("confetti.png", "K.FINCKENHAGEN");
  addCudos("unicorn.png", "ANDREA CLAUSSEN");
  addCudos("confetti.png", "SONDRE.AHLGREN");
  addCudos("avocado.png", "IAH.DELGADO");
  addCudos("unicorn.png", "SARA.DALFALK");
  addCudos("confetti.png", "ENDRE.GJOLSTAD");
});
