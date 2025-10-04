let score = 0;
const scoreDisplay = document.getElementById("score");
const colorDisplay = document.getElementById("colorDisplay");
const optionsDiv = document.getElementById("options");

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return rgb(${r}, ${g}, ${b});
}

function newRound() {
  optionsDiv.innerHTML = "";

  // सही रंग चुनना
  const correctColor = randomColor();
  colorDisplay.style.backgroundColor = correctColor;

  // 3 ऑप्शन बनाना
  const options = [correctColor, randomColor(), randomColor()];

  // Shuffle
  options.sort(() => Math.random() - 0.5);

  // Option div बनाना
  options.forEach(color => {
    const div = document.createElement("div");
    div.classList.add("option");
    div.style.backgroundColor = color;

    div.addEventListener("click", () => {
      if (color === correctColor) {
        score++;
        alert("🎉 Correct!");
      } else {
        alert("❌ Wrong!");
      }
      scoreDisplay.textContent = score;
      newRound();
    });

    optionsDiv.appendChild(div);
  });
}

// Start game
newRound();