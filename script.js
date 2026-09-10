const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

document.body.classList.add('locked');

// ---------- Space canvas ----------
const canvas = $('#space'), ctx = canvas.getContext('2d');
let stars = [], w, h;
function resizeSpace(){
  w = canvas.width = innerWidth * devicePixelRatio;
  h = canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px';
  stars = Array.from({length: Math.min(260, Math.floor(innerWidth/5))}, () => ({
    x:Math.random()*w,y:Math.random()*h,r:(Math.random()*1.5+.25)*devicePixelRatio,
    a:Math.random(),tw:Math.random()*0.02+.004
  }));
}
function drawSpace(){
  ctx.clearRect(0,0,w,h);
  stars.forEach(s=>{
    s.a += s.tw * (Math.random()>.5?1:-1);
    s.a=Math.max(.15,Math.min(1,s.a));
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,220,245,${s.a})`;ctx.fill();
  });
  requestAnimationFrame(drawSpace);
}
addEventListener('resize',resizeSpace); resizeSpace(); drawSpace();

// ---------- Intro ----------
$('#enterBtn').addEventListener('click', ()=>{
  $('#intro').classList.add('hide');
  document.body.classList.remove('locked');
  startMusic();
  setTimeout(()=>spawnHeart(),300);
});

// ---------- Smooth buttons ----------
$$('[data-scroll]').forEach(btn=>btn.addEventListener('click',()=>$(btn.dataset.scroll).scrollIntoView({behavior:'smooth'})));

// ---------- Modal ----------
const modal=$('#modal'), modalMsg=$('#modalMessage'), modalIcon=$('#modalIcon');
function showModal(message, icon='❤️'){modalMsg.textContent=message;modalIcon.textContent=icon;modal.classList.add('show')}
function closeModal(){modal.classList.remove('show')}
$('#closeModal').onclick=closeModal;
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
$$('.love-card').forEach(card=>card.addEventListener('click',()=>showModal(card.dataset.message,card.querySelector('span').textContent)));
$$('.planet').forEach(p=>p.addEventListener('click',()=>showModal(p.dataset.message,'🌌')));

// ---------- Timeline reveal ----------
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.18});
$$('.timeline-item').forEach(x=>observer.observe(x));

// ---------- 100 reasons ----------
const customReasons=[
'Because your smile can fix a bad day. 🌸',
'Because you make my heart feel safe. ❤️',
'Because you are unbelievably cute.',
'Because your laugh is one of my favorite sounds.',
'Because I love the way you are simply yourself.',
'Because talking to you never feels boring.',
'Because you make little moments unforgettable.',
'Because your happiness matters to me.',
'Because you somehow make everything feel lighter.',
'Because I love seeing you smile.',
'Because your eyes are beautiful.',
'Because you have a beautiful heart.',
'Because you make me want to become better.',
'Because you are my favorite notification.',
'Because I can be myself around you.',
'Because you make ordinary days feel special.',
'Because I love your little habits.',
'Because your presence is comforting.',
'Because you are the person I want to tell things to.',
'Because your cute reactions make me laugh.',
'Because you make my world warmer.',
'Because you are worth every love song.',
'Because I never get tired of your voice.',
'Because you make memories feel precious.',
'Because you are my favorite person to miss.',
'Because you bring color into my world.',
'Because you make my heart skip a beat.',
'Because you are beautiful inside and out.',
'Because I love the way you care.',
'Because you are my heart, Amaya. ❤️'
];
const reasons=Array.from({length:100},(_,i)=>customReasons[i]||`Because there is another little thing about you that makes me love you more. ❤️`);
const rg=$('#reasons-grid'), ro=$('#reason-output p');
reasons.forEach((r,i)=>{
  const b=document.createElement('button');b.className='reason-heart';b.textContent=i+1;b.title='Reason '+(i+1);
  b.onclick=()=>{ $$('.reason-heart').forEach(x=>x.classList.remove('active'));b.classList.add('active');ro.textContent=r; $('#reason-output').scrollIntoView({behavior:'smooth',block:'center'}); };
  rg.appendChild(b);
});

// ---------- Letter ----------
const letter=`Amaya,

If I could give you one thing in this world,
I would give you the ability to see yourself through my eyes.

Then you would understand how incredibly beautiful,
precious, and special you are to me.

You are my favorite person,
my happiest thought,
my safe place,
and my heart.

I don't love you more than anything in this universe...

Because my love for you feels bigger than the universe itself. 🌌❤️

Happy Birthday, Amaya.

I hope this little universe reminds you
that there is someone who will always choose you.

I love you. ❤️`;
let typing=false;
function typeLetter(){
  if(typing)return; typing=true;
  const out=$('#letter-text');out.textContent='';let i=0;
  const timer=setInterval(()=>{out.textContent+=letter[i++]||'';if(i>=letter.length){clearInterval(timer);typing=false}},28);
}
$('#openLetter').onclick=()=>{
  $('#envelope').classList.add('open');
  $('#secretHint').textContent='❤️ From my heart, to yours.';
  $('#openLetter').disabled=true;
  setTimeout(typeLetter,650);
};

// ---------- Floating hearts ----------
function spawnHeart(){
  const el=document.createElement('span');el.className='float-heart';
  el.textContent=['❤️','💗','💖','💕','✨'][Math.floor(Math.random()*5)];
  el.style.left=Math.random()*100+'%';
  el.style.fontSize=(12+Math.random()*22)+'px';
  el.style.animationDuration=(5+Math.random()*7)+'s';
  $('#floating-hearts').appendChild(el);
  setTimeout(()=>el.remove(),13000);
}
setInterval(spawnHeart,850);

// ---------- Simple Web Audio ambience ----------
let audioCtx=null, musicOn=false, master=null, musicTimer=null;
function startMusic(){
  if(musicOn)return;
  try{
    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    master=audioCtx.createGain();master.gain.value=.025;master.connect(audioCtx.destination);
    musicOn=true;
    const notes=[261.63,329.63,392,523.25,392,329.63];
    let n=0;
    const play=()=>{
      if(!musicOn)return;
      const o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.type='sine';o.frequency.value=notes[n++%notes.length];
      g.gain.setValueAtTime(0,audioCtx.currentTime);g.gain.linearRampToValueAtTime(.22,audioCtx.currentTime+.6);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+2.8);
      o.connect(g);g.connect(master);o.start();o.stop(audioCtx.currentTime+2.9);
    };
    play();musicTimer=setInterval(play,1900);
  }catch(e){console.info('Audio unavailable:',e)}
}
$('#musicBtn').onclick=()=>{
  if(!audioCtx){startMusic();return}
  musicOn=!musicOn;
  master.gain.value=musicOn?.025:0;
  $('#musicBtn').textContent=musicOn?'♫':'🔇';
};

// ---------- Finale ----------
let finaleStarted=false;
const finalObserver=new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting&&!finaleStarted){finaleStarted=true;runFinale()}
},{threshold:.35});
finalObserver.observe($('#finale'));

function runFinale(){
  const cd=$('#countdown');let n=3;cd.textContent=n;
  const timer=setInterval(()=>{
    n--;
    if(n>0){cd.animate([{transform:'scale(1.5)',opacity:0},{transform:'scale(1)',opacity:1}],{duration:450});cd.textContent=n}
    else{
      clearInterval(timer);cd.classList.add('hidden');$('#final-reveal').classList.remove('hidden');
      fireworks(120);
    }
  },1000);
}
function fireworks(count){
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const x=Math.random()*innerWidth,y=15+Math.random()*60;
      for(let j=0;j<12;j++){
        const p=document.createElement('span');p.className='float-heart';p.textContent=['✦','♥','✧'][Math.floor(Math.random()*3)];
        p.style.left=x+'px';p.style.bottom=(100-y)+'vh';p.style.fontSize=(8+Math.random()*14)+'px';
        p.style.animationDuration=(1.5+Math.random()*1.7)+'s';p.style.transform=`translate(${(Math.random()-.5)*300}px,${(Math.random()-.5)*220}px)`;
        $('#floating-hearts').appendChild(p);setTimeout(()=>p.remove(),4000);
      }
    },i*18);
  }
}
$('#replayBtn').onclick=()=>location.reload();
