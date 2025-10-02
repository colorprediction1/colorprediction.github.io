let score = 0;
const scoreDisplay = document.getElementById("score");
const colorBox = document.getElementById("colorBox");
const optionsDiv = document.getElementById("options");

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return rgb(${r}, ${g}, ${b});
}

function setGame() {
  optionsDiv.innerHTML = "";
  const correctColor = randomColor();
  colorBox.style.background = correctColor;

  let options = [correctColor];
  while (options.length < 3) {
    let newColor = randomColor();
    if (!options.includes(newColor)) {
      options.push(newColor);
    }
  }

  options = options.sort(() => Math.random() - 0.5);

  options.forEach(color => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.innerText = color;
    btn.onclick = () => checkAnswer(color, correctColor);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  if (selected === correct) {
    score++;
    alert("✅ Correct!");
  } else {
    score--;
    alert("❌ Wrong!");
  }
  scoreDisplay.innerText = "Score: " + score;
  setGame();
}

setGame();