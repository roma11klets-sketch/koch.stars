let G=null,mode=0;
const UM=8000,HM=7000,PI=Math.PI,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),dst=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const B=[
{n:'Ронни макарони',rar:'common',hp:8000,sp:170,skin:'#f3c5aa',cl:'#1c2233',atk:{s:'cone',r:330,w:.28},ult:{s:'cone',r:230,w:.6},gad:{s:'self',r:0},d:'🔫 Дробовик: 2400 урона<br>⚡ Ульта: 6000 вблизи<br>🛡 Гаджет: щит на 2 сек<br>🔥 Гипер: +20% сила, +15% скорость'},
{n:'Глент',rar:'rare',hp:7800,sp:160,skin:'#efc2a4',cl:'#17171a',atk:{s:'dot',r:300,w:55},ult:{s:'line',r:450,w:22},gad:{s:'self',r:0},d:'🍉 Арбуз: 2500 сплеш<br>⚡ Ульта: белый лазер 5 сек<br>🟦 Гаджет: квадрат-щит 3 сек<br>🔥 Гипер: +20% сила, +15% скорость'},
{n:'Блогер Меллстрой',rar:'epic',hp:9000,sp:150,skin:'#f0c4a8',cl:'#15151c',atk:{s:'dot',r:280,w:75},ult:{s:'dot',r:300,w:150},gad:{s:'line',r:260,w:30},d:'💣 3 бомбы по 1800<br>⚡ Ульта: чёрная дыра и голова-камикадзе<br>🐣 Гаджет: 3 птенца<br>🔥 Гипер: +20% сила, +15% скорость'},{n:'Скибиди туалет',rar:'epic',hp:8500,sp:165,skin:'#f5d6b8',cl:'#eeeef2',atk:{s:'dot',r:120,w:0},ult:{s:'dot',r:130,w:0},gad:{s:'self',r:0},d:'🚽 Удар вблизи: 2000<br>🦘 Ульта: прыжок и удар 1000, оглушение 0.5 с<br>💚 Гаджет: лечение 1500<br>🔥 Гипер: +20% сила, +15% скорость'},{n:'Джиган',rar:'rare',hp:7000,sp:170,skin:'#f0c4a8',cl:'#4a3320',atk:{s:'cone',r:320,w:.12},ult:{s:'line',r:460,w:22},gad:{s:'self',r:0},d:'🔫 5 пуль по 760 за тычку<br>⚡ Ульта: очередь пуль<br>👟 Гаджет: ускорение 2 с<br>🔥 Гипер: +20% сила, +15% скорость'},{n:'Дима',rar:'legend',hp:6000,sp:160,skin:'#f0c4a8',cl:'#111111',atk:{s:'dot',r:700,w:7},ult:{s:'line',r:800,w:30},gad:{s:'self',r:0},d:'🎯 Снайперский выстрел: 1200<br>⚡ Ульта: пробивающий луч 1800<br>🛡 Гаджет: щит 1.5 с<br>🔥 Гипер: +20% сила, +15% скорость'}];
const MD=[{n:'Нокаут',k:'3 на 3 · Золотой каньон'},{n:'Шоудаун',k:'10 игроков · Остров'},{n:'Броубол',k:'3 на 3 · Футбольное поле'},{n:'Захват',k:'3 на 3 · Точка в центре'},{n:'Тренировка',k:'Куклы, без урона по тебе'},{n:'Бой с боссом',k:'3 против робота'},{n:'Дуэль',k:'1 на 1'}];
function mkMap(m){const mir=(w,L)=>L.concat(L.map(r=>[w-r[0]-r[2],r[1],r[2],r[3]]));
if(m==6)return{w:1000,h:420,c1:'#e6c9f5',c2:'#dcbcf0',wc:'#6a4c93',walls:[[470,110,60,200]],bush:[[200,150,100,120],[700,150,100,120]]};if(m==4||m==5)m=0;if(m==3){const w=1600;return{w,h:800,c1:'#8fd3f4',c2:'#7cc4ec',wc:'#5a6b7a',zone:{x:800,y:400,r:120},walls:mir(w,[[0,250,80,30],[0,520,80,30],[380,180,60,60],[380,560,60,60],[560,370,60,60]]).concat([[740,150,120,60],[740,590,120,60]])}}if(m==0){const w=1400;return{w,h:800,c1:'#ecc47c',c2:'#e3b96c',wc:'#b8662f',bush:mir(w,[[380,350,120,100],[420,150,100,120],[420,530,100,120]]),dc:['#c9954e','#f6d28c','#b57e3b'],walls:mir(w,[[300,140,60,170],[300,490,60,170],[540,340,60,120],[470,50,130,50],[470,700,130,50]]).concat([[680,280,40,240]])}}
if(m==2){const w=1600;return{w,h:800,c1:'#4caf50',c2:'#43a047',wc:'#6d4c41',goal:1,bush:mir(w,[[480,60,140,80],[480,660,140,80],[300,330,100,140]]),walls:mir(w,[[0,250,80,30],[0,520,80,30],[380,180,60,60],[380,560,60,60],[560,370,60,60]]).concat([[740,150,120,60],[740,590,120,60]])}}
let s=7;const R=()=>(s=s*16807%2147483647)/2147483647,sp=[],ws=[];for(let i=0;i<10;i++){const a=i*PI/5;sp.push([900+Math.cos(a)*720,900+Math.sin(a)*720])}
for(let i=0;i<36;i++){const ww=60+R()*90,hh=60+R()*90,x=R()*(1800-ww),y=R()*(1800-hh);if(!sp.some(p=>Math.hypot(p[0]-x-ww/2,p[1]-y-hh/2)<140))ws.push([x,y,ww,hh])}
const bs=[];for(let i=0;i<24;i++){const ww=90+R()*80,hh=80+R()*80,x=R()*(1800-ww),y=R()*(1800-hh);if(!sp.some(p=>Math.hypot(p[0]-x-ww/2,p[1]-y-hh/2)<130)&&!ws.some(r=>x<r[0]+r[2]&&x+ww>r[0]&&y<r[1]+r[3]&&y+hh>r[1]))bs.push([x,y,ww,hh])}
return{w:1800,h:1800,c1:'#78c36e',c2:'#6cb862',wc:'#5d4037',walls:ws,sp,bush:bs}}
// ---- game
const foes=tm=>[...G.u,...G.s].filter(e=>e.alive&&e.team!==tm);
const inB=e=>(G.m.bush||[]).some(r=>e.x>r[0]&&e.x<r[0]+r[2]&&e.y>r[1]&&e.y<r[1]+r[3]);
function vis(e,tm){if(e.team===tm||e.k=='x'||!inB(e)||e.rv>0)return 1;for(const a of G.u)if(a.alive&&a.team===tm&&dst(a,e)<150)return 1;return 0}
function nearest(u){let b=null,bd=1e9;for(const e of foes(u.team)){if(!vis(e,u.team))continue;const d=dst(u,e)*(e.k=='b'?1:1.5);if(d<bd){bd=d;b=e}}return b}
const wallsOf=tm=>G.m.walls.concat(G.dw.filter(d=>d[4]>0&&d[5]!==tm));
function hitW(x,y,r){for(const w of wallsOf(-1)){const qx=cl(x,w[0],w[0]+w[2]),qy=cl(y,w[1],w[1]+w[3]);if(Math.hypot(x-qx,y-qy)<r)return 1}return 0}
function coll(u){for(const w of wallsOf(u.team)){const qx=cl(u.x,w[0],w[0]+w[2]),qy=cl(u.y,w[1],w[1]+w[3]),dx=u.x-qx,dy=u.y-qy,d=Math.hypot(dx,dy);if(d<u.r){if(d>.01){u.x+=dx/d*(u.r-d);u.y+=dy/d*(u.r-d)}else u.x+=u.r}}
u.x=cl(u.x,u.r,G.m.w-u.r);u.y=cl(u.y,u.r,G.m.h-u.r)}
function mk(i,bi){return{id:i,bi,k:'b',team:mode==1||mode==6?i:(i<3?0:1),bot:i>0,r:18,x:0,y:0,face:0,alive:1,hp:1,mh:1,ammo:3,rl:0,uc:0,hc:0,hT:0,sh:0,gc:2,bm:0,bt:0,cd:0,rs:0,ai:{so:0,lx:0,ly:0,lt:0,sg:1}}}
function spos(u){const m=G.m;if(mode==1)return m.sp[u.id];const ox=mode==2?200:150;return[u.team?m.w-ox:ox,mode==6?210:[250,400,550][u.id%3]]}
function place(full){const m=G.m;G.s=[];G.pr=[];G.lob=[];G.dw=[];G.ho=[];
for(const u of G.u){u.hp=u.mh=Math.round(B[u.bi].hp*(u.lm||1));u.ammo=3;u.rl=0;u.gc=2;u.sh=u.hT=u.bm=u.cd=u.rs=0;u.alive=1;u.cu=0;if(full)u.uc=u.hc=0;const p=spos(u);u.x=p[0];u.y=p[1];u.face=u.team?PI:0}
if(mode==2)G.ball={x:m.w/2,y:m.h/2,vx:0,vy:0,c:null,nk:0,k:null};if(mode==1){G.cb=[];for(let i=0;i<10;i++){for(let k=0;k<30;k++){const x=250+Math.random()*1300,y=250+Math.random()*1300;if(!m.walls.some(r=>x>r[0]-40&&x<r[0]+r[2]+40&&y>r[1]-40&&y<r[1]+r[3]+40)&&!m.sp.some(p=>Math.hypot(p[0]-x,p[1]-y)<150)){G.s.push({k:'x',team:-1,hp:4000,mh:4000,r:24,alive:1,sh:0,x,y,life:1e9,own:0,face:0});break}}}}}
function newGame(md,hum){mode=md;const m=mkMap(md),n=md==1?10:6;G={m,u:[],s:[],pr:[],lob:[],fx:[],dw:[],ho:[],cb:[],t:0,sc:[0,0],rd:1,pause:3,txt:md==1?'Шоудаун!':md==2?'Броубол!':'Раунд 1',over:0,ot:0,ball:null,gr:1300};
const slot=new Array(n).fill(null);
if(md==1)hum.forEach((p,k)=>{slot[k]=p});
else{let a=0,b=3;hum.forEach(p=>{if(p.team==1){while(b<6&&slot[b])b++;if(b<6)slot[b]=p}else{while(a<3&&slot[a])a++;if(a<3)slot[a]=p}})}
for(let i=0;i<n;i++){const p=slot[i],u=mk(i,p?p.bi:Math.floor(Math.random()*B.length));u.bot=p?0:1;u.inp={mx:0,my:0,ang:null};if(p){p.id=i;u.nm=p.name;if(p.lv){u.lm=1+.04*(p.lv-1);u.lv=p.lv}}G.u.push(u)}place(1)}

function endGame(w,m){if(G.over)return;G.over=1;G.ot=0;G.win=w;G.msg=m}
const PINS=['🥶','😭','🤡'];function pin(u,e){if(PINS.includes(e)){u.pin=e;u.pt=2.5}}
function hurt(t,a,o){if(!t.alive||t.sh>0)return;if(mode==4&&t.k=='b'&&!t.bot)return;if(typeof onDmg=='function')onDmg(a,o);if(o&&o.cu)a*=1+.1*o.cu;if(o&&o.lv>=6)a*=1.08;t.hp-=a;t.lh=0;t.hf=.12;G.fx.push({k:'n',x:t.x+(Math.random()-.5)*20,y:t.y-30,t:.7,s:Math.round(a)});
if(o&&o.k=='b'&&o.hT<=0){o.uc=Math.min(UM,o.uc+a);o.hc=Math.min(HM,o.hc+a)}if(t.hp<=0)kill(t,o);else if(t.bot&&t.k=='b'&&t.hp<t.mh*.25&&!(t.pt>0)&&Math.random()<.03)pin(t,'😭')}
function kill(t,o){t.alive=0;t.jt=0;t.st=0;t.burst=0;t.spd=0;G.fx.push({k:'p',x:t.x,y:t.y,t:.7,c:t.k=='x'?'#c98a4b':t.k=='b'?['#ffd23b','#ff5a5a','#7b8cff'][t.bi]:'#ffdd55'});if(t.k=='x')G.cb.push({x:t.x,y:t.y});if(t.k!='b')return;if(typeof onKill=='function')onKill(o);if(o&&o.k=='b'){if(typeof SFX!='undefined')SFX.kill();G.fx.push({k:'kill',o:o.id,t:1.6});if(o.bot&&Math.random()<.6)pin(o,'🤡')}if(mode==1)for(let i=0;i<=(t.cu||0);i++)G.cb.push({x:t.x+i*10,y:t.y});if(mode==2||mode==3||mode==4){t.rs=3;if(G.ball&&G.ball.c===t)G.ball.c=null}
if(mode==1){t.place=G.u.filter(x=>x.alive).length+1;if(!G.u.some(x=>x.alive&&!x.bot))endGame(false,'')}}
function boom(x,y,rad,d,tm,o,c){for(const e of foes(tm))if(Math.hypot(e.x-x,e.y-y)<rad+e.r*.5)hurt(e,d,G.u[o]);G.fx.push({k:'e',x,y,r:rad,t:.35,c:c||'#ffb02e'})}
function lob(u,tx,ty,T,d,rad,k){G.lob.push({sx:u.x,sy:u.y,tx:cl(tx,0,G.m.w),ty:cl(ty,0,G.m.h),T,t:0,d,rad,tm:u.team,o:u.id,k,hy:u.hT>0})}
function atk(u,a,d){const bl=G.ball;if(u.cd>0||!u.alive||u.st>0||u.jt>0)return;
if(bl&&bl.c===u){bl.c=null;bl.vx=Math.cos(a)*800;bl.vy=Math.sin(a)*800;bl.nk=.5;bl.k=u;u.cd=.4;u.face=a;return}
if(u.bi==3){u.cd=.6;u.face=a;const dm=u.hT>0?1.2:1;for(const e of foes(u.team)){const ex=e.x-u.x,ey=e.y-u.y,dd2=Math.hypot(ex,ey);let df=Math.abs(Math.atan2(ey,ex)-a);df=Math.min(df,2*PI-df);if(dd2<120+e.r&&df<1.1)hurt(e,2000*dm,u)}G.fx.push({k:'c',x:u.x,y:u.y,a,w:1.1,r:120,t:.25,c:'#ffffff'});return}if(u.ammo<1)return;u.ammo--;u.cd=.35;u.face=a;u.rv=1;G.fx.push({k:'e',x:u.x+Math.cos(a)*24,y:u.y+Math.sin(a)*24,r:12,t:.12,c:'#fff7a8'});const hy=u.hT>0,dm=hy?1.2:1,c=Math.cos(a),s=Math.sin(a);
if(u.bi==4){for(let i=-2;i<=2;i++){const q=a+i*.09,sp=900;G.pr.push({x:u.x,y:u.y,vx:Math.cos(q)*sp,vy:Math.sin(q)*sp,sp,l:340,d:760*dm,t:u.team,o:u.id,r:6,c:hy?'#c46bff':'#ffd23b'})}return}if(u.bi==5){G.pr.push({x:u.x,y:u.y,vx:Math.cos(a)*1100,vy:Math.sin(a)*1100,sp:1100,l:720,d:1200*dm,t:u.team,o:u.id,r:7,c:'#7fd7ff'});return}if(u.bi==0){const sp=hy?900:700;for(let i=-2;i<=2;i++){const q=a+i*.14;G.pr.push({x:u.x,y:u.y,vx:Math.cos(q)*sp,vy:Math.sin(q)*sp,sp,l:hy?430:330,d:480*dm,t:u.team,o:u.id,r:hy?9:6,c:hy?'#c46bff':'#ffd23b'})}}
else if(u.bi==1)lob(u,u.x+c*d,u.y+s*d,.55,2500*dm,hy?80:55,'m');
else for(let i=-1;i<=1;i++)lob(u,u.x+c*d-s*i*38,u.y+s*d+c*i*38,.6,1800*dm,hy?65:45,'b')}
function ult(u,a,d){if(u.uc<UM||!u.alive||G.over||u.st>0||u.jt>0)return;u.uc=0;u.face=a;u.rv=1;if(u.bot&&Math.random()<.5)pin(u,'🥶');const hy=u.hT>0,dm=hy?1.2:1;
if(u.bi==4){u.burst=1.2;u.bdir=a;u.bfire=0;G.fx.push({k:'e',x:u.x,y:u.y,r:40,t:.3,c:'#ffd23b'});return}if(u.bi==5){const L=800,c=Math.cos(a),s=Math.sin(a);for(const e of foes(u.team)){const ex=e.x-u.x,ey=e.y-u.y,al=ex*c+ey*s,pp=Math.abs(-ex*s+ey*c);if(al>0&&al<L&&pp<30+e.r)hurt(e,1800*dm,u)}G.fx.push({k:'c',x:u.x,y:u.y,a,w:.05,r:800,t:.3,c:'#7fd7ff'});return}if(u.bi==3){u.jt=.6;G.fx.push({k:'e',x:u.x,y:u.y,r:40,t:.3,c:'#9be7ff'});return}if(u.bi==0){const R=hy?310:230,Wd=hy?.85:.6;for(const e of foes(u.team)){const ex=e.x-u.x,ey=e.y-u.y,dd=Math.hypot(ex,ey);let df=Math.abs(Math.atan2(ey,ex)-a);df=Math.min(df,2*PI-df);if(dd<R+e.r&&(df<Wd||dd<40))hurt(e,6000*dm,u)}
G.fx.push({k:'c',x:u.x,y:u.y,a,w:Wd,r:R,t:.35,c:hy?'#c46bff':'#ffd23b'})}
else if(u.bi==1){u.bm=5;u.bt=0}
else lob(u,u.x+Math.cos(a)*d,u.y+Math.sin(a)*d,.6,0,0,'h')}
function gad(u,a){if(u.gc<1||!u.alive||G.over||u.st>0)return;u.gc--;const dm=u.hT>0?1.2:1;
if(u.bi==4){u.spd=2;G.fx.push({k:'e',x:u.x,y:u.y,r:45,t:.4,c:'#8cf0ff'});return}if(u.bi==5){u.sh=1.5;G.fx.push({k:'e',x:u.x,y:u.y,r:50,t:.4,c:'#ff5a5a'});return}if(u.bi==3){u.hp=Math.min(u.mh,u.hp+1500);G.fx.push({k:'e',x:u.x,y:u.y,r:50,t:.4,c:'#39e06b'});return}if(u.bi==0)u.sh=2;
else if(u.bi==1){const q=75,t=14,x=u.x,y=u.y;G.dw.push([x-q,y-q,2*q,t,3,u.team],[x-q,y+q-t,2*q,t,3,u.team],[x-q,y-q,t,2*q,3,u.team],[x+q-t,y-q,t,2*q,3,u.team])}
else for(let i=-1;i<=1;i++)G.s.push({k:'c',own:u.id,team:u.team,hp:1500,mh:1500,r:10,sp:150,life:12,dm,cd:0,alive:1,sh:0,x:u.x+Math.cos(a)*30-Math.sin(a)*i*25,y:u.y+Math.sin(a)*30+Math.cos(a)*i*25,ft:.7,aim:a,face:0})}
function hyper(u){if(u.hc<HM||!u.alive||G.over)return;u.hc=0;u.hT=8;G.fx.push({k:'e',x:u.x,y:u.y,r:70,t:.5,c:'#d27bff'})}
function beam(u){const hy=u.hT>0,L=hy?620:450,w=hy?36:22,c=Math.cos(u.face),s=Math.sin(u.face);for(const e of foes(u.team)){const ex=e.x-u.x,ey=e.y-u.y,al=ex*c+ey*s,pp=Math.abs(-ex*s+ey*c);if(al>0&&al<L&&pp<w+e.r)hurt(e,250*(hy?1.2:1),u)}}
function bot(u,dt){if(mode==4)return[0,0];const a=u.ai,b=B[u.bi],bl=G.ball,m=G.m;let T=nearest(u),ang=u.face,mvf=0,str=Math.sin(G.t*1.3+u.id*2)*.5;
if(T){const d=dst(u,T);ang=Math.atan2(T.y-u.y,T.x-u.x);u.face=ang;const D=b.atk.r*.75;mvf=d>D+30?1:d<D-70?-1:0;
if(!(bl&&bl.c===u)){if(u.cd<=0&&u.ammo>0&&d<b.atk.r)atk(u,ang+(Math.random()-.5)*.2,Math.min(b.atk.r,d));
if(u.uc>=UM&&d<b.ult.r*.9)ult(u,ang,Math.min(b.ult.r,d));if(u.gc>0&&d<300&&(u.bi==2||u.hp<u.mh*.55))gad(u,ang);if(u.hc>=HM&&d<350)hyper(u)}}
if(bl){const gx=u.team?0:m.w;if(bl.c===u){ang=Math.atan2(m.h/2-u.y,gx-u.x);u.face=ang;mvf=1;if(Math.abs(u.x-gx)<340&&Math.abs(u.y-m.h/2)<200)atk(u,ang,0)}
else{let near=1;for(const o of G.u)if(o.alive&&o.team==u.team&&o!==u&&dst(o,bl)<dst(u,bl))near=0;
const tg=bl.c&&bl.c.team!==u.team?bl.c:(near&&!bl.c?bl:null);
if(tg){ang=Math.atan2(tg.y-u.y,tg.x-u.x);if(!(T&&dst(u,T)<120))mvf=1}else if(bl.c&&bl.c.team===u.team){ang=Math.atan2(m.h/2-u.y,gx-u.x);mvf=dst(u,bl.c)>150?1:0}}}
if(mode==1&&Math.hypot(900-u.x,900-u.y)>G.gr-70){ang=Math.atan2(900-u.y,900-u.x);mvf=1}
a.lt+=dt;if(a.lt>.6){if(Math.hypot(u.x-a.lx,u.y-a.ly)<12&&mvf!=0){a.so=.7;a.sg=Math.random()<.5?1:-1}a.lx=u.x;a.ly=u.y;a.lt=0}
if(a.so>0){a.so-=dt;ang+=a.sg*1.4;mvf=1}
return[Math.cos(ang)*mvf+Math.cos(ang+1.57)*str,Math.sin(ang)*mvf+Math.sin(ang+1.57)*str]}
const kd={};
function uUpd(u,dt){if(!u.alive){if(mode>=2&&mode<=4&&u.rs>0){u.rs-=dt;if(u.rs<=0){u.hp=u.mh;u.alive=1;u.ammo=3;u.sh=1.5;const p=spos(u);u.x=p[0];u.y=p[1]}}return}
u.lh=(u.lh||0)+dt;if(u.lv>=3&&u.lh>3&&u.hp<u.mh)u.hp=Math.min(u.mh,u.hp+u.mh*.04*dt);u.pt=Math.max(0,(u.pt||0)-dt);u.hf=Math.max(0,(u.hf||0)-dt);u.rv=Math.max(0,(u.rv||0)-dt);u.sh=Math.max(0,u.sh-dt);u.hT=Math.max(0,u.hT-dt);u.cd-=dt;if(u.st>0)u.st-=dt;if(u.spd>0)u.spd-=dt;if(u.burst>0){u.burst-=dt;u.bfire-=dt;if(u.bfire<=0){u.bfire=.1;const sp=900,q=u.bdir;G.pr.push({x:u.x,y:u.y,vx:Math.cos(q)*sp,vy:Math.sin(q)*sp,sp,l:460,d:500*(u.hT>0?1.2:1),t:u.team,o:u.id,r:6,c:'#ffd23b'})}}if(u.jt>0){u.jt-=dt;if(u.jt<=0){u.jt=0;boom(u.x,u.y,130,1000*(u.hT>0?1.2:1),u.team,u.id,'#9be7ff');for(const e of foes(u.team))if(dst(e,u)<130+e.r)e.st=.5}}if(u.ammo<3){u.rl+=dt;if(u.rl>=1.3){u.rl=0;u.ammo++}}else u.rl=0;
let mx=0,my=0;if(!u.bot){const n=u.inp;mx=n.mx;my=n.my;if(n.ang!=null)u.face=n.ang;else if(Math.hypot(mx,my)>.1)u.face=Math.atan2(my,mx)}else[mx,my]=bot(u,dt);if(u.st>0){mx=0;my=0}
const l=Math.hypot(mx,my);if(l>1){mx/=l;my/=l}u.mv=l>.1?1:0;const sp=B[u.bi].sp*(u.hT>0?1.15:1)*(u.bm>0?.6:1)*(u.spd>0?1.5:1);u.x+=mx*sp*dt;u.y+=my*sp*dt;coll(u);
if(u.bm>0){u.bm-=dt;u.bt+=dt;if(u.bt>=.5){u.bt-=.5;beam(u)}}
if(mode==1&&Math.hypot(u.x-900,u.y-900)>G.gr){u.hp-=900*dt;if(u.hp<=0)kill(u)}}
function sUpd(s,dt){if(!s.alive||s.k=='x')return;s.life-=dt;if(s.life<=0){if(s.k=='h')boom(s.x,s.y,100,2000*s.dm,s.team,s.own,'#444');s.alive=0;return}
s.cd-=dt;const T=nearest(s);let ang=null;if(s.ft>0){s.ft-=dt;ang=s.aim}else if(T)ang=Math.atan2(T.y-s.y,T.x-s.x);
if(ang!==null){s.x+=Math.cos(ang)*s.sp*dt;s.y+=Math.sin(ang)*s.sp*dt;coll(s)}
if(T&&dst(s,T)<s.r+T.r+8){if(s.k=='h'){boom(s.x,s.y,100,2000*s.dm,s.team,s.own,'#555');s.alive=0}else if(s.cd<=0){hurt(T,800*s.dm,G.u[s.own]);s.cd=.8}}}
function goal(t){G.sc[t]++;G.txt='ГОЛ!';if(G.sc[t]>=2)return endGame(t==0,'Счёт '+G.sc[0]+' : '+G.sc[1]);G.pause=2;place(0)}
function upd(dt){const g=G;if(g.over)g.ot+=dt;
for(const f of g.fx){f.t-=dt}g.fx=g.fx.filter(f=>f.t>0);
if(g.pause>0){g.pause-=dt;if(g.pause<=0)g.txt='';return}if(g.over)return;g.t+=dt;
for(const u of g.u)uUpd(u,dt);for(const s of g.s)sUpd(s,dt);g.s=g.s.filter(s=>s.alive);
for(const q of g.cb)for(const u of g.u)if(u.alive&&!q.d&&dst(u,q)<u.r+14){q.d=1;u.cu=(u.cu||0)+1;const ad=B[u.bi].hp*.1;u.mh+=ad;u.hp+=ad;g.fx.push({k:'e',x:u.x,y:u.y,r:40,t:.4,c:'#39e06b'})}g.cb=g.cb.filter(q=>!q.d);
if(mode==1)g.gr=Math.max(160,1300-g.t*10);
for(const w of g.dw)w[4]-=dt;g.dw=g.dw.filter(w=>w[4]>0);
for(const p of g.pr){p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=p.sp*dt;if(p.l<=0||hitW(p.x,p.y,2)||p.x<0||p.y<0||p.x>g.m.w||p.y>g.m.h){p.dead=1;continue}
for(const e of foes(p.t))if(Math.hypot(e.x-p.x,e.y-p.y)<e.r+p.r){hurt(e,p.d,g.u[p.o]);p.dead=1;break}}g.pr=g.pr.filter(p=>!p.dead);
for(const p of g.lob){p.t+=dt;if(p.t>=p.T){p.dead=1;if(p.k=='h')g.ho.push({x:p.tx,y:p.ty,T:1.8,t:0,rad:p.hy?200:150,tm:p.tm,o:p.o,dm:p.hy?1.2:1,hy:p.hy});else boom(p.tx,p.ty,p.rad,p.d,p.tm,p.o,p.hy?'#c46bff':p.k=='m'?'#6edc5f':'#ffb02e')}}g.lob=g.lob.filter(p=>!p.dead);
for(const h of g.ho){h.t+=dt;for(const e of foes(h.tm)){const dx=h.x-e.x,dy=h.y-e.y,d=Math.hypot(dx,dy);if(e.k!='x'&&d<h.rad*1.6&&d>5){e.x+=dx/d*130*dt;e.y+=dy/d*130*dt}}
if(h.t>=h.T){h.dead=1;boom(h.x,h.y,h.rad,1000*h.dm,h.tm,h.o,'#222');g.s.push({k:'h',own:h.o,team:h.tm,hp:4000,mh:4000,r:20,sp:130,life:10,dm:h.dm,cd:0,alive:1,sh:0,x:h.x,y:h.y,ft:0,face:0})}}g.ho=g.ho.filter(h=>!h.dead);
const bl=g.ball;if(bl){if(bl.c){bl.x=bl.c.x+Math.cos(bl.c.face)*16;bl.y=bl.c.y+Math.sin(bl.c.face)*16}else{bl.nk-=dt;const f=Math.pow(.25,dt);bl.vx*=f;bl.vy*=f;
let nx=bl.x+bl.vx*dt;if(hitW(nx,bl.y,8)||nx<0||nx>g.m.w){bl.vx*=-.7;nx=bl.x}bl.x=nx;let ny=bl.y+bl.vy*dt;if(hitW(bl.x,ny,8)||ny<0||ny>g.m.h){bl.vy*=-.7;ny=bl.y}bl.y=ny;
for(const u of g.u)if(u.alive&&dst(u,bl)<u.r+12&&!(bl.nk>0&&bl.k===u)){bl.c=u;break}}
if(bl.y>280&&bl.y<520){if(bl.x<45)return goal(1);if(bl.x>g.m.w-45)return goal(0)}
if(g.t>120&&g.sc[0]!=g.sc[1])endGame(g.sc[0]>g.sc[1],'Время! '+g.sc[0]+' : '+g.sc[1])}
if(mode==3&&g.m.zone){const z=g.m.zone,c0=[0,0];for(const u of g.u)if(u.alive&&Math.hypot(u.x-z.x,u.y-z.y)<z.r)c0[u.team]++;if(c0[0]&&!c0[1])g.zp=(g.zp||0)+dt*12;else if(c0[1]&&!c0[0])g.zq=(g.zq||0)+dt*12;if((g.zp||0)>=100||(g.zq||0)>=100||g.t>=180)endGame((g.zp||0)>=(g.zq||0),'Очки '+Math.floor(g.zp||0)+' : '+Math.floor(g.zq||0))}
if(mode==5&&!g.over){const a0=g.u.some(u=>u.team==0&&u.alive);if(!g.u[3].alive)endGame(true,'Босс повержен!');else if(!a0)endGame(false,'Босс победил')}
if(mode==0||mode==6){const al=[0,0];for(const u of g.u)if(u.alive)al[u.team]++;if(!al[0]||!al[1]){const w=al[0]?0:al[1]?1:Math.round(Math.random());g.sc[w]++;if(g.sc[w]>=2)endGame(w==0,'Счёт '+g.sc[0]+' : '+g.sc[1]);else{g.rd++;g.pause=2;g.txt=(w==0?'Раунд выигран! ':'Раунд проигран. ')+'Раунд '+g.rd;place(0)}}}
if(mode==1&&!g.over&&g.u.filter(u=>u.alive).length<=1){for(const u of G.u)if(u.alive)u.place=1;endGame(false,'')}}

module.exports={
start(r){const hum=r.p.map(p=>({bi:p.bi,name:p.name,team:p.team,lv:p.lv}));newGame(r.mode,hum);r.G=G;r.p.forEach((p,i)=>p.id=hum[i].id);return G},
pin(r,id,e){G=r.G;mode=r.mode;const u=G.u[id];if(u&&u.alive)pin(u,e)},
tick(r,dt){G=r.G;mode=r.mode;upd(dt)},
act(r,id,k,a,d){G=r.G;mode=r.mode;const u=G.u[id];if(!u||!u.alive||G.over||G.pause>0)return;if(k=='h')return hyper(u);
const sh=B[u.bi][k=='a'?'atk':k=='u'?'ult':'gad'];a=+a||0;d=Math.max(0,Math.min(sh.r||0,+d||0));k=='a'?atk(u,a,d):k=='u'?ult(u,a,d):k=='g'?gad(u,a):0}};
