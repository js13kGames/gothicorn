const fs=require('fs'),vm=require('vm'),path=require('path'),R=path.resolve(__dirname,'..');
let made={osc:0,buf:0,src:0};
class Gain{constructor(){this.gain={value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}}}connect(){}}
class Osc{constructor(){made.osc++;this.frequency={setValueAtTime(){},exponentialRampToValueAtTime(){}}}connect(){}start(){}stop(){}}
class Buf{constructor(n){this.a=new Float32Array(n)}getChannelData(){return this.a}}
class Src{constructor(){made.src++}connect(){}start(){}}
class AC{constructor(){this.sampleRate=12000;this.currentTime=0;this.destination={}}createGain(){return new Gain}createOscillator(){return new Osc}createBuffer(c,n){made.buf++;return new Buf(n)}createBufferSource(){return new Src}}
const ctx={console,Math,AudioContext:AC,webkitAudioContext:AC,setInterval:()=>1,clearInterval(){},document:{hidden:false},GAME:{phase:'fight',beauty:0,zone:0,boss:0}};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(R,'src/audio.js'),'utf8'),ctx);
vm.runInContext('audioInit()',ctx);
for(const k of ['fart','splat','hit','absorb','drain','dead','shot','clean','black','warn','win','dmv'])vm.runInContext(`sfx('${k}')`,ctx);
for(const b of [0,35,65,85,95]){ctx.GAME.beauty=b;vm.runInContext('musicTick()',ctx)}
if(!(made.buf>=9&&made.osc>=8&&made.src>=9))throw Error(JSON.stringify(made));
console.log('SHIPPING AUDIO VERIFIED',JSON.stringify(made));
