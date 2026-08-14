let AC,M,beat=0,musicTimer;
function audioInit(){if(AC)return;AC=new (AudioContext||webkitAudioContext)();M=AC.createGain();M.gain.value=.17;M.connect(AC.destination);musicTimer=setInterval(musicTick,135)}
function tone(f=120,d=.12,type='sine',v=.08,slide=0,delay=0){if(!AC)return;let t=AC.currentTime+delay,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f+slide),t+d);g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(v,t+.006);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(M);o.start(t);o.stop(t+d+.02)}
function pcm(d,fn,v=.15){if(!AC)return;let r=AC.sampleRate,n=r*d|0,b=AC.createBuffer(1,n,r),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.max(-1,Math.min(1,fn(i/r,i,r)));let s=AC.createBufferSource(),g=AC.createGain();s.buffer=b;g.gain.value=v;s.connect(g);g.connect(M);s.start()}
function sfx(k){if(!AC)return;let p=0,l=0,n=(t)=>Math.random()*2-1;
 if(k==='fart'){let d=.46;pcm(d,(t,i,r)=>{let e=Math.min(1,t/.018)*Math.pow(1-t/d,1.15),f=74*(1-.42*t/d)+9*Math.sin(t*27)+4*Math.sin(t*61),z=n();p+=6.283*f/r;l+=.12*(z-l);return Math.tanh((Math.sin(p)+.32*Math.sin(p*2)+l*.75)*(.58+.42*Math.sin(t*92+Math.sin(t*17)*2))*e*1.5)},.22);tone(1430,.1,'sine',.025,-260,.37)}
 else if(k==='splat'){let d=.22;pcm(d,t=>{let z=n();l+=.05*(z-l);return Math.tanh((l*1.8+Math.sin(390*t)*Math.exp(-t*16)*.8)*Math.pow(1-t/d,2)*2)},.22);tone(1580,.07,'sine',.02,-220,.08)}
 else if(k==='hit'){pcm(.12,t=>(Math.sin(597*t)*.65+n(t)*.35)*Math.exp(-t*25),.15);tone(1120,.16,'sine',.045,-340,.02)}
 else if(k==='absorb'){let d=.42;pcm(d,(t,i,r)=>{let z=n();l+=.04*(z-l);p+=6.283*(70+85*t/d)/r;return Math.tanh((l+.32*Math.sin(p))*Math.sin(Math.PI*t/d)*1.5)},.13);tone(220,.2,'triangle',.03,-140,.1)}
 else if(k==='drain')pcm(.07,t=>(n(t)+.45*Math.sin(900*t))*Math.exp(-t*38),.05);
 else if(k==='dead'){let d=.42;pcm(d,(t,i,r)=>{let z=n();l+=.06*(z-l);p+=6.283*(175-120*t/d)/r;return Math.tanh((Math.sin(p)*.6+l)*Math.pow(1-t/d,1.3)*1.7)},.17)}
 else if(k==='shot')pcm(.11,(t,i,r)=>{p+=6.283*(85+190*t/.11)/r;return Math.sin(p)*Math.exp(-t*20)},.14);
 else if(k==='clean')pcm(.11,t=>{let z=n();l+=.25*(z-l);return(z-l*.7)*Math.pow(1-t/.11,1.7)},.07);
 else if(k==='black'){let d=.75;pcm(d,(t,i,r)=>{let z=n();l+=.025*(z-l);p+=6.283*74*(1-.66*t/d)/r;return Math.tanh((Math.sin(p)*.9+l*.7)*Math.pow(1-t/d,.7)*1.9)},.22)}
 else if(k==='warn'){tone(640,.11,'square',.04,100);tone(865,.12,'triangle',.03,-100,.11)}
 else if(k==='win')[147,196,247,294,392].forEach((f,i)=>tone(f,.28,i<2?'triangle':'sine',.035,30,i*.075));
 else if(k==='dmv')tone(690,.07,'sine',.03,-55)
}
function drum(k){let p=0,l=0,d=k===0?.16:k===1?.11:.045;pcm(d,(t,i,r)=>{let z=Math.random()*2-1;if(!k){p+=6.283*(130*Math.exp(-t*22)+43)/r;return Math.sin(p)*Math.exp(-t*21)}l+=(k===1?.13:.3)*(z-l);return(z-l*(k===1?.55:1)+(!k?0:k===1?Math.sin(1130*t)*.15:0))*Math.exp(-t*(k===1?25:75))},k===0?.1:k===1?.045:.018)}
const B=[0,0,5,3,0,-2,3,-5],hz=(n,b=55)=>b*Math.pow(2,n/12);
function musicTick(){if(!AC||document.hidden)return;let G=window.GAME||{};if(G.phase!=='fight')return;let i=beat++%16,b=G.beauty||0,z=G.zone||0,q=G.boss?1:0,s=z===1?2:z===2?5:0;if(i===0||i===8||q&&i===10)drum(0);if(i===4||i===12)drum(1);if(!(i%2)){drum(2);tone(hz(B[i/2%8]+s)*(q?1.5:1),.18,'triangle',.03+q*.01)}if(b>=35&&i%4===2)tone(hz(B[i/2%8]+12+s,110),.1,'sine',.014);if(b>=65&&!(i%4))tone(hz(B[(i/2+2)%8]+24+s,110),.12,'triangle',.019);if(b>=85&&i%2)tone(hz(24+s+(i%4)*2,110),.05,'sine',.011);if(b>=95&&i%4===3)tone(hz(B[(i/2|0)%8]+36+s,110),.09,'triangle',.023)}
