// Source-only deterministic calibration: exercises the complete state spine with the real combat owner.
const fs=require('fs'),vm=require('vm'),path=require('path'),R=path.resolve(__dirname,'..');
function one(seed0){
 let seed=seed0>>>0,M=Object.create(Math);M.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 const canvas={width:0,height:0,getContext:()=>({setTransform(){}}),addEventListener:()=>{},getBoundingClientRect:()=>({left:0,top:0,width:390,height:780})};
 const c={console,Math:M,performance:{now:()=>1000},setInterval:()=>0,clearInterval:()=>{},devicePixelRatio:1,addEventListener:()=>{},requestAnimationFrame:()=>{},document:{hidden:false,querySelector:()=>canvas}};c.window=c;vm.createContext(c);
 for(const f of ['data.js','input.js','audio.js','render.js','combat.js','game.js'])vm.runInContext(fs.readFileSync(path.join(R,'src',f),'utf8'),c,{filename:f});
 const run=s=>vm.runInContext(s,c);run('reset();Input.mouse=1');let prevPhase='',encStart=0,steps=0,maxBeauty=0,blackouts=0,enc=[];
 while(steps++<70000){let phase=run('G.phase'),beauty=run('G.beauty'),t=steps*.05;maxBeauty=Math.max(maxBeauty,beauty);if(phase!==prevPhase){if(prevPhase==='fight')enc.push({run:run('G.run'),seconds:+(t-encStart).toFixed(1),beauty:+beauty.toFixed(1)});if(phase==='fight')encStart=t;prevPhase=phase}
  if(phase==='ending')return{seed:seed0,complete:true,steps,maxBeauty:+maxBeauty.toFixed(1),blackouts,encounters:enc.length,enc};
  if(phase==='over')return{seed:seed0,complete:false,reason:'beauty defeat',steps,maxBeauty:+maxBeauty.toFixed(1),blackouts,encounters:enc.length,run:run('G.run'),enc};
  if(phase==='fight'){
   let st=run(`(()=>{let P=G.player,E=G.enemies.filter(e=>!e.dead),e=G.target&&!G.target.dead?G.target:E.sort((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y))[0],r=G.rainbows.filter(x=>x.life>0).sort((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y))[0];return e?{px:P.x,py:P.y,ex:e.x,ey:e.y,cx:G.camX,cy:G.camY,w:e.warn,k:e.kind,wx:e.wx||0,wy:e.wy||0,rx:r?.x||0,ry:r?.y||0,rd:r?Math.hypot(r.x-P.x,r.y-P.y):999,v:G.void,b:G.beauty}:0})()`);
   if(!st){run('fight(.05)');continue}let dx=st.ex-st.px,dy=st.ey-st.py,d=Math.hypot(dx,dy)||1,mx=-dy/d,my=dx/d;
   if(st.w>0&&st.k===2){mx=-dx/d;my=-dy/d}else if(st.w>0&&st.k===4){mx=-dy/d;my=dx/d}else if(st.w>0&&st.k===5){let qx=st.px-st.wx,qy=st.py-st.wy,q=Math.hypot(qx,qy)||1;mx=qx/q;my=qy/q}else if(st.rd<105){let qx=st.px-st.rx,qy=st.py-st.ry,q=Math.hypot(qx,qy)||1;mx=qx/q;my=qy/q}else if(d>315){mx=dx/d;my=dy/d}else if(d<155){mx=-dx/d;my=-dy/d}
   run(`Input.ax=${st.ex-st.cx};Input.ay=${st.ey-st.cy};Input.moveId=77;Input.moX=100;Input.moY=600;Input.mx=${100+mx*55};Input.my=${600+my*55};Input.black=0`);
   if(st.v>=100&&st.b>55){run('Input.black=1');blackouts++}
   if(d>215&&steps%6===0)run('Input.attack=1;Input.attackPressed=1;Input.attackReleased=0;fight(.04);Input.attack=0;Input.attackPressed=0;Input.attackReleased=1;fight(.01);Input.attackReleased=0;Input.black=0');else run('Input.attack=1;Input.attackPressed=0;Input.attackReleased=0;fight(.05);Input.black=0');
  }else if(phase==='clean'){
   run('Input.attack=0;Input.moveId=-1;Input.attackReleased=0');let ready=run('G.cleanReady'),n=run('G.rainbows.length');if(!ready){run('Input.down=0;clean(.05)')}else if(n){let r=run('({x:G.rainbows[0].x-G.camX,y:G.rainbows[0].y-G.camY})');run(`Input.down=1;Input.x=${r.x};Input.y=${r.y};clean(.05)`)}else run('Input.down=0;clean(.05)');
  }else if(phase==='dmv'){run('Input.attack=0;Input.down=0;dmv(.05)')}else run('step(.05)');
 }
 return{seed:seed0,complete:false,reason:'step ceiling',steps,maxBeauty:+maxBeauty.toFixed(1),blackouts,run:run('G.run'),phase:run('G.phase'),enc};
}
let results=[7,19,41].map(one),out={status:results.every(x=>x.complete)?'LOGIC_SPINE_COMPLETE':'DIAGNOSTIC_LIMITATION',note:'Deterministic source-only calibration; not browser or human-play certification.',results};console.log(JSON.stringify(out,null,2));if(!results.some(x=>x.complete))process.exit(1);
