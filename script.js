var canvas1 = document.getElementById("canvas1"), canvas2 = document.getElementById("canvas2"), canvas3 = document.getElementById("canvas3"), canvas4 = document.getElementById("canvas4"), canvas5 = document.getElementById("canvas5"), canvas6 = document.getElementById("canvas6"), scoreTable = document.getElementById("scoreTable"), randomRGB, start, score = 0, count = 6, multiplier = 10, falseAnswers = 0, colors = [canvas1,canvas2,canvas3,canvas4,canvas5,canvas6];
function drawCanvas() {
  var randomCanvas = Math.floor(Math.random()*6);  
  for(i=0; i<colors.length; i++){
    var ctx = colors[i].getContext("2d");
    colors[i].style.border = "6px solid white";
    if(i != randomCanvas){
     ctx.fillStyle = rgbGenerator();
     ctx.fillRect(0,0,canvas1.width,canvas1.height);
    }
    else{
     ctx.fillStyle = start;
     ctx.fillRect(0,0,canvas1.width,canvas1.height);      
    }
  }
}

function random() {
  var number = Math.random() * 256;
  return number;
}

function rgbGenerator() {
  var red = Math.floor(random());
  var green = Math.floor(random());
  var blue = Math.floor(random());
  randomRGB = "rgb("+red+","+green+","+blue+")";
  return randomRGB;
} 

function startRGB() { 
  document.getElementById("text").innerHTML = rgbGenerator();
  start = document.getElementById("text").innerHTML;
  falseAnswers = 0;
  count = 6;
}

function checkAnswer(element) {
  var context = element.getContext("2d");
  var data = context.getImageData(0,0,1,1);
  var control = "rgb("+data.data[0]+","+data.data[1]+","+data.data[2]+")";
  if(control == start){
    element.style.border = "6px solid green";
    writeScore();
    scoreTable.innerHTML = "Score: " + score + " +" + multiplier * count;
    setTimeout(startRGB,2000);
    setTimeout(drawCanvas,2000);
  }
  else{
     context.clearRect(0,0,element.width,element.height);
     element.style.border = "6px solid red";
     falseAnswers = falseAnswers + 1;
  }
}

function writeScore() {
  count = count - falseAnswers;
  score = score + multiplier * count;
}

window.onload = startRGB();
window.onload = drawCanvas();
