const choices=document.getElementById("choices");
const prompt=document.getElementById("prompt");
const progressMessage=document.getElementById("progressMessage");
const heartTiles=document.getElementById("heartTiles");
const celebration=document.getElementById("celebration");
const questionCard=document.getElementById("questionCard");
const confetti=document.getElementById("confetti");
const canvas=document.getElementById("fireworks");
const context=canvas.getContext("2d");

let noCount=0;

// A simple 13 × 10 heart. Every "No" click turns one point into a little YES tile.
const heartPattern=[
  [2,0],[3,0],[6,0],[7,0],
  [1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],
  [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],
  [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],
  [1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],
  [2,5],[3,5],[4,5],[5,5],[6,5],[7,5],
  [3,6],[4,6],[5,6],[6,6],
  [4,7],[5,7]
];

const messageSteps=[
  "Choose carefully…",
  "Hmm… that button seems a little shy.",
  "Okay, but look — the heart is starting!",
  "You are making this very cute, you know.",
  "Almost enough Yes energy to finish the heart…",
  "No more escaping now. 💗"
];

function renderChoices(){
  const yesLabels=noCount===0?["Yes"]:noCount<3?["Yes","Yes"]:noCount<7?["Yes","Absolutely","Yes"]:["Yes","Of course","Definitely"];
  const completed=noCount>=heartPattern.length;
  choices.innerHTML="";

  yesLabels.forEach(label=>{
    const button=document.createElement("button");
    button.className="answer-button";
    button.textContent=label;
    button.addEventListener("click",celebrate);
    choices.append(button);
  });

  if(!completed){
    const noButton=document.createElement("button");
    noButton.className="answer-button no-button";
    noButton.textContent="No";
    noButton.addEventListener("click",chooseNo);
    choices.append(noButton);
  }else{
    questionCard.classList.add("heart-complete");
    prompt.textContent="The heart is complete. There is only one very lovely option left. 💞";
    progressMessage.textContent="Okay, now you really have to pick Yes. ✨";
  }
}

function chooseNo(){
  addHeartTile(noCount);
  noCount+=1;
  const step=Math.min(Math.floor(noCount/10)+1,messageSteps.length-1);
  progressMessage.textContent=`${messageSteps[step]} ${noCount}/${heartPattern.length}`;
  if(noCount===1) prompt.textContent="That No changed its mind. Now there are two Yes answers. 🌸";
  if(noCount===Math.ceil(heartPattern.length*.65)) prompt.textContent="You have nearly built a whole heart out of Yeses.";
  renderChoices();
}

function addHeartTile(index){
  const [x,y]=heartPattern[index];
  const tile=document.createElement("span");
  tile.className="yes-tile";
  tile.textContent="YES";
  const card=questionCard.getBoundingClientRect();
  // Fill the white card itself: this heart grows from edge to edge inside it.
  const cell=Math.min(card.width*.086,card.height*.105);
  const heartWidth=cell*10;
  const heartHeight=cell*8;
  const startX=card.left+(card.width-heartWidth)/2;
  const startY=card.top+(card.height-heartHeight)/2-8;
  tile.style.setProperty("--tile-size",`${cell*.92}px`);
  tile.style.left=`${startX+x*cell}px`;
  tile.style.top=`${startY+y*cell}px`;
  tile.style.animationDelay=`${(index%4)*.02}s`;
  heartTiles.append(tile);
}

function celebrate(){
  celebration.classList.add("is-visible");
  celebration.setAttribute("aria-hidden","false");
  questionCard.style.opacity="0";
  questionCard.style.transform="scale(.93)";
  // The finale deliberately arrives in three beats: fireworks, balloons, then confetti.
  launchFireworks();
  window.setTimeout(()=>celebration.classList.add("show-balloons"),850);
  window.setTimeout(launchConfetti,1650);
}

function launchConfetti(){
  const colours=["#ec5b91","#b784df","#ffc34f","#ffffff","#d13f77"];
  for(let index=0;index<140;index+=1){
    const piece=document.createElement("i");
    piece.className="confetti-piece";
    piece.style.left=`${Math.random()*100}%`;
    piece.style.top=`${-10-Math.random()*35}%`;
    piece.style.background=colours[index%colours.length];
    piece.style.setProperty("--drift",`${(Math.random()-.5)*290}px`);
    piece.style.animationDelay=`${Math.random()*.75}s`;
    confetti.append(piece);
  }
}

function launchFireworks(){
  canvas.width=window.innerWidth*devicePixelRatio;
  canvas.height=window.innerHeight*devicePixelRatio;
  context.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  const particles=[];
  const colours=["#ff4f91","#ffd35a","#c399ee","#fff"];
  [[.2,.26],[.78,.22],[.48,.14],[.68,.55]].forEach(([x,y])=>{
    for(let index=0;index<45;index+=1){
      const angle=(Math.PI*2*index)/45;
      const speed=2+Math.random()*4;
      particles.push({x:x*innerWidth,y:y*innerHeight,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:60+Math.random()*20,colour:colours[index%colours.length]});
    }
  });
  function animate(){
    context.clearRect(0,0,innerWidth,innerHeight);
    particles.forEach(particle=>{
      particle.x+=particle.vx;particle.y+=particle.vy;particle.vy+=.045;particle.life-=1;
      context.globalAlpha=Math.max(0,particle.life/75);
      context.fillStyle=particle.colour;
      context.fillRect(particle.x,particle.y,3,3);
    });
    if(particles.some(particle=>particle.life>0)) requestAnimationFrame(animate);
    else context.clearRect(0,0,innerWidth,innerHeight);
  }
  animate();
}

document.getElementById("replayButton").addEventListener("click",()=>location.reload());
renderChoices();
