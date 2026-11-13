
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ONE SOUL LUDO</title>
<style>
*{box-sizing:border-box}
body{
 margin:0;padding:12px;background:
 radial-gradient(circle at top,#263d5d,#080e1b 75%);
 color:white;font-family:Arial,sans-serif;text-align:center;
}
h1{
 margin:8px;color:#ffe18a;font-size:27px;
 text-shadow:0 3px 12px #ffb52d;
 letter-spacing:2px;
}
.subtitle{color:#a9bedb;font-size:12px;letter-spacing:3px}
.players{
 display:grid;grid-template-columns:1fr 1fr;
 gap:10px;max-width:520px;margin:18px auto;
}
.player{
 border:2px solid #53657f;border-radius:18px;
 padding:10px 7px;
 background:linear-gradient(145deg,#31435e,#172338);
 box-shadow:0 6px 12px #0008,inset 0 1px 3px #ffffff35;
 transition:.2s;
}
.player.active{
 border-color:#ffe078;
 box-shadow:0 0 15px #ffcf53aa,0 5px 15px #0009;
 transform:translateY(-2px);
}
.profile{display:flex;align-items:center;justify-content:center;gap:9px}
.avatar{
 width:43px;height:43px;border-radius:50%;
 display:grid;place-items:center;
 font-size:23px;border:3px solid white;
 box-shadow:0 3px 8px #0009;
}
.red .avatar{background:linear-gradient(135deg,#ff7777,#a80000)}
.green .avatar{background:linear-gradient(135deg,#9bff9b,#08752b)}
.yellow .avatar{background:linear-gradient(135deg,#fff28a,#bd8a00)}
.blue .avatar{background:linear-gradient(135deg,#8ed8ff,#0755b5)}
.playername{font-size:15px;font-weight:900;letter-spacing:1px}
.turntext{font-size:10px;color:#b8c8db;margin-top:4px}
.dicerow{display:flex;align-items:center;justify-content:center;gap:12px;margin:10px 0}
.die{
 width:51px;height:51px;border-radius:13px;
 border:2px solid #fff;background:linear-gradient(145deg,#fff,#c8d1dc);
 color:#202a3a;font-size:35px;
 display:grid;place-items:center;
 box-shadow:0 5px 8px #0009,inset 0 2px 4px white;
}
.roll{
 border:0;border-radius:10px;padding:10px 12px;
 color:#1b2434;background:linear-gradient(#ffe78d,#e3a92b);
 font-weight:900;font-size:12px;
 box-shadow:0 4px 7px #0008;
}
.roll:disabled{opacity:.4}
.score{font-size:11px;color:#d5e0ed}
.boardframe{
 width:min(96vw,490px);margin:16px auto;
 padding:7px;border-radius:17px;
 background:linear-gradient(145deg,#e5d4a1,#68502a,#f3d98a);
 box-shadow:0 12px 25px #000b,0 0 0 2px #fff5;
}
#board{
 width:100%;aspect-ratio:1;display:grid;
 grid-template-columns:repeat(15,1fr);
 grid-template-rows:repeat(15,1fr);
 background:#d7dce5;border:3px solid #172338;
 overflow:hidden;border-radius:7px;
}
.cell{
 min-width:0;min-height:0;position:relative;
 display:flex;align-items:center;justify-content:center;
 border:1px solid #aeb8c5;
 background:linear-gradient(145deg,#fff,#e6eaf0);
}
.redbase{background:linear-gradient(135deg,#ffb3b3,#e84c4c)}
.greenbase{background:linear-gradient(135deg,#b4f4c0,#2ca95b)}
.yellowbase{background:linear-gradient(135deg,#fff1a5,#e2b92c)}
.bluebase{background:linear-gradient(135deg,#b4dcff,#398bd4)}
.redlane{background:linear-gradient(135deg,#ff7777,#d82222)}
.greenlane{background:linear-gradient(135deg,#8df1a3,#168b43)}
.yellowlane{background:linear-gradient(135deg,#fff18b,#d5a500)}
.bluelane{background:linear-gradient(135deg,#9bd4ff,#176fc2)}
.track{background:linear-gradient(135deg,#fff,#dce3ec)}
.redstart{background:#d82222!important}
.greenstart{background:#168b43!important}
.yellowstart{background:#d5a500!important}
.bluestart{background:#176fc2!important}
.baseinner{
 position:absolute;inset:12%;border-radius:13%;
 background:linear-gradient(145deg,#fff,#dce2e9);
 box-shadow:inset 0 3px 9px #0004,0 2px 4px #fff8;
 display:grid;grid-template-columns:1fr 1fr;
 grid-template-rows:1fr 1fr;gap:8%;padding:12%;
}
.homepiece{
 border-radius:50%;background:linear-gradient(145deg,#fff,#b9c3d0);
 border:2px solid #fff;box-shadow:0 3px 5px #0005;
}
.center{
 background:conic-gradient(#ed3434 0 25%,#23a853 25% 50%,#e6bd23 50% 75%,#287ed1 75%);
}
.token{
 width:92%;height:92%;padding:0;
 border-radius:50%;border:2px solid white;
 color:white;font-weight:900;font-size:clamp(8px,2.5vw,14px);
 cursor:pointer;z-index:5;
 box-shadow:0 3px 5px #0009,inset 0 2px 5px #ffffff88;
}
.token.red{background:radial-gradient(circle at 30% 25%,#ffaaaa,#ed2727 55%,#8b0000)}
.token.green{background:radial-gradient(circle at 30% 25%,#c4ffbd,#1aaf50 55%,#075b28)}
.token.yellow{background:radial-gradient(circle at 30% 25%,#fff5ad,#f1c323 55%,#916400)}
.token.blue{background:radial-gradient(circle at 30% 25%,#c1eaff,#2584e5 55%,#063b91)}
.token:disabled{cursor:default}
#status{
 max-width:490px;margin:12px auto;padding:14px;
 border-radius:13px;background:linear-gradient(145deg,#314968,#17253b);
 border:1px solid #7c96b6;box-shadow:0 5px 12px #0007;
 font-size:15px;font-weight:bold;
}
.action{
 border:0;border-radius:11px;padding:12px 20px;
 font-weight:bold;font-size:14px;margin:6px;
 background:linear-gradient(#ffe78d,#e3aa2c);
 color:#172238;box-shadow:0 4px 8px #0008;
}
#pass{background:linear-gradient(#c4d6f0,#7598c7)}
.small{font-size:11px;color:#9eafc5;margin:16px 0}
@media(max-width:350px){
 .player{padding:7px 3px}
 .die{width:42px;height:42px;font-size:28px}
 .roll{padding:8px 6px;font-size:10px}
 .playername{font-size:12px}
}
</style>
</head>
<body>

<h1>👑 ONE SOUL LUDO 👑</h1>
<div class="subtitle">PREMIUM FOUR PLAYER GAME</div>

<div class="players" id="players"></div>

<div class="boardframe">
 <div id="board"></div>
</div>

<div id="status">RED PLAYER — ROLL YOUR DICE 🎲</div>
<button class="action" id="pass" onclick="passTurn()" hidden>PASS TURN</button>
<br>
<button class="action" onclick="newGame()">↻ NEW GAME</button>

<div class="small">ONE SOUL LUDO • FOUR PLAYERS • HAVE FUN</div>

<script>
const P=[
 {name:"RED",emoji:"🔴",start:0},
 {name:"GREEN",emoji:"🟢",start:13},
 {name:"YELLOW",emoji:"🟡",start:26},
 {name:"BLUE",emoji:"🔵",start:39}
];

const path=[
[6,1],[6,2],[6,3],[6,4],[6,5],
[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],
[0,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],
[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],
[7,14],[8,14],[8,13],[8,12],[8,11],[8,10],
[8,9],[9,8],[10,8],[11,8],[12,8],[13,8],
[14,8],[14,7],[14,6],[13,6],[12,6],[11,6],
[10,6],[9,6],[8,5],[8,4],[8,3],[8,2],
[8,1],[8,0],[7,0],[6,0]
];

const lanes=[
 [[7,1],[7,2],[7,3],[7,4],[7,5]],
 [[1,7],[2,7],[3,7],[4,7],[5,7]],
 [[7,13],[7,12],[7,11],[7,10],[7,9]],
 [[13,7],[12,7],[11,7],[10,7],[9,7]]
];

const bases=[
 [[2,2],[2,4],[4,2],[4,4]],
 [[2,10],[2,12],[4,10],[4,12]],
 [[10,10],[10,12],[12,10],[12,12]],
 [[10,2],[10,4],[12,2],[12,4]]
];

const safe=[0,8,13,21,26,34,39,47];
const faces=["","⚀","⚁","⚂","⚃","⚄","⚅"];
let pos=P.map(()=>[-1,-1,-1,-1]);
let turn=0,dice=0,rolled=false,finished=false;
const board=document.getElementById("board");
const cells={};

function key(r,c){return r+","+c}
function add(r,c,cl){cells[key(r,c)].classList.add(cl)}

function makeBoard(){
 for(let r=0;r<15;r++){
  for(let c=0;c<15;c++){
   let e=document.createElement("div");
   e.className="cell";
   e.id="c"+r+"-"+c;
   board.appendChild(e);cells[key(r,c)]=e;
   if(r<6&&c<6)e.classList.add("redbase");
   if(r<6&&c>8)e.classList.add("greenbase");
   if(r>8&&c>8)e.classList.add("yellowbase");
   if(r>8&&c<6)e.classList.add("bluebase");
  }
 }
 path.forEach(([r,c])=>add(r,c,"track"));
 lanes.forEach((lane,p)=>lane.forEach(([r,c])=>add(r,c,
  ["redlane","greenlane","yellowlane","bluelane"][p])));
 P.forEach((p,i)=>{
  add(...path[p.start],["redstart","greenstart","yellowstart","bluestart"][i]);
  bases[i].forEach(([r,c])=>{
   let home=document.createElement("div");
   home.className="baseinner";
   for(let j=0;j<4;j++){
    let h=document.createElement("div");
    h.className="homepiece";home.appendChild(h);
   }
   cells[key(r,c)].appendChild(home);
  });
 });
 add(7,7,"center");
}

function makePlayers(){
 const area=document.getElementById("players");
 P.forEach((p,i)=>{
  let card=document.createElement("div");
  card.className="player";
  card.id="p"+i;
  card.innerHTML=`
   <div class="profile">
    <div class="avatar">${p.emoji}</div>
    <div><div class="playername">${p.name}</div>
    <div class="turntext">PLAYER ${i+1}</div></div>
   </div>
   <div class="dicerow">
    <div class="die" id="d${i}">🎲</div>
    <button class="roll" id="r${i}" onclick="roll(${i})">ROLL DICE</button>
   </div>
   <div class="score" id="s${i}">HOME 0 / 4</div>`;
  area.appendChild(card);
 });
}

function coord(p,t){
 let v=pos[p][t];
 if(v===-1)return bases[p][t];
 if(v===57)return [7,7];
 if(v<52)return path[(P[p].start+v)%52];
 return lanes[p][v-52];
}

function draw(){
 document.querySelectorAll(".token").forEach(e=>e.remove());
 pos.forEach((group,p)=>{
  group.forEach((v,t)=>{
   let [r,c]=coord(p,t);
   let b=document.createElement("button");
   b.className="token "+["red","green","yellow","blue"][p];
   b.textContent=t+1;
   b.title=P[p].name+" TOKEN "+(t+1);
   b.onclick=()=>move(p,t);
   b.disabled=!(rolled&&turn===p&&!finished&&canMove(p,t));
   cells[key(r,c)].appendChild(b);
  });
 });
 P.forEach((p,i)=>{
  document.getElementById("p"+i).classList.toggle("active",turn===i&&!finished);
  document.getElementById("r"+i).disabled=turn!==i||rolled||finished;
  document.getElementById("s"+i).textContent=
   "HOME "+pos[i].filter(v=>v===57).length+" / 4";
 });
}

function canMove(p,t){
 let v=pos[p][t];
 return v===-1?dice===6:(v<57&&v+dice<=57);
}
function moves(p){return pos[p].filter((v,t)=>canMove(p,t)).length}

function roll(p){
 if(finished||rolled||p!==turn)return;
 dice=1+Math.floor(Math.random()*6);
 rolled=true;
 document.getElementById("d"+p).textContent=faces[dice];
 draw();
 if(moves(p)===0){
  msg(P[p].name+" HAS NO MOVE. PASS TURN.");
  document.getElementById("pass").hidden=false;
 }else{
  msg(P[p].name+" ROLLED "+dice+" — SELECT A TOKEN");
 }
}
function move(p,t){
 if(finished||!rolled||p!==turn||!canMove(p,t))return;
 let old=pos[p][t];
 let next=old===-1?0:old+dice;
 pos[p][t]=next;
 let cut=false;
 if(next<52){
  let square=(P[p].start+next)%52;
  if(!safe.includes(square)){
   pos.forEach((group,op)=>{
    if(op===p)return;
    group.forEach((v,k)=>{
     if(v>=0&&v<52&&
       (P[op].start+v)%52===square){
      pos[op][k]=-1;cut=true;
     }
    });
   });
  }
 }
 rolled=false;
 document.getElementById("pass").hidden=true;
 if(pos[p].every(v=>v===57)){
  finished=true;
  msg("🏆 "+P[p].name+" WINS THE GAME!");
  draw();return;
 }
 if(dice!==6)turn=(turn+1)%4;
 if(dice===6)msg(cut?"TOKEN CAPTURED! ROLL AGAIN!":"SIX! ROLL AGAIN!");
 else msg(P[turn].name+" PLAYER'S TURN");
 draw();
}
function msg(s){document.getElementById("status").textContent=s}
function passTurn(){
 if(!rolled||finished||moves(turn)>0)return;
 rolled=false;turn=(turn+1)%4;
 document.getElementById("pass").hidden=true;
 msg(P[turn].name+" PLAYER'S TURN");
 draw();
}
function newGame(){
 pos=P.map(()=>[-1,-1,-1,-1]);
 turn=0;dice=0;rolled=false;finished=false;
 P.forEach((p,i)=>document.getElementById("d"+i).textContent="🎲");
 document.getElementById("pass").hidden=true;
 msg("NEW GAME! RED PLAYER STARTS.");
 draw();
}
makeBoard();
makePlayers();
draw();
</script>
</body>
</html>
