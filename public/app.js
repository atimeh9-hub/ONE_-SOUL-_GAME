
let token = localStorage.getItem("osg_token") || "";
let currentUser = null;
let authMode = "login";
const $ = id => document.getElementById(id);
function show(id){["home","authPanel","adminPanel"].forEach(x=>$(x).classList.toggle("hidden",x!==id));}
function msg(text){$("notice").textContent=text;}
async function api(url, options={}) {
  const headers={"Content-Type":"application/json",...(options.headers||{})};
  if(token) headers.Authorization="Bearer "+token;
  const response=await fetch(url,{...options,headers});
  const data=await response.json().catch(()=>({error:"Unexpected server response"}));
  if(!response.ok) throw new Error(data.error||"Request failed");
  return data;
}
function updateUser(user){currentUser=user;$("coinCount").textContent=user.coins??0;}
$("playBtn").onclick=()=>{if(!token){show("authPanel");$("authMsg").textContent="Create an account or login to continue.";return;}msg("Ludo gameplay is the next development milestone. Your account is connected.");};
$("roomBtn").onclick=async()=>{if(!token){show("authPanel");return;}try{const d=await api("/api/rooms",{method:"POST",body:"{}"});msg("Private room created. Room code: "+d.room.code+" (live play not connected yet).");}catch(e){msg(e.message);}};
$("shopBtn").onclick=()=>msg("Coin Shop screen is planned. Real purchases are not enabled in this starter.");
$("profileBtn").onclick=async()=>{if(!token){show("authPanel");return;}try{const d=await api("/api/me");updateUser(d.user);msg("Logged in as "+d.user.username+" · "+d.user.email);}catch(e){msg(e.message);}};
$("showLogin").onclick=()=>{authMode="login";$("username").classList.add("hidden");$("authMsg").textContent="Login with your email and password.";};
$("showRegister").onclick=()=>{authMode="register";$("username").classList.remove("hidden");$("authMsg").textContent="Create a new player account.";};
$("authForm").onsubmit=async e=>{e.preventDefault();try{
 const body={email:$("email").value,password:$("password").value};
 if(authMode==="register"){body.username=$("username").value;body.privacyNoticeAccepted=$("privacyNotice").checked;}
 const d=await api("/api/auth/"+(authMode==="register"?"register":"login"),{method:"POST",body:JSON.stringify(body)});
 token=d.token;localStorage.setItem("osg_token",token);updateUser(d.user);if(d.user.role==="admin"){loadAdmin();}else{show("home");msg("Welcome, "+d.user.username+". Your account is connected.");}
 }catch(err){$("authMsg").textContent=err.message;}};
async function loadAdmin(){
 try{const s=await api("/api/admin/summary");$("players").textContent=s.registeredPlayers;$("rooms").textContent=s.waitingRooms;$("banned").textContent=s.bannedAccounts;
 const d=await api("/api/admin/users");$("userList").innerHTML="";
 d.users.filter(u=>u.role==="player").forEach(u=>{
 const row=document.createElement("div");row.className="user";
 const info=document.createElement("div");info.textContent=u.username+" · "+u.coins+" coins";const small=document.createElement("small");small.textContent=u.email+" · "+(u.banned?"BANNED":"ACTIVE");info.appendChild(small);
 const btn=document.createElement("button");btn.className="blue";btn.textContent=u.banned?"Unban":"Ban";btn.onclick=async()=>{await api("/api/admin/users/"+u.id+"/ban",{method:"POST",body:JSON.stringify({banned:!u.banned})});loadAdmin();};
 row.append(info,btn);$("userList").appendChild(row);
 });
 show("adminPanel");
 }catch(e){show("authPanel");$("authMsg").textContent="Admin login required: "+e.message;}
}
const params=new URLSearchParams(location.search);
if(params.get("admin")==="1"){show("authPanel");$("authMsg").textContent="Admin login: use the credentials configured in your .env file."; }
else show("home");
