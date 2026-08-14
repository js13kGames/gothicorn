const fs=require('fs'),vm=require('vm'),path=require('path'),R=path.resolve(__dirname,'..');
const ctx={console,Math,performance:{now:()=>1000},setInterval:()=>0,clearInterval:()=>{},devicePixelRatio:1,addEventListener:()=>{},requestAnimationFrame:()=>{},document:{hidden:false,querySelector:()=>canvas}};
const g={setTransform(){}};const canvas={width:0,height:0,getContext:()=>g,addEventListener:()=>{},getBoundingClientRect:()=>({left:0,top:0,width:390,height:780})};ctx.window=ctx;vm.createContext(ctx);
for(const f of ['data.js','input.js','audio.js','render.js','combat.js','game.js'])vm.runInContext(fs.readFileSync(path.join(R,'src',f),'utf8'),ctx,{filename:f});
function run(s){return vm.runInContext(s,ctx)}
run('reset()');
let before=run('({x:G.player.x,y:G.player.y,h:G.enemies[0].hp})');
run('Input.mouse=1;Input.attack=1;Input.attackPressed=1;Input.ax=G.enemies[0].x-G.camX;Input.ay=G.enemies[0].y-G.camY;Input.keys.KeyD=1;Input.keys.KeyS=1;fight(.1);Input.attackPressed=0;for(let i=0;i<4;i++)fight(.1)');
let after=run('({x:G.player.x,y:G.player.y,h:G.enemies[0].hp,target:!!G.target})');
if(!(after.x>before.x&&after.y>before.y&&after.h<before.h&&after.target))throw Error('independent movement/absorb failed '+JSON.stringify({before,after}));
run('Input.attack=0;Input.attackReleased=1;Input.keys.KeyD=0;Input.keys.KeyS=1;for(let i=0;i<35;i++){fight(.05);Input.attackReleased=0}Input.keys.KeyS=0');
let vert=run('({y:G.player.y,camY:G.camY,worldH:G.worldH,h:G.h})');
if(!(vert.y>780&&vert.camY>20&&vert.worldH>vert.h))throw Error('vertical world/camera failed '+JSON.stringify(vert));
run('Input.moveId=11;Input.moX=80;Input.moY=600;Input.mx=120;Input.my=560;Input.attackId=12;Input.attack=1;Input.mouse=0;Input.aoX=300;Input.aoY=600;Input.ax=340;Input.ay=560');
let dual=run('({m:moveIntent(),a:aimIntent(G.player),moveId:Input.moveId,attackId:Input.attackId})');
if(!(dual.moveId===11&&dual.attackId===12&&Math.hypot(...dual.m)>0&&Math.hypot(...dual.a)>.9))throw Error('dual intent failed '+JSON.stringify(dual));
let dims=run('({w:G.w,h:G.h,cw:C.width,ch:C.height})');
if(dims.w!==520||dims.h!==1040)throw Error('logical viewport failed '+JSON.stringify(dims));

// Telegraph damage resolves after its dodge window, not at warning start.
run('G.beauty=G.player.beauty=0;G.player.hit=0;G.enemies=[enemy(2,G.player.x+120,G.player.y)];G.enemies[0].act=0;ability(G.enemies[0],.01)');
let tele=run('({b:G.beauty,w:G.enemies[0].warn,k:G.enemies[0].kind})');
if(!(tele.b===0&&tele.w>0&&tele.k===2))throw Error('yellow telegraph failed '+JSON.stringify(tele));
run('G.player.x-=300;for(let i=0;i<12;i++)ability(G.enemies[0],.05)');
if(run('G.beauty')!==0)throw Error('yellow dodge failed');
// Blue/Green/Violet use the same delayed action state rather than instant effects.
run('G.player.x=300;G.player.y=650;G.camX=0;G.camY=0;G.enemies=[enemy(4,330,650)];startAbility(G.enemies[0],4)');
let blue=run('({w:G.enemies[0].warn,k:G.enemies[0].kind})');if(!(blue.w>0&&blue.k===4))throw Error('blue telegraph state failed');
run('let a=enemy(0,330,650),g=enemy(3,280,650);a.hp=40;G.enemies=[g,a];startAbility(g,3)');
if(run('G.enemies[0].ally!==G.enemies[1]'))throw Error('green link target failed');
run('G.enemies=[enemy(5,320,650)];startAbility(G.enemies[0],5)');
let violet=run('({w:G.enemies[0].warn,k:G.enemies[0].kind,wx:G.enemies[0].wx,wy:G.enemies[0].wy})');if(!(violet.w>0&&violet.k===5&&violet.wx>0&&violet.wy>0))throw Error('violet telegraph state failed');
// Immediate stacked hits are suppressed by the short Beauty-hit guard.
run('G.beauty=G.player.beauty=0;G.player.hit=0;hitBeauty(10);hitBeauty(10)');
if(run('G.beauty')!==10)throw Error('beauty hit guard failed '+run('G.beauty'));
// Facing controls directional attack/fart origins.
run('G.player.face=-1;let e=enemy(0,400,500);e.face=-1;G.rainbows=[];fart(e)');
let dir=run('({pf:G.player.face,rx:G.rainbows[0].x})');
if(!(dir.pf===-1&&dir.rx===465))throw Error('directional origin failed '+JSON.stringify(dir));


// Desktop wide layout uses a 640 logical viewport while touch portrait uses the 520-wide base.
run("innerWidth=900;innerHeight=430;matchMedia=()=>({matches:true});size()");
let wide=run('({w:G.w,h:G.h})');if(wide.w!==640||wide.h!==780)throw Error('wide desktop viewport failed '+JSON.stringify(wide));
run("innerWidth=390;innerHeight=844;matchMedia=()=>({matches:false});size();reset()");
// Direct touch near, not exactly on, a cousin still acquires it.
run('let q=G.enemies[0];Input.ax=q.x-G.camX+80;Input.ay=q.y-G.camY;let dx=q.x-G.player.x,dy=q.y-G.player.y,m=Math.hypot(dx,dy);window._near=lockTarget(dx/m,dy/m)===q');
if(!run('_near'))throw Error('forgiving target acquisition failed');


// Portrait logical height follows the physical phone aspect ratio, so full-screen CSS scaling stays uniform.
run("innerWidth=390;innerHeight=844;matchMedia=()=>({matches:false});size()");let phone=run('({w:G.w,h:G.h})');if(phone.w!==520||phone.h!==1125)throw Error('390x844 aspect failed '+JSON.stringify(phone));
run("innerWidth=360;innerHeight=800;size()");let phone2=run('({w:G.w,h:G.h})');if(phone2.w!==520||Math.abs(phone2.w/phone2.h-360/800)>.002)throw Error('360x800 aspect failed '+JSON.stringify(phone2));
// Quick tap toward a valid cousin always fires Gloom; deliberate hold crosses into absorption.
run("innerWidth=390;innerHeight=780;size();Input.attack=0;reset();G.shots=[];G.target=G.hover=null;G.attackTime=G.attackHadTarget=0;Input.mouse=1;window._tapq=G.enemies[0];Input.ax=_tapq.x-G.camX;Input.ay=_tapq.y-G.camY;Input.attack=1;Input.attackPressed=1;Input.attackReleased=0;combatStep(.05);Input.attackPressed=0");
if(run('G.target!==null||G.shots.length!==0'))throw Error('tap began drain before hold threshold');
run('Input.attack=0;Input.attackReleased=1;combatStep(.01);Input.attackReleased=0');if(run('G.shots.length')!==1)throw Error('tap toward cousin did not fire gloom');
run("G.shots=[];G.target=G.hover=null;G.attackTime=G.attackHadTarget=0;window._holdq=G.enemies[0];_holdq.hp=_holdq.max=100;_holdq.fart=_holdq.act=999;Input.ax=_holdq.x-G.camX;Input.ay=_holdq.y-G.camY;Input.attack=1;Input.attackPressed=1;combatStep(.05);Input.attackPressed=0;for(let i=0;i<20;i++)combatStep(.05)");let hold=run('({target:!!G.target,h:G.enemies[0].hp,v:G.void})');if(!(hold.target&&hold.h>50&&hold.h<70&&hold.v>10&&hold.v<18))throw Error('hold/drain rebalance failed '+JSON.stringify(hold));


// Drain is close-range while Gloom aim assist may still reach across the visible arena.
run('G.target=G.hover=null;window._rp=G.player;window._re=enemy(0,_rp.x+235,_rp.y);G.enemies=[_re];Input.ax=_re.x-G.camX;Input.ay=_re.y-G.camY;window._dx=_re.x-_rp.x;window._dy=_re.y-_rp.y;window._dm=Math.hypot(_dx,_dy)');
let ranges=run('({drain:!!lockTarget(_dx/_dm,_dy/_dm),bolt:!!lockTarget(_dx/_dm,_dy/_dm,440)})');if(ranges.drain||!ranges.bolt)throw Error('drain/bolt range split failed '+JSON.stringify(ranges));
// Red now owns a real telegraphed close attack rather than spending ability turns doing nothing.
run('G.player.x=300;G.player.y=650;G.player.hit=0;G.beauty=0;window._redE=enemy(0,380,650);G.enemies=[_redE];startAbility(_redE,0)');let red=run('({w:G.enemies[0].warn,k:G.enemies[0].kind,b:G.beauty})');if(!(red.w>0&&red.k===0&&red.b===0))throw Error('red telegraph failed '+JSON.stringify(red));run('for(let i=0;i<8;i++)ability(G.enemies[0],.05)');if(run('G.beauty')<=0)throw Error('red close attack did not resolve');
// Generic poop cadence is intentionally slower; Orange remains the relative poop specialist.
run('window._pn=enemy(2,300,650);window._po=enemy(1,300,650);window._poop={n:_pn.fart,o:_po.fart}');let poop=run('_poop');if(!(poop.n>=4.5&&poop.o>=4.5))throw Error('initial poop delay too short '+JSON.stringify(poop));

console.log('RUNTIME LOGIC VERIFIED',JSON.stringify({independent:after,vertical:vert,dual,dims}));
