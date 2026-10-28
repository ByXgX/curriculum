(function(){
  var root=document.documentElement,btn=document.getElementById('theme');
  try{var s=localStorage.getItem('theme');if(s)root.setAttribute('data-theme',s)}catch(e){}
  btn.addEventListener('click',function(){
    var dark=root.getAttribute('data-theme')==='dark'||(!root.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme:dark)').matches);
    var next=dark?'light':'dark';root.setAttribute('data-theme',next);
    try{localStorage.setItem('theme',next)}catch(e){}
  });

  var data=[
    {t:'Web Application Development',p:'Responsive sites and web apps, from landing pages for small businesses to database-backed back ends.',c:['HTML5','CSS3','JavaScript','Bootstrap 5','Node.js','Laravel']},
    {t:'Multiplatform Applications',p:'Mobile and desktop software with local or remote data and store-style interfaces.',c:['Flutter','Python','C#','MySQL']},
    {t:'Games, Modelling and Animation',p:'Gameplay mechanics in 2D and 3D, plus the models and animation that go with them.',c:['Unity','C#','Maya','Blender']}
  ];
  var panel=document.getElementById('deck-panel'),tabs=document.querySelectorAll('.tabs button');
  function show(i){
    var d=data[i],h=document.createElement('div');
    var t=document.createElement('h3');t.textContent=d.t;
    var p=document.createElement('p');p.textContent=d.p;
    var ul=document.createElement('ul');ul.className='chips';
    d.c.forEach(function(x){var li=document.createElement('li');li.className='chip';li.textContent=x;ul.appendChild(li)});
    h.append(t,p,ul);panel.replaceChildren(h);
    tabs.forEach(function(b,j){b.setAttribute('aria-selected',j===i)});
  }
  tabs.forEach(function(b){b.addEventListener('click',function(){show(+b.dataset.i)})});
  show(0);

  document.getElementById('form').addEventListener('submit',function(ev){
    ev.preventDefault();
    var n=document.getElementById('n').value.trim(),e=document.getElementById('e').value.trim(),m=document.getElementById('m').value.trim(),st=document.getElementById('status');
    if(!n||!/^\S+@\S+\.\S+$/.test(e)||!m){st.style.color='var(--coral)';st.textContent='Please add your name, a valid email and a message.';return}
    st.style.color='var(--teal)';st.textContent='Opening your email app to send the message.';
    location.href='mailto:guillep2002@gmail.com?subject='+encodeURIComponent('Portfolio enquiry from '+n)+'&body='+encodeURIComponent(m+'\n\n'+n+' ('+e+')');
  });
})();
