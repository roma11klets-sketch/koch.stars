const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws'),Game=require('./game.js');
const file=fs.existsSync(path.join(__dirname,'index.html'))?path.join(__dirname,'index.html'):path.join(__dirname,'public','index.html');
const TYPES={'/manifest.json':'application/manifest+json','/sw.js':'text/javascript','/icon-192.png':'image/png','/icon-512.png':'image/png'};
const srv=http.createServer((q,r)=>{const u=(q.url||'/').split('?')[0];const t=TYPES[u];
if(t){const f=[path.join(__dirname,u),path.join(__dirname,'public',u)].find(x=>fs.existsSync(x));if(f){r.writeHead(200,{'Content-Type':t,'Cache-Control':'no-cache'});return r.end(fs.readFileSync(f))}r.writeHead(404);return r.end('not found')}
r.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});r.end(fs.readFileSync(file))});
const wss=new WebSocketServer({server:srv});
const rooms={};
const send=(w,o)=>{if(w.readyState==1)w.send(typeof o=='string'?o:JSON.stringify(o))};
const SKIP=new Set(['ai','inp','m']);
const snap=g=>JSON.stringify({t:'s',g},(k,v)=>{if(SKIP.has(k))return;if(v&&typeof v=='object'&&(k=='c'||k=='k'))return k=='c'?1:undefined;return typeof v=='number'?Math.round(v*10)/10:v});
const teamN=(r,t)=>r.p.filter(p=>p.team==t).length;
const clean=(s,n)=>String(s||'').replace(/[<>]/g,'').trim().slice(0,n);
function lobby(r){r.p.forEach((p,i)=>send(p.ws,{t:'lobby',code:r.code,mode:r.mode,me:i,host:i==0,players:r.p.map(q=>({bi:q.bi,name:q.name,team:q.team}))}))}
function chat(r,n,m){if(!m)return;r.chat=(r.chat||[]).concat([{n,m}]).slice(-40);r.p.forEach(p=>send(p.ws,{t:'chat',msgs:r.chat}))}
wss.on('connection',ws=>{let room=null,me=null;
ws.on('message',d=>{let m;try{m=JSON.parse(d)}catch(e){return}
const bi=Math.max(0,Math.min(5,m.bi|0));const lv=Math.max(1,Math.min(10,m.lv|0||1));const name=clean(m.name,14)||'Игрок';
if(m.t=='create'&&!room){const code=Math.random().toString(36).slice(2,6).toUpperCase();room=rooms[code]={code,mode:0,p:[],G:null,chat:[]};me={ws,bi,name,team:0,lv};room.p.push(me);lobby(room);send(ws,{t:'chat',msgs:room.chat});return}
if(m.t=='join'&&!room){const r=rooms[clean(m.code,4).toUpperCase()];if(!r)return send(ws,{t:'err',m:'Комната не найдена'});if(r.G)return send(ws,{t:'err',m:'Матч уже идёт'});if(r.p.length>=6)return send(ws,{t:'err',m:'Комната заполнена'});
room=r;let t=teamN(r,0)<=teamN(r,1)?0:1;if(teamN(r,t)>=3)t=1-t;me={ws,bi,name,team:t,lv};r.p.push(me);lobby(r);send(ws,{t:'chat',msgs:r.chat||[]});return}
if(!room)return;
if(m.t=='pick'&&!room.G){me.bi=bi;me.lv=lv;lobby(room)}
else if(m.t=='mode'&&room.p[0]===me&&!room.G){room.mode=[0,1,2,3].includes(m.mode)?m.mode:0;lobby(room)}
else if(m.t=='team'&&!room.G&&room.mode!=1){const t=1-me.team;if(teamN(room,t)>=3)return send(ws,{t:'err',m:'В этой команде уже 3 игрока'});me.team=t;lobby(room)}
else if(m.t=='chat'){chat(room,me.name,clean(m.m,100))}
else if(m.t=='start'&&room.p[0]===me&&!room.G){Game.start(room);room.p.forEach(p=>send(p.ws,{t:'start',mode:room.mode,idx:p.id,m:room.G.m}))}
else if(m.t=='in'&&room.G&&me.id!=null){const u=room.G.u[me.id],c=x=>Math.max(-1,Math.min(1,+x||0));if(u&&!u.bot)u.inp={mx:c(m.mx),my:c(m.my),ang:typeof m.ang=='number'?m.ang:null}}
else if(m.t=='f'&&room.G&&me.id!=null)Game.act(room,me.id,m.k,m.a,m.d)
else if(m.t=='pin'&&room.G&&me.id!=null)Game.pin(room,me.id,m.e)});
ws.on('close',()=>{if(!room)return;const i=room.p.indexOf(me);if(i<0)return;room.p.splice(i,1);if(room.G&&me.id!=null&&room.G.u[me.id])room.G.u[me.id].bot=1;if(!room.p.length)delete rooms[room.code];else if(!room.G)lobby(room)})});
setInterval(()=>{for(const c in rooms){const r=rooms[c];if(!r.G)continue;try{Game.tick(r,1/30);const s=snap(r.G);r.p.forEach(p=>send(p.ws,s));if(r.G.over&&r.G.ot>6){r.G=null;lobby(r)}}catch(e){console.error(e);r.G=null;lobby(r)}}},33);
srv.listen(process.env.PORT||3000,()=>console.log('Коч Старс: порт',process.env.PORT||3000));
