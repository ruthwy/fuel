/* ============================================================
   Fuel — personal food tracker. All data in localStorage.
   ============================================================ */
"use strict";

const SLOTS = [
  { key:"pre",     name:"Pre-breakfast" },
  { key:"bf",      name:"Breakfast" },
  { key:"mid",     name:"Mid-morning" },
  { key:"lunch",   name:"Lunch" },
  { key:"eve",     name:"Evening snack" },
  { key:"night",   name:"Night" },
];

const UNITS = { g:"g", pc:"piece", cup:"cup", tbsp:"tbsp", tsp:"tsp", scoop:"scoop" };

/* ---------- starter food DB ----------
   unit 'g'  -> macros are per 100 g, `basis` says cooked/raw weight
   other units -> macros are per 1 unit                                */
const STARTER_FOODS = [
 {id:"rice",    name:"White rice",            unit:"g", basis:"cooked", kcal:130,p:2.7,c:28,f:0.3,fb:0.4,sg:0},
 {id:"brice",   name:"Brown rice",            unit:"g", basis:"cooked", kcal:112,p:2.3,c:24,f:0.8,fb:1.8,sg:0},
 {id:"roti",    name:"Roti / chapati",        unit:"pc",basis:"",       kcal:104,p:3.1,c:18,f:2.4,fb:2,sg:0},
 {id:"dosa",    name:"Dosa",                  unit:"pc",basis:"",       kcal:133,p:2.6,c:18,f:5.5,fb:0.9,sg:0},
 {id:"idli",    name:"Idli",                  unit:"pc",basis:"",       kcal:58,p:2,c:12,f:0.4,fb:0.6,sg:0},
 {id:"poha",    name:"Poha (dry flakes)",     unit:"g", basis:"raw",    kcal:360,p:6.6,c:78,f:1.2,fb:2,sg:0},
 {id:"rava",    name:"Rava / upma (dry)",     unit:"g", basis:"raw",    kcal:360,p:10,c:72,f:1,fb:2,sg:0},
 {id:"oats",    name:"Oats (dry)",            unit:"g", basis:"raw",    kcal:389,p:13.5,c:66,f:7,fb:10,sg:1},
 {id:"bread",   name:"Bread",                 unit:"pc",basis:"",       kcal:75,p:2.5,c:13,f:1,fb:0.7,sg:1.5},
 {id:"toor",    name:"Toor dal (dry)",        unit:"g", basis:"raw",    kcal:343,p:22,c:63,f:1.5,fb:15,sg:0},
 {id:"moong",   name:"Moong dal (dry)",       unit:"g", basis:"raw",    kcal:347,p:24,c:63,f:1.2,fb:16,sg:0},
 {id:"chana",   name:"Chana / chickpea (dry)",unit:"g", basis:"raw",    kcal:364,p:19,c:61,f:6,fb:17,sg:0},
 {id:"rajma",   name:"Rajma (dry)",           unit:"g", basis:"raw",    kcal:333,p:24,c:60,f:0.8,fb:25,sg:0},
 {id:"chbr",    name:"Chicken breast",        unit:"g", basis:"raw",    kcal:120,p:22.5,c:0,f:2.6,fb:0,sg:0},
 {id:"chcur",   name:"Chicken curry",         unit:"g", basis:"cooked", kcal:150,p:14,c:4,f:8,fb:0.5,sg:1},
 {id:"egg",     name:"Egg (whole)",           unit:"pc",basis:"",       kcal:72,p:6.3,c:0.4,f:4.8,fb:0,sg:0},
 {id:"eggw",    name:"Egg white",             unit:"pc",basis:"",       kcal:17,p:3.6,c:0.2,f:0.1,fb:0,sg:0},
 {id:"fish",    name:"Fish (rohu/tilapia)",   unit:"g", basis:"raw",    kcal:96,p:20,c:0,f:1.7,fb:0,sg:0},
 {id:"paneer",  name:"Paneer",                unit:"g", basis:"raw",    kcal:296,p:18,c:4,f:23,fb:0,sg:2},
 {id:"curd",    name:"Curd / dahi",           unit:"g", basis:"raw",    kcal:60,p:3.5,c:4.7,f:3.3,fb:0,sg:4.7},
 {id:"milk",    name:"Milk (toned, 1 cup)",   unit:"cup",basis:"",      kcal:122,p:8,c:12,f:4.8,fb:0,sg:12},
 {id:"whey",    name:"Whey protein",          unit:"scoop",basis:"",    kcal:120,p:24,c:3,f:1.5,fb:0,sg:2},
 {id:"pnut",    name:"Peanuts",               unit:"g", basis:"raw",    kcal:567,p:26,c:16,f:49,fb:8.5,sg:4},
 {id:"almond",  name:"Almonds",               unit:"g", basis:"raw",    kcal:579,p:21,c:22,f:50,fb:12.5,sg:4},
 {id:"pb",      name:"Peanut butter",         unit:"tbsp",basis:"",     kcal:94,p:4,c:3,f:8,fb:0.8,sg:1.5},
 {id:"ghee",    name:"Ghee",                  unit:"tsp",basis:"",      kcal:45,p:0,c:0,f:5,fb:0,sg:0},
 {id:"banana",  name:"Banana",                unit:"pc",basis:"",       kcal:105,p:1.3,c:27,f:0.4,fb:3,sg:14},
 {id:"apple",   name:"Apple",                 unit:"pc",basis:"",       kcal:95,p:0.5,c:25,f:0.3,fb:4,sg:19},
 {id:"sabzi",   name:"Vegetable sabzi",       unit:"g", basis:"cooked", kcal:80,p:2,c:8,f:4,fb:2.5,sg:2},
 {id:"sambar",  name:"Sambar",                unit:"g", basis:"cooked", kcal:55,p:2.5,c:8,f:1.5,fb:1.5,sg:1},
 {id:"salad",   name:"Salad (raw veg)",       unit:"g", basis:"raw",    kcal:25,p:1,c:5,f:0.2,fb:2,sg:2},
 {id:"spot",    name:"Sweet potato",          unit:"g", basis:"raw",    kcal:86,p:1.6,c:20,f:0.1,fb:3,sg:4},
 {id:"biryani", name:"Chicken biryani",       unit:"g", basis:"cooked", kcal:165,p:8,c:20,f:6,fb:0.6,sg:1},
 {id:"coffee",  name:"Coffee (milk+sugar)",   unit:"cup",basis:"",      kcal:60,p:2,c:8,f:2,fb:0,sg:7,caf:1},
 {id:"bcoffee", name:"Black coffee",          unit:"cup",basis:"",      kcal:2,p:0,c:0,f:0,fb:0,sg:0,caf:1},
 {id:"tea",     name:"Tea (milk+sugar)",      unit:"cup",basis:"",      kcal:45,p:1.5,c:7,f:1.5,fb:0,sg:6,caf:1},
 {id:"gtea",    name:"Green tea",             unit:"cup",basis:"",      kcal:0,p:0,c:0,f:0,fb:0,sg:0,caf:1},
 {id:"biscuit", name:"Biscuit (marie)",       unit:"pc",basis:"",       kcal:28,p:0.4,c:4.5,f:0.9,fb:0.1,sg:1.5},
];

const STARTER_PLAN = {
  pre:   [{foodId:"bcoffee",qty:1}],
  bf:    [{foodId:"oats",qty:50},{foodId:"milk",qty:1},{foodId:"banana",qty:1}],
  mid:   [{foodId:"egg",qty:2},{foodId:"gtea",qty:1}],
  lunch: [{foodId:"rice",qty:200},{foodId:"toor",qty:40},{foodId:"sabzi",qty:150},{foodId:"curd",qty:100}],
  eve:   [{foodId:"pnut",qty:30},{foodId:"tea",qty:1}],
  night: [{foodId:"roti",qty:2},{foodId:"chcur",qty:150},{foodId:"salad",qty:100}],
};

/* ---------- state ---------- */
let D = load();
let viewDate = todayKey();
let pickCtx = null;   // {target:'slot'|'plan', slot}
let pickedFood = null;

function load(){
  try{
    const raw = localStorage.getItem("ft_data");
    if(raw){ const d = JSON.parse(raw); if(!d.foods) d.foods = STARTER_FOODS; return d; }
  }catch(e){}
  return { profile:null, weights:[], foods:STARTER_FOODS.slice(),
           plan:JSON.parse(JSON.stringify(STARTER_PLAN)), days:{}, chat:[], apiKey:"" };
}
function save(){ localStorage.setItem("ft_data", JSON.stringify(D)); }

/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
function todayKey(d){ const t = d||new Date();
  return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0"); }
function fromKey(k){ const [y,m,d]=k.split("-").map(Number); return new Date(y,m-1,d); }
function clamp(x,a,b){ return Math.min(b,Math.max(a,x)); }
function r1(x){ return Math.round(x*10)/10; }
function toast(msg){ const t=$("toast"); t.textContent=msg; t.style.display="block";
  clearTimeout(t._h); t._h=setTimeout(()=>t.style.display="none",2200); }
function day(k){ k=k||viewDate;
  if(!D.days[k]) D.days[k]={meals:{},water:0};
  return D.days[k]; }
function slotData(k,slot){ const d=day(k);
  if(!d.meals[slot]) d.meals[slot]={items:[],skipped:false};
  return d.meals[slot]; }
function food(id){ return D.foods.find(f=>f.id===id); }

/* ---------- grading ---------- */
function gradeOf(f){
  const k=f.kcal;
  if(!k) return "g";
  const pPct=f.p*4*100/k, sPct=(f.sg||0)*4*100/k, fatPct=f.f*9*100/k, fbDen=(f.fb||0)*100/k;
  if(sPct>=35 && fbDen<1) return "b";
  if(pPct>=25 || fbDen>=2.5) return "g";
  if(pPct>=12 && (f.unit!=="g" ? f.kcal<=250 : f.kcal<=250)) return "g";
  if(f.unit==="g" && f.kcal>=450) return "o";
  if(fatPct>=65 && pPct<12) return "b";
  return "o";
}
function itemMacros(f, qty){
  const mult = f.unit==="g" ? qty/100 : qty;
  return { kcal:Math.round(f.kcal*mult), p:r1(f.p*mult), c:r1(f.c*mult),
           f:r1(f.f*mult), fb:r1((f.fb||0)*mult), sg:r1((f.sg||0)*mult),
           caf:(f.caf?qty:0) };
}
function qtyLabel(f){
  if(f.unit==="g") return f.basis==="cooked" ? "Grams (COOKED weight)"
                 : f.basis==="raw" ? "Grams (RAW / uncooked weight)" : "Grams";
  return "Number of " + (UNITS[f.unit]||f.unit) + "s";
}

/* ---------- goal engine ---------- */
function latestWeight(){
  if(D.weights.length) return D.weights[D.weights.length-1].kg;
  return D.profile ? D.profile.startWeight : 70;
}
function targets(){
  const p = D.profile;
  if(!p) return null;
  const w = latestWeight();
  let bmr = 10*w + 6.25*p.heightCm - 5*p.age + (p.gender==="male" ? 5 : -161);
  const tdee = bmr * p.activity;
  const now = fromKey(todayKey()), end = fromKey(p.targetDate);
  const daysLeft = Math.max(7,(end-now)/864e5);
  let rate = (p.targetWeight - w)/(daysLeft/7);          // kg per week
  rate = clamp(rate,-1,0.5);
  let kcal = Math.round(tdee + rate*7700/7);
  kcal = Math.max(kcal, p.gender==="male"?1500:1200);
  const protein = Math.round(w * (rate<0 ? 1.8 : 1.6));
  const fat = Math.round(kcal*0.25/9);
  const carbs = Math.round((kcal - protein*4 - fat*9)/4);
  // weekly checkpoint: linear path start -> target
  const start = fromKey(p.startDate), total=Math.max(1,(end-start)/864e5);
  const frac = clamp((now-start)/864e5/total,0,1);
  const checkpoint = r1(p.startWeight + (p.targetWeight-p.startWeight)*frac);
  return { kcal, protein, fat, carbs, tdee:Math.round(tdee), rate:r1(rate),
           checkpoint, weight:w };
}
function waterTarget(k){
  const p=D.profile; if(!p) return {glasses:8, base:8, bonus:0};
  const baseMl = latestWeight()*35;
  let caf=0;
  const d=D.days[k||viewDate];
  if(d) for(const s in d.meals) for(const it of d.meals[s].items) if(it.caf) caf+=it.caf;
  const bonus = Math.ceil(caf*200/250);
  const base = Math.ceil(baseMl/250);
  return { glasses:base+bonus, base, bonus };
}
function dayTotals(k){
  const d=D.days[k]; const t={kcal:0,p:0,c:0,f:0,fb:0,sg:0,caf:0,logged:false};
  if(!d) return t;
  for(const s in d.meals) for(const it of d.meals[s].items){
    t.kcal+=it.kcal; t.p+=it.p; t.c+=it.c; t.f+=it.f; t.fb+=it.fb||0; t.sg+=it.sg||0;
    t.caf+=it.caf||0; t.logged=true;
  }
  t.p=r1(t.p); t.c=r1(t.c); t.f=r1(t.f);
  return t;
}

/* ---------- navigation ---------- */
function go(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.querySelectorAll(".nav button").forEach(b=>b.classList.remove("active"));
  $("page-"+page).classList.add("active");
  $("nav-"+page).classList.add("active");
  if(page==="today") renderToday();
  if(page==="trends") renderTrends();
  if(page==="foods") { renderPlan(); renderDB(); }
  if(page==="chat") renderChat();
  if(page==="profile") renderProfile();
}
function shiftDay(n){
  const d=fromKey(viewDate); d.setDate(d.getDate()+n);
  if(d > new Date()) return;
  viewDate = todayKey(d); renderToday();
}
function openModal(id){ $(id).classList.add("show"); }
function closeModal(id){ $(id).classList.remove("show"); }

/* ---------- TODAY ---------- */
function barClass(val,target,overBad){
  const r = val/Math.max(1,target);
  if(overBad){ return r<=1.02 ? (r>=0.8?"g":"o") : (r<=1.12?"o":"b"); }
  return r>=0.9 ? "g" : (r>=0.6?"o":"b");
}
function renderToday(){
  const isToday = viewDate===todayKey();
  $("today-title").textContent = isToday?"Today":fromKey(viewDate).toLocaleDateString(undefined,{weekday:"short"});
  $("today-date").textContent = fromKey(viewDate).toLocaleDateString(undefined,{day:"numeric",month:"short"});
  const T = targets(), tot = dayTotals(viewDate);
  let html="";
  if(!T){ html="<p class='muted'>Set up your profile first → Profile tab.</p>"; }
  else{
    const rows=[ ["Calories", Math.round(tot.kcal), T.kcal, "kcal", true],
                 ["Protein",  r1(tot.p), T.protein, "g", false],
                 ["Carbs",    r1(tot.c), T.carbs, "g", true],
                 ["Fat",      r1(tot.f), T.fat, "g", true] ];
    for(const [name,val,tar,unit,overBad] of rows){
      const pct=clamp(val/Math.max(1,tar)*100,0,100);
      html+=`<div class="stat-row"><span>${name}</span><b>${val} / ${tar} ${unit}</b></div>
             <div class="bar"><div class="${barClass(val,tar,overBad)}" style="width:${pct}%"></div></div>`;
    }
    html+=`<div class="stat-row muted"><span>Fiber ${r1(tot.fb)} g · Sugar ${r1(tot.sg)} g</span>
           <span>${T.kcal-Math.round(tot.kcal)} kcal left</span></div>`;
  }
  $("summary-card").innerHTML=html;

  // slots
  let sh="";
  for(const s of SLOTS){
    const sd=slotData(viewDate,s.key);
    const kcal=sd.items.reduce((a,i)=>a+i.kcal,0);
    const done=sd.items.length>0, skipped=sd.skipped&&!done;
    const check = done?`<div class="check done">✓</div>`
                : skipped?`<div class="check skip">—</div>`:`<div class="check"></div>`;
    let items="";
    for(let i=0;i<sd.items.length;i++){
      const it=sd.items[i];
      items+=`<div class="slot-item"><span class="dot ${it.grade}"></span>
        <span class="i-name">${it.name} <span class="muted">${it.qty}${it.unit==="g"?"g":"×"}</span></span>
        <span class="i-macro">${it.kcal} kcal · ${it.p}g P</span>
        <button class="del" onclick="delItem(event,'${s.key}',${i})">✕</button></div>`;
    }
    const hasPlan=(D.plan[s.key]||[]).length>0;
    sh+=`<div class="slot" id="slot-${s.key}">
      <div class="slot-head" onclick="toggleSlot('${s.key}')">
        ${check}<span class="s-name">${s.name}</span>
        <span class="s-kcal">${done?kcal+" kcal":skipped?"skipped":""}</span>
      </div>
      <div class="slot-body">${items}
        <div class="slot-actions">
          ${hasPlan?`<button class="btn good" onclick="usePlan('${s.key}')">✓ Use plan</button>`:""}
          <button class="btn" onclick="openPicker('slot','${s.key}')">+ Add food</button>
          <button class="btn" onclick="toggleSkip('${s.key}')">${skipped?"Unskip":"Skip"}</button>
        </div></div></div>`;
  }
  $("slots").innerHTML=sh;

  // water
  const wt=waterTarget(viewDate), drank=day(viewDate).water||0;
  let wg="";
  for(let i=0;i<wt.glasses;i++){
    wg+=`<div class="glass ${i<drank?"full":""} ${i>=wt.base?"bonus":""}" onclick="tapGlass(${i})">${(i+1)*250>=1000? r1((i+1)*0.25)+"L":""}</div>`;
  }
  $("water-card").innerHTML=`
    <div class="stat-row"><span>💧 Water</span>
    <b>${(drank*0.25).toFixed(2)} / ${(wt.glasses*0.25).toFixed(2)} L</b></div>
    <div class="muted">${wt.bonus?`+${wt.bonus} glass${wt.bonus>1?"es":""} added for caffeine today`:"Base target from your weight"}</div>
    <div class="water-glasses">${wg}</div>`;
}
function toggleSlot(key){ $("slot-"+key).classList.toggle("open"); }
function toggleSkip(key){ const sd=slotData(viewDate,key); sd.skipped=!sd.skipped; save(); renderToday(); keepOpen(key); }
function keepOpen(key){ const el=$("slot-"+key); if(el) el.classList.add("open"); }
function delItem(ev,slot,idx){ ev.stopPropagation();
  slotData(viewDate,slot).items.splice(idx,1); save(); renderToday(); keepOpen(slot); }
function usePlan(slot){
  const sd=slotData(viewDate,slot);
  for(const pi of (D.plan[slot]||[])){
    const f=food(pi.foodId); if(!f) continue;
    const m=itemMacros(f,pi.qty);
    sd.items.push({foodId:f.id,name:f.name,qty:pi.qty,unit:f.unit,grade:gradeOf(f),...m});
  }
  sd.skipped=false; save(); renderToday(); keepOpen(slot); toast("Plan logged ✓");
}
function tapGlass(i){
  const d=day(viewDate);
  d.water = (d.water===i+1) ? i : i+1;
  save(); renderToday();
}

/* ---------- food picker ---------- */
function openPicker(target,slot){
  pickCtx={target,slot}; pickedFood=null;
  $("food-search").value=""; $("qty-section").style.display="none";
  $("food-modal-title").textContent = target==="plan" ? "Add to plan — "+SLOTS.find(s=>s.key===slot).name
                                                      : "Add food — "+SLOTS.find(s=>s.key===slot).name;
  renderFoodPicker(); openModal("food-modal");
}
function renderFoodPicker(){
  const q=$("food-search").value.toLowerCase();
  const list=D.foods.filter(f=>f.name.toLowerCase().includes(q));
  $("food-picker").innerHTML=list.map(f=>`
    <div class="food-row" onclick="pickFood('${f.id}')">
      <span class="dot ${gradeOf(f)}"></span><span class="f-name">${f.name}</span>
      ${f.unit==="g"&&f.basis?`<span class="basis-tag">${f.basis}</span>`:""}
      <span class="f-info">${f.kcal} kcal / ${f.unit==="g"?"100g":UNITS[f.unit]}<br>${f.p}g P</span>
    </div>`).join("") || "<p class='muted'>No match. Add it in Foods → database.</p>";
}
function pickFood(id){
  pickedFood=food(id);
  $("qty-section").style.display="block";
  $("qty-label").textContent=qtyLabel(pickedFood);
  $("qty-input").value = pickedFood.unit==="g" ? 100 : 1;
  updateQtyPreview();
  $("qty-input").oninput=updateQtyPreview;
}
function updateQtyPreview(){
  const q=parseFloat($("qty-input").value)||0;
  const m=itemMacros(pickedFood,q);
  $("qty-preview").textContent=`${m.kcal} kcal · ${m.p}g protein · ${m.c}g carbs · ${m.f}g fat`;
}
function confirmAddFood(){
  const q=parseFloat($("qty-input").value);
  if(!pickedFood||!q||q<=0) return;
  if(pickCtx.target==="plan"){
    if(!D.plan[pickCtx.slot]) D.plan[pickCtx.slot]=[];
    D.plan[pickCtx.slot].push({foodId:pickedFood.id,qty:q});
    save(); closeModal("food-modal"); renderPlan(); toast("Added to plan");
  }else{
    const m=itemMacros(pickedFood,q);
    slotData(viewDate,pickCtx.slot).items.push(
      {foodId:pickedFood.id,name:pickedFood.name,qty:q,unit:pickedFood.unit,
       grade:gradeOf(pickedFood),...m});
    save(); closeModal("food-modal"); renderToday(); keepOpen(pickCtx.slot);
  }
}

/* ---------- weight ---------- */
function saveWeight(){
  const kg=parseFloat($("weight-input").value);
  if(!kg||kg<20||kg>300){ toast("Enter a valid weight"); return; }
  const k=todayKey();
  const ex=D.weights.find(w=>w.date===k);
  if(ex) ex.kg=kg; else D.weights.push({date:k,kg});
  D.weights.sort((a,b)=>a.date<b.date?-1:1);
  save(); closeModal("weight-modal"); renderTrends(); toast("Weight logged ✓");
}

/* ---------- TRENDS ---------- */
function renderTrends(){
  const T=targets();
  if(!T){ $("goal-card").innerHTML="<p class='muted'>Set up your profile first.</p>"; return; }
  const p=D.profile;
  const diff=r1(T.weight-T.checkpoint);
  const onTrack = (p.targetWeight<p.startWeight) ? diff<=0.3 : diff>=-0.3;
  $("goal-card").innerHTML=`
    <div class="grid2">
      <div><div class="muted">Current</div><div class="big-num">${T.weight} kg</div></div>
      <div><div class="muted">Target (${fromKey(p.targetDate).toLocaleDateString(undefined,{day:"numeric",month:"short"})})</div>
        <div class="big-num">${p.targetWeight} kg</div></div>
    </div><hr>
    <div class="stat-row"><span>This week's checkpoint</span><b>${T.checkpoint} kg</b></div>
    <div class="stat-row"><span>Status</span>
      <b style="color:var(--${onTrack?"good":"bad"})">${onTrack?"✓ On track":"⚠ Behind "+Math.abs(diff)+" kg"}</b></div>
    <div class="stat-row"><span>Adaptive targets</span><b>${T.kcal} kcal · ${T.protein}g protein</b></div>
    <div class="muted" style="margin-top:6px">Targets recalculate from your latest weight & time left — they tighten or relax automatically as you go.</div>`;
  drawWeightChart(); drawBars("kcal-chart","kcal",T.kcal); drawBars("protein-chart","p",T.protein,true);
}
function setupCanvas(id){
  const c=$(id), dpr=window.devicePixelRatio||1;
  const w=c.clientWidth||320, h=+c.getAttribute("height");
  c.width=w*dpr; c.height=h*dpr;
  const x=c.getContext("2d"); x.scale(dpr,dpr);
  x.clearRect(0,0,w,h);
  return {x,w,h};
}
function drawWeightChart(){
  const {x,w,h}=setupCanvas("weight-chart");
  const p=D.profile;
  const pts=D.weights.length?D.weights:[{date:p.startDate,kg:p.startWeight}];
  const start=fromKey(p.startDate), end=fromKey(p.targetDate);
  const allW=[...pts.map(q=>q.kg),p.startWeight,p.targetWeight];
  const minW=Math.min(...allW)-1, maxW=Math.max(...allW)+1;
  const X=d=>20+(fromKey(d)-start)/(end-start)*(w-40);
  const Y=v=>12+(maxW-v)/(maxW-minW)*(h-34);
  // grid + labels
  x.fillStyle="#8b949e"; x.font="10px sans-serif";
  for(let i=0;i<=3;i++){ const v=minW+(maxW-minW)*i/3;
    x.fillText(v.toFixed(1),2,Y(v)+3);
    x.strokeStyle="#2d333b"; x.beginPath(); x.moveTo(20,Y(v)); x.lineTo(w-8,Y(v)); x.stroke(); }
  // target path
  x.strokeStyle="#8b949e"; x.setLineDash([5,4]); x.beginPath();
  x.moveTo(X(p.startDate),Y(p.startWeight)); x.lineTo(X(p.targetDate),Y(p.targetWeight)); x.stroke();
  x.setLineDash([]);
  // actual
  x.strokeStyle="#4f8ef7"; x.lineWidth=2; x.beginPath();
  pts.forEach((q,i)=>{ const px=clamp(X(q.date),20,w-8);
    i?x.lineTo(px,Y(q.kg)):x.moveTo(px,Y(q.kg)); });
  x.stroke();
  x.fillStyle="#4f8ef7";
  pts.forEach(q=>{ const px=clamp(X(q.date),20,w-8);
    x.beginPath(); x.arc(px,Y(q.kg),3.5,0,7); x.fill(); });
}
function drawBars(id,fieldName,target,underBad){
  const {x,w,h}=setupCanvas(id);
  const days=[];
  for(let i=13;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i);
    const k=todayKey(d); days.push({k,v:dayTotals(k)[fieldName]||0}); }
  const maxV=Math.max(target*1.3,...days.map(d=>d.v));
  const bw=(w-30)/14;
  const ty=12+(maxV-target)/maxV*(h-30);
  days.forEach((d,i)=>{
    if(!d.v) return;
    const bh=d.v/maxV*(h-30);
    let col;
    if(underBad) col = d.v>=target*0.9?"#34d399":d.v>=target*0.6?"#fbbf24":"#f87171";
    else col = d.v<=target*1.02?"#34d399":d.v<=target*1.12?"#fbbf24":"#f87171";
    x.fillStyle=col;
    x.beginPath(); x.roundRect(18+i*bw+2,12+(h-30)-bh,bw-4,bh,3); x.fill();
  });
  x.strokeStyle="#e6edf3"; x.setLineDash([4,3]); x.beginPath();
  x.moveTo(16,ty); x.lineTo(w-6,ty); x.stroke(); x.setLineDash([]);
  x.fillStyle="#8b949e"; x.font="10px sans-serif";
  x.fillText(Math.round(target)+(underBad?"g":""),2,ty-3);
}

/* ---------- FOODS / PLAN ---------- */
function foodsTab(which){
  $("tab-plan").classList.toggle("active",which==="plan");
  $("tab-db").classList.toggle("active",which==="db");
  $("plan-editor").style.display=which==="plan"?"block":"none";
  $("db-editor").style.display=which==="db"?"block":"none";
}
function renderPlan(){
  let html="<p class='muted' style='margin:0 0 10px'>Your default day. 'Use plan' on the Today tab logs these in one tap. Edit freely.</p>";
  for(const s of SLOTS){
    const items=(D.plan[s.key]||[]);
    let rows="", kcal=0;
    items.forEach((pi,i)=>{
      const f=food(pi.foodId); if(!f) return;
      const m=itemMacros(f,pi.qty); kcal+=m.kcal;
      rows+=`<div class="slot-item"><span class="dot ${gradeOf(f)}"></span>
        <span class="i-name">${f.name} <span class="muted">${pi.qty}${f.unit==="g"?"g":"×"}</span></span>
        <span class="i-macro">${m.kcal} kcal · ${m.p}g P</span>
        <button class="del" onclick="delPlanItem('${s.key}',${i})">✕</button></div>`;
    });
    html+=`<div class="card"><div class="stat-row" style="margin-bottom:8px">
      <b>${s.name}</b><span class="muted">${kcal?kcal+" kcal":"empty (optional)"}</span></div>
      ${rows}<button class="btn small" style="margin-top:8px" onclick="openPicker('plan','${s.key}')">+ Add</button></div>`;
  }
  $("plan-editor").innerHTML=html;
}
function delPlanItem(slot,i){ D.plan[slot].splice(i,1); save(); renderPlan(); }

function renderDB(){
  const q=($("db-search").value||"").toLowerCase();
  const list=D.foods.filter(f=>f.name.toLowerCase().includes(q));
  $("db-list").innerHTML=list.map(f=>`
    <div class="food-row" onclick="editFood('${f.id}')">
      <span class="dot ${gradeOf(f)}"></span><span class="f-name">${f.name}</span>
      ${f.unit==="g"&&f.basis?`<span class="basis-tag">${f.basis}</span>`:""}
      <span class="f-info">${f.kcal} kcal / ${f.unit==="g"?"100g":UNITS[f.unit]}<br>${f.p}P ${f.c}C ${f.f}F</span>
    </div>`).join("");
}
function editFood(id){
  const f=id?food(id):{id:"",name:"",unit:"g",basis:"raw",kcal:0,p:0,c:0,f:0,fb:0,sg:0,caf:0};
  $("editfood-title").textContent=id?"Edit food":"New food";
  $("editfood-form").innerHTML=`
    <label>Name</label><input id="ef-name" value="${f.name}">
    <div class="grid2">
      <div><label>Unit</label><select id="ef-unit">
        ${Object.entries(UNITS).map(([k,v])=>`<option value="${k}" ${f.unit===k?"selected":""}>${v==="g"?"grams":v}</option>`).join("")}
      </select></div>
      <div><label>Weight basis (for grams)</label><select id="ef-basis">
        <option value="raw" ${f.basis==="raw"?"selected":""}>raw / uncooked</option>
        <option value="cooked" ${f.basis==="cooked"?"selected":""}>cooked</option>
      </select></div>
    </div>
    <p class="muted" style="margin:8px 0 0">Macros per <b>100 g</b> (if grams) or per <b>1 unit</b> otherwise.</p>
    <div class="grid2">
      <div><label>Calories</label><input id="ef-kcal" type="number" value="${f.kcal}"></div>
      <div><label>Protein g</label><input id="ef-p" type="number" step="0.1" value="${f.p}"></div>
      <div><label>Carbs g</label><input id="ef-c" type="number" step="0.1" value="${f.c}"></div>
      <div><label>Fat g</label><input id="ef-f" type="number" step="0.1" value="${f.f}"></div>
      <div><label>Fiber g</label><input id="ef-fb" type="number" step="0.1" value="${f.fb||0}"></div>
      <div><label>Sugar g</label><input id="ef-sg" type="number" step="0.1" value="${f.sg||0}"></div>
    </div>
    <label style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:14px;color:var(--text)">
      <input type="checkbox" id="ef-caf" style="width:auto" ${f.caf?"checked":""}> Contains caffeine (adds water target)</label>
    <button class="btn primary full" style="margin-top:14px" onclick="saveFood('${id||""}')">Save</button>
    ${id?`<button class="btn full warn" style="margin-top:8px" onclick="deleteFood('${id}')">Delete</button>`:""}
    <button class="btn full" style="margin-top:8px" onclick="closeModal('editfood-modal')">Cancel</button>`;
  openModal("editfood-modal");
}
function saveFood(id){
  const f={ id:id||("c"+Date.now()), name:$("ef-name").value.trim(),
    unit:$("ef-unit").value, basis:$("ef-unit").value==="g"?$("ef-basis").value:"",
    kcal:+$("ef-kcal").value||0, p:+$("ef-p").value||0, c:+$("ef-c").value||0,
    f:+$("ef-f").value||0, fb:+$("ef-fb").value||0, sg:+$("ef-sg").value||0,
    caf:$("ef-caf").checked?1:0 };
  if(!f.name){ toast("Name required"); return; }
  const i=D.foods.findIndex(x=>x.id===f.id);
  if(i>=0) D.foods[i]=f; else D.foods.push(f);
  save(); closeModal("editfood-modal"); renderDB(); toast("Saved ✓");
}
function deleteFood(id){
  D.foods=D.foods.filter(f=>f.id!==id);
  for(const s in D.plan) D.plan[s]=D.plan[s].filter(pi=>pi.foodId!==id);
  save(); closeModal("editfood-modal"); renderDB(); renderPlan();
}

/* ---------- PROFILE ---------- */
function renderProfile(){
  const p=D.profile||{gender:"male",age:25,heightCm:170,startWeight:70,
    targetWeight:65,activity:1.4,startDate:todayKey(),
    targetDate:todayKey(new Date(Date.now()+90*864e5))};
  $("profile-form").innerHTML=`
    <div class="card">
      <div class="grid2">
        <div><label>Gender</label><select id="pf-gender">
          <option value="male" ${p.gender==="male"?"selected":""}>Male</option>
          <option value="female" ${p.gender==="female"?"selected":""}>Female</option></select></div>
        <div><label>Age</label><input id="pf-age" type="number" value="${p.age}"></div>
        <div><label>Height (cm)</label><input id="pf-height" type="number" value="${p.heightCm}"></div>
        <div><label>Starting weight (kg)</label><input id="pf-weight" type="number" step="0.1" value="${p.startWeight}"></div>
        <div><label>Target weight (kg)</label><input id="pf-target" type="number" step="0.1" value="${p.targetWeight}"></div>
        <div><label>Target date</label><input id="pf-tdate" type="date" value="${p.targetDate}"></div>
      </div>
      <label>Activity level</label><select id="pf-activity">
        <option value="1.2" ${p.activity==1.2?"selected":""}>Sedentary (desk, no exercise)</option>
        <option value="1.4" ${p.activity==1.4?"selected":""}>Light (1–3 workouts/wk)</option>
        <option value="1.55" ${p.activity==1.55?"selected":""}>Moderate (3–5 workouts/wk)</option>
        <option value="1.7" ${p.activity==1.7?"selected":""}>Active (6–7 workouts/wk)</option></select>
      <button class="btn primary full" style="margin-top:14px" onclick="saveProfile()">Save profile</button>
    </div>
    <div class="card">
      <b>Data</b>
      <button class="btn full" style="margin-top:10px" onclick="exportData()">⬇︎ Export backup (JSON)</button>
      <button class="btn full" style="margin-top:8px" onclick="$('import-file').click()">⬆︎ Import backup</button>
      <input type="file" id="import-file" accept=".json" style="display:none" onchange="importData(this)">
      <button class="btn full warn" style="margin-top:8px" onclick="resetAll()">Reset everything</button>
    </div>`;
}
function saveProfile(){
  const first=!D.profile;
  D.profile={ gender:$("pf-gender").value, age:+$("pf-age").value,
    heightCm:+$("pf-height").value, startWeight:+$("pf-weight").value,
    targetWeight:+$("pf-target").value, targetDate:$("pf-tdate").value,
    activity:+$("pf-activity").value,
    startDate:(D.profile&&D.profile.startDate)||todayKey() };
  if(first && !D.weights.length) D.weights.push({date:todayKey(),kg:D.profile.startWeight});
  save(); toast("Profile saved ✓"); go("today");
}
function exportData(){
  const blob=new Blob([JSON.stringify(D,null,1)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob); a.download="fuel-backup-"+todayKey()+".json"; a.click();
}
function importData(inp){
  const file=inp.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=()=>{ try{ D=JSON.parse(r.result); save(); toast("Imported ✓"); go("today"); }
                 catch(e){ toast("Invalid file"); } };
  r.readAsText(file);
}
function resetAll(){
  if(!confirm("Delete ALL data?")) return;
  localStorage.removeItem("ft_data"); D=load(); go("profile");
}

/* ---------- CHAT (Coach) ---------- */
function renderChat(){
  $("chat-setup").style.display = D.apiKey ? "none" : "block";
  const log=$("chatlog");
  log.innerHTML=(D.chat||[]).map(m=>`<div class="msg ${m.role==="user"?"me":"ai"}">${escapeHtml(m.content)}</div>`).join("");
  log.scrollTop=log.scrollHeight;
}
function escapeHtml(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
function saveApiKey(){ D.apiKey=$("api-key-input").value.trim(); save(); renderChat();
  if(D.apiKey) toast("Coach enabled ✓"); }
function clearChat(){ D.chat=[]; save(); renderChat(); }
function coachContext(){
  const T=targets(), tot=dayTotals(todayKey()), p=D.profile, wt=waterTarget(todayKey());
  const last7=[];
  for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i);
    const k=todayKey(d), t=dayTotals(k);
    if(t.logged) last7.push(`${k}: ${Math.round(t.kcal)} kcal, ${t.p}g P`); }
  const planTxt=SLOTS.map(s=>{
    const items=(D.plan[s.key]||[]).map(pi=>{const f=food(pi.foodId);
      return f?`${f.name} ${pi.qty}${f.unit==="g"?"g":"x"}`:"";}).filter(Boolean).join(", ");
    return items?`${s.name}: ${items}`:null; }).filter(Boolean).join("\n");
  return `You are a concise nutrition coach inside the user's personal food tracker app.
User profile: ${p.gender}, ${p.age}y, ${p.heightCm}cm, current ${T.weight}kg, target ${p.targetWeight}kg by ${p.targetDate}.
Adaptive daily targets: ${T.kcal} kcal, ${T.protein}g protein, ${T.carbs}g carbs, ${T.fat}g fat, ${wt.glasses} glasses water (250ml).
Today so far: ${Math.round(tot.kcal)} kcal, ${tot.p}g protein, ${tot.c}g carbs, ${tot.f}g fat. Remaining: ${T.kcal-Math.round(tot.kcal)} kcal, ${Math.max(0,T.protein-tot.p).toFixed(0)}g protein.
Last 7 days:\n${last7.join("\n")||"nothing logged"}
User's default meal plan:\n${planTxt}
Food DB includes Indian staples; rice is tracked by COOKED weight, dals/meats by RAW weight.
Answer briefly and practically. Suggest concrete foods/quantities from their plan and remaining macros when relevant.`;
}
async function sendChat(){
  const txt=$("chat-text").value.trim();
  if(!txt) return;
  if(!D.apiKey){ toast("Add your API key first"); renderChat(); return; }
  if(!D.profile){ toast("Set up profile first"); return; }
  $("chat-text").value="";
  D.chat.push({role:"user",content:txt}); save(); renderChat();
  const log=$("chatlog");
  log.insertAdjacentHTML("beforeend",`<div class="msg ai" id="pending">…</div>`);
  try{
    const res=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{ "content-type":"application/json",
        "x-api-key":D.apiKey, "anthropic-version":"2023-06-01",
        "anthropic-dangerous-direct-browser-access":"true" },
      body:JSON.stringify({ model:"claude-sonnet-4-5", max_tokens:700,
        system:coachContext(),
        messages:D.chat.slice(-12).map(m=>({role:m.role,content:m.content})) })
    });
    const j=await res.json();
    const reply=j.content&&j.content[0]?j.content[0].text:(j.error?`Error: ${j.error.message}`:"No reply");
    D.chat.push({role:"assistant",content:reply});
    if(D.chat.length>40) D.chat=D.chat.slice(-40);
    save();
  }catch(e){ D.chat.push({role:"assistant",content:"Network error: "+e.message}); save(); }
  renderChat();
}
$("chat-text")?.addEventListener("keydown",e=>{
  if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendChat(); }});

/* ---------- Apple Health via Shortcuts ---------- */
function syncHealth(){
  const tot=dayTotals(viewDate), d=day(viewDate);
  const w=D.weights.find(x=>x.date===viewDate);
  const payload={ date:viewDate, kcal:Math.round(tot.kcal), protein:r1(tot.p),
    carbs:r1(tot.c), fat:r1(tot.f), waterMl:(d.water||0)*250,
    weightKg:w?w.kg:null };
  const txt=JSON.stringify(payload);
  const done=()=>{ location.href="shortcuts://run-shortcut?name="+encodeURIComponent("Fuel Sync"); };
  if(navigator.clipboard&&navigator.clipboard.writeText)
    navigator.clipboard.writeText(txt).then(done,()=>{ prompt("Copy this:",txt); });
  else prompt("Copy this:",txt);
}

/* ---------- boot ---------- */
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
if(!D.profile){ go("profile"); toast("Welcome! Set up your profile."); }
else renderToday();
