(() => {
 const $=id=>document.getElementById(id);
 const COLORS=['red','green','yellow','blue'];
 const TRACK=[[6,1],[6,2],[6,3],[6,4],[6,5],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],[0,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],[7,14],[8,14],[8,13],[8,12],[8,11],[8,10],[8,9],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],[14,7],[14,6],[13,6],[12,6],[11,6],[10,6],[9,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],[7,0],[6,0]];
 const START={red:0,green:13,yellow:26,blue:39};
 const LANES={red:[[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]],green:[[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],yellow:[[7,13],[7,12],[7,11],[7,10],[7,9],[7,8]],blue:[[13,7],[12,7],[11,7],[10,7],[9,7],[8,7]]};
 const HOMES={red:[[1,1],[1,3],[3,1],[3,3]],green:[[1,11],[1,13],[3,11],[3,13]],yellow:[[11,11],[11,13],[13,11],[13,13]],blue:[[11,1],[11,3],[13,1],[13,3]]};
 let socket=null,roomCode='',game=null,me=null;
 function showGame(){['home','authPanel','adminPanel','gamePanel'].forEach(x=>$(x).classList.toggle('hidden',x!=='gamePanel'));}
 function say(s){$('gameStatus').textContent=s;}
 function ack(event,payload){return new Promise(resolve=>socket.emit(event,payload||{},resolve));}
 function connect(){
  if(!window.io)throw Error('Realtime library did not load. Refresh the page.');
  const token=localStorage.getItem('osg_token');if(!token)throw Error('Please login first.');
  if(socket?.connected)return Promise.resolve();
  socket=io({auth:{token}});
  return new Promise((resolve,reject)=>{
   socket.once('connect',resolve);socket.once('connect_error',e=>reject(new Error(e.message)));
   socket.on('game:update',d=>{if(d.code===roomCode){game=d.game;render();}});
   socket.on('game:chat',m=>addChat(m.sender,m.body));
  });
 }
 function addChat(sender,body){const line=document.createElement('div');line.className='chat-line';line.textContent=sender+': '+body;$('gameChatMessages').appendChild(line);$('gameChatMessages').scrollTop=$('gameChatMessages').scrollHeight;}
 function coord(color,p,index){
  if(p===-1)return HOMES[color][index];
  if(p>=52)return LANES[color][Math.min(5,p-52)];
  const start=START[color],pos=(start+p)%52;return TRACK[pos];
 }
 function renderBoard(){
  const board=$('ludoBoard');board.innerHTML='';
  const cellMap=new Map();
  for(let r=0;r<15;r++)for(let c=0;c<15;c++){
   const el=document.createElement('div');el.className='cell';el.style.gridRow=r+1;el.style.gridColumn=c+1;
   if((r<6&&c<6)||(r<6&&c>8)||(r>8&&c<6)||(r>8&&c>8))el.classList.add(r<6?(c<6?'red':'green'):(c<6?'blue':'yellow'));
   if(r===7&&c===7)el.classList.add('center');
   const key=r+','+c;cellMap.set(key,el);board.appendChild(el);
  }
  // Mark the four home pads and the 3x3 finish area for the premium board skin.
  Object.entries(HOMES).forEach(([color,coords])=>coords.forEach(([r,c])=>cellMap.get(r+','+c)?.classList.add('home-pad',color)));
  for(let r=6;r<=8;r++)for(let c=6;c<=8;c++)cellMap.get(r+','+c)?.classList.add('finish-area');
  cellMap.get('6,6')?.classList.add('finish-red');
  cellMap.get('6,8')?.classList.add('finish-green');
  cellMap.get('8,8')?.classList.add('finish-yellow');
  cellMap.get('8,6')?.classList.add('finish-blue');
  TRACK.forEach(([r,c])=>cellMap.get(r+','+c)?.classList.add('track'));
  Object.entries(LANES).forEach(([color,coords])=>coords.forEach(([r,c])=>cellMap.get(r+','+c)?.classList.add(color)));
  if(!game)return;
  game.players.forEach(player=>{
   const pieces=game.pieces[player.color]||[];
   pieces.forEach((p,i)=>{
    const [r,c]=coord(player.color,p,i),cell=cellMap.get(r+','+c);if(!cell)return;
    const token=document.createElement('button');token.className='token '+player.color;token.textContent=String(i+1);token.setAttribute('aria-label',player.name+' '+player.color+' token '+(i+1));
    const myTurn=game.players[game.turn]?.id===me?.id;
    const canMove=myTurn&&game.rolled&&game.moveOptions.includes(i)&&player.id===me?.id;
    token.disabled=!canMove;if(canMove)token.classList.add('movable');
    token.title=player.name+' token '+(i+1);
    token.onclick=async()=>{const r=await ack('game:move',{code:roomCode,pieceIndex:i});if(!r.ok)say(r.error);};
    cell.appendChild(token);
   });
  });
 }
 function render(){
  $('roomCode').textContent=roomCode||'------';
  $('playersList').innerHTML='';
  (game?.players||[]).forEach((p,i)=>{const chip=document.createElement('span');chip.className='player-chip '+p.color;chip.textContent=(i===0?'👑 ':'')+p.name+' · '+p.color;$('playersList').appendChild(chip);});
  say(game?.lastAction||'Waiting for players');
  $('startGameBtn').disabled=!(game?.status==='waiting'&&game.players[0]?.id===me?.id&&game.players.length>=2);
  $('rollDiceBtn').disabled=!(game?.status==='playing'&&game.players[game.turn]?.id===me?.id&&!game.rolled);
  $('diceValue').textContent=game?.dice??'—';
  $('moveHint').textContent=game?.status==='finished'?'Winner: '+game.winner:(game?.rolled?'Choose a highlighted token.':(game?.status==='playing'?'Current turn: '+(game.players[game.turn]?.name||''):'Waiting for host to start.'));
  renderBoard();
 }
 async function ensureMe(){const d=await fetch('/api/me',{headers:{Authorization:'Bearer '+localStorage.getItem('osg_token')}});if(!d.ok)throw Error('Login required');me=(await d.json()).user;}
 $('playBtn').onclick=async()=>{try{await ensureMe();await connect();showGame();say('Create a room or join with a code.');}catch(e){alert(e.message);}};
 $('createGameBtn').onclick=async()=>{try{await ensureMe();await connect();const r=await ack('game:create');if(!r.ok)throw Error(r.error);roomCode=r.code;game=r.game;$('gameChatMessages').innerHTML='';render();}catch(e){say(e.message);}};
 $('joinGameBtn').onclick=async()=>{try{await ensureMe();await connect();const code=$('joinCode').value.trim().toUpperCase();const r=await ack('game:join',{code});if(!r.ok)throw Error(r.error);roomCode=r.code;game=r.game;render();}catch(e){say(e.message);}};
 $('startGameBtn').onclick=async()=>{const r=await ack('game:start',{code:roomCode});if(!r.ok)say(r.error);};
 $('rollDiceBtn').onclick=async()=>{const r=await ack('game:roll',{code:roomCode});if(!r.ok)say(r.error);};
 $('gameChatForm').onsubmit=async e=>{e.preventDefault();const body=$('gameChatInput').value.trim();if(!body)return;const r=await ack('game:chat',{code:roomCode,body});if(r.ok)$('gameChatInput').value='';else say(r.error);};
 $('backHomeBtn').onclick=()=>{if(socket){socket.disconnect();socket=null;}roomCode='';game=null;['home','authPanel','adminPanel','gamePanel'].forEach(x=>$(x).classList.toggle('hidden',x!=='home'));};
 // Keep legacy room button routed into the new multiplayer lobby.
 $('roomBtn').onclick=$('playBtn').onclick;
})();
