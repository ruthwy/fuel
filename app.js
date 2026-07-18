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

const UNITS = { g:"g", ml:"ml", pc:"piece", cup:"cup", tbsp:"tbsp", tsp:"tsp", scoop:"scoop" };

/* ---------- starter food DB ----------
   unit 'g'  -> macros are per 100 g, `basis` says cooked/raw weight
   other units -> macros are per 1 unit                                */
const STARTER_FOODS = [
 {id:"rice",    name:"White rice",            unit:"g", basis:"cooked", kcal:130,p:2.7,c:28,f:0.3,fb:0.4,sg:0},
 {id:"brice",   name:"Brown rice",            unit:"g", basis:"cooked", kcal:112,p:2.3,c:24,f:0.8,fb:1.8,sg:0},
 {id:"roti",    name:"Roti / chapati (40g)",  unit:"pc",basis:"",       kcal:120,p:3,c:18,f:3.5,fb:2,sg:0},
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
 {id:"chbr",    name:"Chicken breast (raw)",  unit:"g", basis:"raw",    kcal:120,p:22.5,c:0,f:2.6,fb:0,sg:0},
 {id:"chbrc",   name:"Chicken breast (cooked)",unit:"g",basis:"cooked", kcal:165,p:31,c:0,f:3.6,fb:0,sg:0},
 {id:"moongc",  name:"Moong dal (cooked)",    unit:"g", basis:"cooked", kcal:116,p:8,c:16,f:0.4,fb:3,sg:0},
 {id:"soy",     name:"Soy chunks (dry)",      unit:"g", basis:"raw",    kcal:345,p:52,c:33,f:0.5,fb:13,sg:0},
 {id:"toast",   name:"Whole wheat toast",     unit:"pc",basis:"",       kcal:66,p:2,c:11,f:1,fb:1.5,sg:1},
 {id:"mvego",   name:"Mixed veg + 1 tsp oil", unit:"g", basis:"cooked", kcal:85,p:2,c:8,f:4.5,fb:2.5,sg:2},
 {id:"mveg",    name:"Mixed vegetables (plain)",unit:"g",basis:"cooked",kcal:40,p:2,c:6,f:0.5,fb:2.5,sg:2},
 {id:"chcur",   name:"Chicken curry",         unit:"g", basis:"cooked", kcal:150,p:14,c:4,f:8,fb:0.5,sg:1},
 {id:"egg",     name:"Egg (whole)",           unit:"pc",basis:"",       kcal:72,p:6.3,c:0.4,f:4.8,fb:0,sg:0},
 {id:"eggw",    name:"Egg white",             unit:"pc",basis:"",       kcal:17,p:3.6,c:0.2,f:0.1,fb:0,sg:0},
 {id:"fish",    name:"Fish (rohu/tilapia)",   unit:"g", basis:"raw",    kcal:96,p:20,c:0,f:1.7,fb:0,sg:0},
 {id:"paneer",  name:"Paneer",                unit:"g", basis:"raw",    kcal:265,p:18,c:3.5,f:20,fb:0,sg:2},
 {id:"curd",    name:"Curd / dahi",           unit:"g", basis:"raw",    kcal:60,p:3.5,c:4.7,f:3.3,fb:0,sg:4.7},
 {id:"milk",    name:"Milk (toned)",          unit:"ml",basis:"",       kcal:58,p:3.2,c:4.8,f:2.1,fb:0,sg:4.8},
 {id:"whey",    name:"Whey protein",          unit:"g", basis:"raw",    kcal:400,p:80,c:10,f:5,fb:0,sg:6},
 {id:"pnut",    name:"Peanuts",               unit:"g", basis:"raw",    kcal:567,p:26,c:16,f:49,fb:8.5,sg:4},
 {id:"almond",  name:"Almonds",               unit:"g", basis:"raw",    kcal:579,p:21,c:22,f:50,fb:12.5,sg:4},
 {id:"pb",      name:"Peanut butter",         unit:"tbsp",basis:"",     kcal:94,p:4,c:3,f:8,fb:0.8,sg:1.5},
 {id:"ghee",    name:"Ghee",                  unit:"tsp",basis:"",      kcal:45,p:0,c:0,f:5,fb:0,sg:0},
 {id:"banana",  name:"Banana",                unit:"g", basis:"raw",    kcal:89,p:1.1,c:23,f:0.3,fb:2.6,sg:12},
 {id:"apple",   name:"Apple",                 unit:"g", basis:"raw",    kcal:52,p:0.3,c:14,f:0.2,fb:2.4,sg:10},
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
 /* --- Indian dishes (cooked, per 100g unless per-piece) --- */
 {id:"upmac",   name:"Upma (cooked)",         unit:"g", basis:"cooked", kcal:85,p:2.5,c:12,f:3,fb:1,sg:0.5},
 {id:"pohac",   name:"Poha (cooked)",         unit:"g", basis:"cooked", kcal:110,p:2,c:20,f:2.5,fb:1,sg:0.5},
 {id:"mdosa",   name:"Masala dosa",           unit:"pc",basis:"",       kcal:350,p:6,c:45,f:15,fb:3,sg:2},
 {id:"uttapam", name:"Uttapam",               unit:"pc",basis:"",       kcal:200,p:5,c:30,f:6,fb:2,sg:1},
 {id:"vada",    name:"Medu vada",             unit:"pc",basis:"",       kcal:145,p:3.5,c:12,f:9,fb:1.5,sg:0.5},
 {id:"poori",   name:"Poori",                 unit:"pc",basis:"",       kcal:150,p:2,c:15,f:9,fb:0.8,sg:0},
 {id:"paratha", name:"Paratha (plain)",       unit:"pc",basis:"",       kcal:250,p:5,c:30,f:12,fb:2.5,sg:0.5},
 {id:"rasam",   name:"Rasam",                 unit:"g", basis:"cooked", kcal:25,p:1,c:4,f:0.5,fb:0.5,sg:1},
 {id:"curdrice",name:"Curd rice",             unit:"g", basis:"cooked", kcal:95,p:2.5,c:13,f:3.5,fb:0.3,sg:1.5},
 {id:"lemrice", name:"Lemon rice",            unit:"g", basis:"cooked", kcal:140,p:2.5,c:22,f:4.5,fb:0.8,sg:0.5},
 {id:"pulao",   name:"Veg pulao",             unit:"g", basis:"cooked", kcal:145,p:3,c:22,f:4.5,fb:1.5,sg:1},
 {id:"vbiryani",name:"Veg biryani",           unit:"g", basis:"cooked", kcal:140,p:3,c:22,f:4.5,fb:1.5,sg:1},
 {id:"khichdi", name:"Khichdi",               unit:"g", basis:"cooked", kcal:100,p:4,c:16,f:2,fb:2,sg:0.5},
 {id:"daltad",  name:"Dal tadka (cooked)",    unit:"g", basis:"cooked", kcal:120,p:5,c:12,f:5.5,fb:2.5,sg:1},
 {id:"dalplain",name:"Dal plain (cooked)",    unit:"g", basis:"cooked", kcal:105,p:6,c:15,f:2,fb:3,sg:0.5},
 {id:"chole",   name:"Chole (cooked)",        unit:"g", basis:"cooked", kcal:150,p:7,c:18,f:5.5,fb:5,sg:2},
 {id:"rajmac",  name:"Rajma (cooked)",        unit:"g", basis:"cooked", kcal:130,p:7,c:17,f:3.5,fb:6,sg:1},
 {id:"palakp",  name:"Palak paneer",          unit:"g", basis:"cooked", kcal:145,p:7,c:5,f:11,fb:2,sg:2},
 {id:"pbm",     name:"Paneer butter masala",  unit:"g", basis:"cooked", kcal:200,p:7,c:8,f:16,fb:1.5,sg:4},
 {id:"chtikka", name:"Chicken tikka",         unit:"g", basis:"cooked", kcal:150,p:22,c:3,f:5.5,fb:0.5,sg:1},
 {id:"tandoori",name:"Tandoori chicken",      unit:"g", basis:"cooked", kcal:150,p:20,c:3,f:6.5,fb:0.5,sg:1},
 {id:"butterch",name:"Butter chicken",        unit:"g", basis:"cooked", kcal:200,p:13,c:6,f:14,fb:0.8,sg:3},
 {id:"eggcurry",name:"Egg curry",             unit:"g", basis:"cooked", kcal:130,p:8,c:4,f:9,fb:0.8,sg:2},
 {id:"bhurji",  name:"Egg bhurji",            unit:"g", basis:"cooked", kcal:160,p:10,c:3,f:12,fb:0.5,sg:1},
 {id:"fishcur", name:"Fish curry",            unit:"g", basis:"cooked", kcal:120,p:13,c:4,f:6,fb:0.5,sg:1},
 {id:"muttoncur",name:"Mutton curry",         unit:"g", basis:"cooked", kcal:175,p:16,c:3,f:11,fb:0.5,sg:1},
 {id:"dhokla",  name:"Dhokla",                unit:"g", basis:"cooked", kcal:160,p:6,c:22,f:5,fb:2,sg:3},
 {id:"samosa",  name:"Samosa",                unit:"pc",basis:"",       kcal:260,p:4,c:28,f:15,fb:2,sg:1.5},
 {id:"pakora",  name:"Pakora",                unit:"g", basis:"cooked", kcal:300,p:7,c:28,f:18,fb:3,sg:2},
 {id:"gulab",   name:"Gulab jamun",           unit:"pc",basis:"",       kcal:150,p:2,c:22,f:6,fb:0.3,sg:16},
 {id:"jalebi",  name:"Jalebi",                unit:"g", basis:"cooked", kcal:400,p:2,c:70,f:12,fb:0.2,sg:40},
 {id:"kheer",   name:"Kheer",                 unit:"g", basis:"cooked", kcal:130,p:3.5,c:20,f:4,fb:0.2,sg:14},
 {id:"halwa",   name:"Sooji halwa",           unit:"g", basis:"cooked", kcal:320,p:4,c:45,f:14,fb:1,sg:25},
 /* --- proteins --- */
 {id:"tofu",    name:"Tofu",                  unit:"g", basis:"raw",    kcal:76,p:8,c:2,f:4.5,fb:0.4,sg:0.5},
 {id:"sprouts", name:"Moong sprouts",         unit:"g", basis:"raw",    kcal:30,p:3,c:6,f:0.2,fb:1.8,sg:2},
 {id:"gyog",    name:"Greek yogurt",          unit:"g", basis:"raw",    kcal:60,p:10,c:3.5,f:0.5,fb:0,sg:3.5},
 {id:"chthigh", name:"Chicken thigh (raw)",   unit:"g", basis:"raw",    kcal:145,p:19,c:0,f:8,fb:0,sg:0},
 {id:"prawns",  name:"Prawns (raw)",          unit:"g", basis:"raw",    kcal:85,p:18,c:0,f:1,fb:0,sg:0},
 {id:"mutton",  name:"Mutton (raw)",          unit:"g", basis:"raw",    kcal:200,p:17,c:0,f:15,fb:0,sg:0},
 {id:"protbar", name:"Protein bar",           unit:"pc",basis:"",       kcal:200,p:20,c:20,f:7,fb:3,sg:10},
 /* --- grains & flours (dry/raw) --- */
 {id:"atta",    name:"Wheat atta (dry)",      unit:"g", basis:"raw",    kcal:340,p:12,c:72,f:1.7,fb:11,sg:0},
 {id:"riceraw", name:"White rice (dry)",      unit:"g", basis:"raw",    kcal:360,p:6.6,c:79,f:0.6,fb:1,sg:0},
 {id:"quinoa",  name:"Quinoa (dry)",          unit:"g", basis:"raw",    kcal:368,p:14,c:64,f:6,fb:7,sg:0},
 {id:"ragi",    name:"Ragi / millet (dry)",   unit:"g", basis:"raw",    kcal:328,p:7.3,c:72,f:1.3,fb:11,sg:0.6},
 {id:"vermi",   name:"Vermicelli (dry)",      unit:"g", basis:"raw",    kcal:350,p:8,c:78,f:0.5,fb:2,sg:0},
 {id:"bbread",  name:"Brown bread",           unit:"pc",basis:"",       kcal:70,p:2.6,c:12,f:1,fb:1.5,sg:1.5},
 {id:"cflakes", name:"Corn flakes",           unit:"g", basis:"raw",    kcal:380,p:7,c:84,f:0.5,fb:3,sg:8},
 {id:"muesli",  name:"Muesli",                unit:"g", basis:"raw",    kcal:400,p:9,c:66,f:10,fb:7,sg:15},
 /* --- fruits (per 100g) --- */
 {id:"mango",   name:"Mango",                 unit:"g", basis:"raw",    kcal:60,p:0.8,c:15,f:0.4,fb:1.6,sg:13.7},
 {id:"orange",  name:"Orange",                unit:"g", basis:"raw",    kcal:47,p:0.9,c:12,f:0.1,fb:2.4,sg:9},
 {id:"grapes",  name:"Grapes",                unit:"g", basis:"raw",    kcal:69,p:0.7,c:18,f:0.2,fb:0.9,sg:16},
 {id:"papaya",  name:"Papaya",                unit:"g", basis:"raw",    kcal:43,p:0.5,c:11,f:0.3,fb:1.7,sg:8},
 {id:"wmelon",  name:"Watermelon",            unit:"g", basis:"raw",    kcal:30,p:0.6,c:8,f:0.2,fb:0.4,sg:6},
 {id:"pomeg",   name:"Pomegranate",           unit:"g", basis:"raw",    kcal:83,p:1.7,c:19,f:1.2,fb:4,sg:14},
 {id:"guava",   name:"Guava",                 unit:"g", basis:"raw",    kcal:68,p:2.6,c:14,f:1,fb:5.4,sg:9},
 /* --- vegetables (raw, per 100g) --- */
 {id:"potato",  name:"Potato",                unit:"g", basis:"raw",    kcal:77,p:2,c:17,f:0.1,fb:2.2,sg:0.8},
 {id:"onion",   name:"Onion",                 unit:"g", basis:"raw",    kcal:40,p:1.1,c:9,f:0.1,fb:1.7,sg:4.2},
 {id:"tomato",  name:"Tomato",                unit:"g", basis:"raw",    kcal:18,p:0.9,c:3.9,f:0.2,fb:1.2,sg:2.6},
 {id:"carrot",  name:"Carrot",                unit:"g", basis:"raw",    kcal:41,p:0.9,c:10,f:0.2,fb:2.8,sg:4.7},
 {id:"cucumber",name:"Cucumber",              unit:"g", basis:"raw",    kcal:15,p:0.7,c:3.6,f:0.1,fb:0.5,sg:1.7},
 {id:"spinach", name:"Spinach / palak",       unit:"g", basis:"raw",    kcal:23,p:2.9,c:3.6,f:0.4,fb:2.2,sg:0.4},
 {id:"broccoli",name:"Broccoli",              unit:"g", basis:"raw",    kcal:34,p:2.8,c:7,f:0.4,fb:2.6,sg:1.7},
 {id:"bhindi",  name:"Bhindi / okra",         unit:"g", basis:"raw",    kcal:33,p:1.9,c:7.5,f:0.2,fb:3.2,sg:1.5},
 {id:"cauli",   name:"Cauliflower",           unit:"g", basis:"raw",    kcal:25,p:1.9,c:5,f:0.3,fb:2,sg:1.9},
 {id:"capsicum",name:"Capsicum",              unit:"g", basis:"raw",    kcal:20,p:0.9,c:4.6,f:0.2,fb:1.7,sg:2.4},
 {id:"beetroot",name:"Beetroot",              unit:"g", basis:"raw",    kcal:43,p:1.6,c:10,f:0.2,fb:2.8,sg:6.8},
 /* --- dairy, fats, nuts, misc --- */
 {id:"fcmilk",  name:"Milk (whole / full cream)",unit:"ml",basis:"",    kcal:65,p:3.3,c:4.8,f:3.5,fb:0,sg:4.8},
 {id:"bmilk",   name:"Buttermilk / chaas",    unit:"ml",basis:"",       kcal:15,p:0.8,c:1.5,f:0.5,fb:0,sg:1.5},
 {id:"wcream",  name:"Whipping cream (heavy)",unit:"ml",basis:"",       kcal:340,p:2,c:3,f:36,fb:0,sg:3},
 {id:"soymilk", name:"Soy milk",              unit:"ml",basis:"",       kcal:40,p:3.3,c:1.8,f:1.8,fb:0.4,sg:1},
 {id:"almmilk", name:"Almond milk",           unit:"ml",basis:"",       kcal:17,p:0.6,c:0.7,f:1.3,fb:0.3,sg:0.4},
 {id:"lassi",   name:"Sweet lassi",           unit:"ml",basis:"",       kcal:100,p:2.6,c:13,f:3,fb:0,sg:12},
 {id:"condmilk",name:"Condensed milk",        unit:"tbsp",basis:"",     kcal:62,p:1.5,c:10.4,f:1.7,fb:0,sg:10.4},
 {id:"cheese",  name:"Cheese slice",          unit:"pc",basis:"",       kcal:60,p:3.5,c:1,f:4.5,fb:0,sg:0.5},
 {id:"butter",  name:"Butter",                unit:"tsp",basis:"",      kcal:36,p:0,c:0,f:4,fb:0,sg:0},
 {id:"oil",     name:"Cooking oil",           unit:"tsp",basis:"",      kcal:40,p:0,c:0,f:4.5,fb:0,sg:0},
 {id:"cashew",  name:"Cashews",               unit:"g", basis:"raw",    kcal:553,p:18,c:30,f:44,fb:3.3,sg:6},
 {id:"walnut",  name:"Walnuts",               unit:"g", basis:"raw",    kcal:654,p:15,c:14,f:65,fb:6.7,sg:2.6},
 {id:"raisins", name:"Raisins",               unit:"g", basis:"raw",    kcal:299,p:3,c:79,f:0.5,fb:3.7,sg:59},
 {id:"dates",   name:"Dates",                 unit:"pc",basis:"",       kcal:23,p:0.2,c:6,f:0,fb:0.6,sg:5},
 {id:"honey",   name:"Honey",                 unit:"tsp",basis:"",      kcal:21,p:0,c:5.8,f:0,fb:0,sg:5.7},
 {id:"sugar",   name:"Sugar",                 unit:"tsp",basis:"",      kcal:16,p:0,c:4,f:0,fb:0,sg:4},
 {id:"jaggery", name:"Jaggery",               unit:"tsp",basis:"",      kcal:19,p:0,c:5,f:0,fb:0,sg:4.7},
 {id:"ketchup", name:"Ketchup",               unit:"tbsp",basis:"",     kcal:17,p:0.2,c:4.5,f:0,fb:0.1,sg:3.7},
 {id:"mayo",    name:"Mayonnaise",            unit:"tbsp",basis:"",     kcal:90,p:0.1,c:0.6,f:10,fb:0,sg:0.5},
 {id:"maggi",   name:"Maggi (1 pack)",        unit:"pc",basis:"",       kcal:280,p:6,c:40,f:11,fb:1.5,sg:1.5},
 {id:"softdrink",name:"Soft drink / cola",    unit:"ml",basis:"",       kcal:42,p:0,c:10.6,f:0,fb:0,sg:10.6},
 {id:"juice",   name:"Fruit juice (packaged)",unit:"ml",basis:"",       kcal:44,p:0.4,c:10.4,f:0.1,fb:0.2,sg:8.8},
 {id:"cocwater",name:"Coconut water",         unit:"ml",basis:"",       kcal:18,p:0.2,c:3.6,f:0.1,fb:0,sg:3.6},
 /* --- more dishes & extras --- */
 {id:"chkeema", name:"Chicken keema",         unit:"g", basis:"cooked", kcal:180,p:17,c:3,f:11,fb:0.5,sg:1},
 {id:"chilli_ch",name:"Chilli chicken",       unit:"g", basis:"cooked", kcal:190,p:16,c:8,f:10,fb:0.8,sg:3},
 {id:"friedch", name:"Fried chicken",         unit:"g", basis:"cooked", kcal:290,p:17,c:8,f:20,fb:0.5,sg:0.5},
 {id:"omelette",name:"Omelette (2 eggs + oil)",unit:"pc",basis:"",      kcal:220,p:13,c:2,f:17,fb:0.3,sg:1},
 {id:"briceraw",name:"Brown rice (dry)",      unit:"g", basis:"raw",    kcal:370,p:7.5,c:77,f:2.9,fb:3.5,sg:0},
 {id:"fries",   name:"French fries",          unit:"g", basis:"cooked", kcal:310,p:3.4,c:40,f:15,fb:3.8,sg:0.3},
 {id:"icecream",name:"Ice cream",             unit:"g", basis:"raw",    kcal:210,p:3.5,c:24,f:11,fb:0.5,sg:21},
 {id:"chocolate",name:"Chocolate (milk)",     unit:"g", basis:"raw",    kcal:545,p:5,c:60,f:31,fb:2,sg:52},
 {id:"chips",   name:"Potato chips",          unit:"g", basis:"raw",    kcal:540,p:7,c:50,f:35,fb:3.5,sg:0.5},
];

/* days: JS weekday numbers (0=Sun … 6=Sat) */
function DEFAULT_PLANS(){ return JSON.parse(JSON.stringify([
 { id:"nvrest", name:"Non-veg · Rest", days:[5,0],
   slots:{ pre:[],
     bf:[{foodId:"egg",qty:3},{foodId:"eggw",qty:1},{foodId:"toast",qty:1}],
     mid:[{foodId:"whey",qty:30},{foodId:"almond",qty:10}],
     lunch:[{foodId:"chbrc",qty:120},{foodId:"brice",qty:90},{foodId:"moongc",qty:100},{foodId:"mvego",qty:100},{foodId:"roti",qty:1}],
     eve:[{foodId:"curd",qty:150},{foodId:"apple",qty:100}],
     night:[{foodId:"chbrc",qty:100},{foodId:"roti",qty:1},{foodId:"mveg",qty:150}] } },
 { id:"vwork", name:"Veg · Workout", days:[1],
   slots:{ pre:[],
     bf:[{foodId:"whey",qty:30},{foodId:"milk",qty:200},{foodId:"banana",qty:100}],
     mid:[{foodId:"whey",qty:20},{foodId:"toast",qty:1}],
     lunch:[{foodId:"soy",qty:70},{foodId:"moongc",qty:150},{foodId:"brice",qty:100},{foodId:"mvego",qty:100}],
     eve:[{foodId:"curd",qty:150},{foodId:"apple",qty:100},{foodId:"whey",qty:15}],
     night:[{foodId:"paneer",qty:60},{foodId:"roti",qty:1},{foodId:"mveg",qty:100}] } },
 { id:"nvwork", name:"Non-veg · Workout", days:[3,4],
   slots:{ pre:[],
     bf:[{foodId:"egg",qty:3},{foodId:"eggw",qty:2},{foodId:"toast",qty:1}],
     mid:[{foodId:"whey",qty:30},{foodId:"banana",qty:100}],
     lunch:[{foodId:"chbrc",qty:130},{foodId:"brice",qty:130},{foodId:"moongc",qty:100},{foodId:"mvego",qty:100}],
     eve:[{foodId:"curd",qty:150},{foodId:"almond",qty:15}],
     night:[{foodId:"chbrc",qty:100},{foodId:"roti",qty:1},{foodId:"mveg",qty:150}] } },
 { id:"vrest", name:"Veg · Rest", days:[2,6],
   slots:{ pre:[],
     bf:[{foodId:"whey",qty:30},{foodId:"milk",qty:200},{foodId:"banana",qty:80}],
     mid:[{foodId:"toast",qty:1},{foodId:"pb",qty:1}],
     lunch:[{foodId:"soy",qty:60},{foodId:"moongc",qty:150},{foodId:"brice",qty:80},{foodId:"mvego",qty:100}],
     eve:[{foodId:"curd",qty:150},{foodId:"apple",qty:100},{foodId:"whey",qty:15}],
     night:[{foodId:"paneer",qty:60},{foodId:"roti",qty:1},{foodId:"mveg",qty:100}] } },
])); }

const IC={
  plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M4.5 12.5l5 5L19.5 7"/></svg>',
  search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M15.8 15.8L20.5 20.5"/></svg>',
};

/* ---------- state ---------- */
let D = load();
let viewDate = todayKey();
let pickCtx = null;   // {target:'slot'|'plan', slot}
let pickedFood = null;

function migrate(d){
  if(!d.v || d.v < 2){
    const custom=(d.foods||[]).filter(f=>String(f.id).startsWith("c"));
    d.foods=STARTER_FOODS.slice().concat(custom);
    d.plans=DEFAULT_PLANS();
    delete d.plan;
    d.v=2;
  }
  if(d.v < 3){ // merge expanded food DB, keep user's existing/custom entries
    const have=new Set((d.foods||[]).map(f=>f.id));
    for(const f of STARTER_FOODS) if(!have.has(f.id)) d.foods.push(f);
    d.v=3;
  }
  if(d.v < 4){ // liquids: cups → ml. Update defs, scale plan quantities.
    const cupMl={milk:200,fcmilk:200,bmilk:200,softdrink:250,juice:250,cocwater:250};
    for(const nf of STARTER_FOODS){
      const i=d.foods.findIndex(f=>f.id===nf.id);
      if(i>=0 && cupMl[nf.id]!==undefined) d.foods[i]=nf;
    }
    const have4=new Set(d.foods.map(f=>f.id));
    for(const f of STARTER_FOODS) if(!have4.has(f.id)) d.foods.push(f);
    for(const pl of (d.plans||[])) for(const s in (pl.slots||{}))
      for(const pi of pl.slots[s]) if(cupMl[pi.foodId] && pi.qty<20) pi.qty=pi.qty*cupMl[pi.foodId];
    d.v=4;
  }
  return d;
}
function load(){
  try{
    const raw = localStorage.getItem("ft_data");
    if(raw) return migrate(JSON.parse(raw));
  }catch(e){}
  return { v:2, profile:null, weights:[], foods:STARTER_FOODS.slice(),
           plans:DEFAULT_PLANS(), days:{}, chat:[], apiKey:"" };
}
function planForDate(k){
  const wd=fromKey(k||viewDate).getDay();
  return D.plans.find(p=>(p.days||[]).includes(wd)) || D.plans[0];
}
function save(){ localStorage.setItem("ft_data", JSON.stringify(D)); }

/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
function todayKey(d){ const t = d||new Date();
  return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0"); }
function fromKey(k){ const [y,m,d]=k.split("-").map(Number); return new Date(y,m-1,d); }
function clamp(x,a,b){ return Math.min(b,Math.max(a,x)); }
function r1(x){ return Math.round(x*10)/10; }
function toast(msg){ const t=$("toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("show"),2200); }
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
  const mult = (f.unit==="g"||f.unit==="ml") ? qty/100 : qty;
  return { kcal:Math.round(f.kcal*mult), p:r1(f.p*mult), c:r1(f.c*mult),
           f:r1(f.f*mult), fb:r1((f.fb||0)*mult), sg:r1((f.sg||0)*mult),
           caf:(f.caf?qty:0) };
}
function qtyText(f,qty){
  if(f.unit==="g") return qty+"g"+(f.basis?" "+f.basis:"");
  if(f.unit==="ml") return qty+"ml";
  return qty+" "+(UNITS[f.unit]||f.unit)+(qty>1?"s":"");
}
function qtyLabel(f){
  if(f.unit==="g") return f.basis==="cooked" ? "Grams (COOKED weight)"
                 : f.basis==="raw" ? "Grams (RAW / uncooked weight)" : "Grams";
  if(f.unit==="ml") return "Milliliters (ml)";
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
  let tdee = bmr * p.activity;
  // Health-driven mode: real measured energy instead of activity multiplier
  const hd = (D.days[todayKey()]||{}).health;
  if(p.useHealthEnergy && hd && hd.activeKcal!=null){
    tdee = (hd.restingKcal!=null ? hd.restingKcal : bmr*1.25) + hd.activeKcal;
  }
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
  const act = (d&&d.health&&d.health.activeKcal) ? Math.floor(d.health.activeKcal/500) : 0;
  const bonus = Math.ceil(caf*200/250) + act;
  const base = Math.ceil(baseMl/250);
  return { glasses:base+bonus, base, bonus, cafBonus:Math.ceil(caf*200/250), actBonus:act };
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
  if(page==="foods") { renderPrep(); renderPlan(); renderDB(); }
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
    const wtr=waterTarget(viewDate), drank=day(viewDate).water||0;
    // Apple Fitness-style concentric rings: calories / protein / water
    const ringDefs=[
      {pct:tot.kcal/Math.max(1,T.kcal),      color:"var(--ring1)"},
      {pct:tot.p/Math.max(1,T.protein),      color:"var(--good)"},
      {pct:drank/Math.max(1,wtr.glasses),    color:"var(--water)"},
    ];
    const radii=[52,40,28];
    let ringsSvg=`<svg class="rings" viewBox="0 0 120 120">`;
    ringDefs.forEach((d,i)=>{
      const r=radii[i], C=(2*Math.PI*r).toFixed(1);
      ringsSvg+=`<circle cx="60" cy="60" r="${r}" fill="none" stroke="${d.color}" stroke-opacity="0.15" stroke-width="10"/>
        <circle class="ring" cx="60" cy="60" r="${r}" fill="none" stroke="${d.color}" stroke-width="10"
          stroke-linecap="round" transform="rotate(-90 60 60)"
          stroke-dasharray="${C}" stroke-dashoffset="${C}"
          data-off="${(C*(1-Math.min(1,d.pct))).toFixed(1)}"/>`;
    });
    ringsSvg+=`</svg>`;
    html+=`<div class="summary-top">${ringsSvg}
      <div class="summary-legend">
        <div class="leg-row"><span class="leg-dot" style="background:var(--ring1)"></span>
          <div><div class="leg-val">${Math.round(tot.kcal)}<small> / ${T.kcal} kcal</small></div>
          <div class="leg-name">Calories · ${Math.max(0,T.kcal-Math.round(tot.kcal))} left</div></div></div>
        <div class="leg-row"><span class="leg-dot" style="background:var(--good)"></span>
          <div><div class="leg-val">${r1(tot.p)}<small> / ${T.protein} g</small></div>
          <div class="leg-name">Protein</div></div></div>
        <div class="leg-row"><span class="leg-dot" style="background:var(--water)"></span>
          <div><div class="leg-val">${(drank*0.25).toFixed(2)}<small> / ${(wtr.glasses*0.25).toFixed(2)} L</small></div>
          <div class="leg-name">Water</div></div></div>
      </div></div>`;
    for(const [name,val,tar,overBad] of [["Carbs",r1(tot.c),T.carbs,true],["Fat",r1(tot.f),T.fat,true]]){
      const pct=clamp(val/Math.max(1,tar)*100,0,100);
      html+=`<div class="stat-row"><span>${name}</span><b>${val} / ${tar} g</b></div>
             <div class="bar"><div class="${barClass(val,tar,overBad)}" style="width:0%" data-w="${pct.toFixed(1)}"></div></div>`;
    }
    html+=`<div class="stat-row muted"><span>Fiber ${r1(tot.fb)} g · Sugar ${r1(tot.sg)} g</span></div>`;
    const hd=day(viewDate).health;
    if(hd) html+=`<div class="stat-row muted" style="margin-top:6px">
      <span>Health: ${hd.steps!=null?hd.steps.toLocaleString()+" steps":""}${hd.activeKcal!=null?" · "+Math.round(hd.activeKcal)+" active kcal":""}</span>
      <span>${D.profile.useHealthEnergy?"driving targets":""}</span></div>`;
  }
  $("summary-card").innerHTML=html;

  // slots
  let sh=`<div class="muted" style="margin:2px 2px 8px">Today's plan: <b style="color:var(--text)">${planForDate(viewDate).name}</b></div>`;
  for(const s of SLOTS){
    const sd=slotData(viewDate,s.key);
    const kcal=sd.items.reduce((a,i)=>a+i.kcal,0);
    const done=sd.items.length>0, skipped=sd.skipped&&!done;
    const plItems=((planForDate(viewDate).slots||{})[s.key]||[]);
    const planKcal=plItems.reduce((a,pi)=>{const f=food(pi.foodId);
      return f?a+itemMacros(f,pi.qty).kcal:a;},0);
    const showPlan=!done&&plItems.length>0;
    const check = done?`<div class="check done"><svg viewBox="0 0 24 24"><path d="M4.5 12.5l5 5L19.5 7"/></svg></div>`
                : skipped?`<div class="check skip"></div>`:`<div class="check"></div>`;
    let body="";
    if(showPlan){
      // COOK VIEW — what to weigh & cook, weights front and center
      body=`<div class="cook-label">Planned · weigh &amp; cook</div>`;
      for(const pi of plItems){
        const f=food(pi.foodId); if(!f) continue;
        const m=itemMacros(f,pi.qty);
        body+=`<div class="slot-item"><span class="dot ${gradeOf(f)}"></span>
          <span class="i-name">${f.name}</span>
          <span class="i-qty">${qtyText(f,pi.qty)}</span>
          <span class="i-macro" style="min-width:56px">${m.kcal} kcal</span></div>`;
      }
      body+=`<div class="slot-actions">
        <button class="btn good" onclick="usePlan('${s.key}')">${IC.check}Log all</button>
        <button class="btn" onclick="openPicker('slot','${s.key}')">${IC.plus}Add</button>
        <button class="btn" onclick="toggleSkip('${s.key}')">${skipped?"Unskip":"Skip"}</button>
      </div>`;
    }else{
      for(let i=0;i<sd.items.length;i++){
        const it=sd.items[i];
        body+=`<div class="slot-item"><span class="dot ${it.grade}"></span>
          <span class="i-name">${it.name} <span class="muted">${it.qty}${it.unit==="g"?"g":"×"}</span></span>
          <span class="i-macro">${it.kcal} kcal · ${it.p}g P</span>
          <button class="del" onclick="delItem(event,'${s.key}',${i})">✕</button></div>`;
      }
      body+=`<div class="slot-actions">
        <button class="btn" onclick="openPicker('slot','${s.key}')">${IC.plus}Add food</button>
        <button class="btn" onclick="toggleSkip('${s.key}')">${skipped?"Unskip":"Skip"}</button>
      </div>`;
    }
    const headStat = done ? kcal+" kcal"
                   : skipped ? "skipped"
                   : plItems.length ? "~"+planKcal+" kcal" : "";
    const openCls = (showPlan&&!skipped) ? " open" : "";
    sh+=`<div class="slot${openCls}" id="slot-${s.key}">
      <div class="slot-head" onclick="toggleSlot('${s.key}')">
        ${check}<span class="s-name">${s.name}</span>
        <span class="s-kcal">${headStat}</span>
        <svg class="chev" viewBox="0 0 24 24"><path d="M9 5.5l7 6.5-7 6.5"/></svg>
      </div>
      <div class="slot-body"><div class="sb-in">${body}</div></div></div>`;
  }
  $("slots").innerHTML=sh;

  // water
  const wt=waterTarget(viewDate), drankW=day(viewDate).water||0;
  let wg="";
  for(let i=0;i<wt.glasses;i++){
    const L=(i+1)*0.25;
    const lbl=(L%1===0)? L+"L" : String(L).replace(/^0/,"");
    wg+=`<div class="glass ${i<drankW?"full":""} ${i>=wt.base?"bonus":""}" onclick="tapGlass(${i})"><span>${lbl}</span></div>`;
  }
  $("water-card").innerHTML=`
    <div class="stat-row"><span style="color:var(--water);font-weight:600">Water</span>
    <b id="water-count">${(drankW*0.25).toFixed(2)} / ${(wt.glasses*0.25).toFixed(2)} L</b></div>
    <div class="muted">${wt.bonus?[wt.cafBonus?`+${wt.cafBonus} for caffeine`:"",wt.actBonus?`+${wt.actBonus} for activity`:""].filter(Boolean).join(" · "):"Base target from your weight"}</div>
    <div class="water-glasses" id="water-glasses">${wg}</div>`;
  animateProgress();
}
function animateProgress(){
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.querySelectorAll("#summary-card .bar > div[data-w]")
      .forEach(el=>el.style.width=el.dataset.w+"%");
    document.querySelectorAll("#summary-card .ring")
      .forEach(el=>el.setAttribute("stroke-dashoffset",el.dataset.off));
  }));
}
function toggleSlot(key){ $("slot-"+key).classList.toggle("open"); }
function toggleSkip(key){ const sd=slotData(viewDate,key); sd.skipped=!sd.skipped; save(); renderToday(); keepOpen(key); }
function keepOpen(key){ const el=$("slot-"+key); if(el) el.classList.add("open"); }
function delItem(ev,slot,idx){ ev.stopPropagation();
  slotData(viewDate,slot).items.splice(idx,1); save(); renderToday(); keepOpen(slot); }
function usePlan(slot){
  const sd=slotData(viewDate,slot);
  for(const pi of ((planForDate(viewDate).slots||{})[slot]||[])){
    const f=food(pi.foodId); if(!f) continue;
    const m=itemMacros(f,pi.qty);
    sd.items.push({foodId:f.id,name:f.name,qty:pi.qty,unit:f.unit,grade:gradeOf(f),...m});
  }
  sd.skipped=false; save(); renderToday(); keepOpen(slot);
  toast(planForDate(viewDate).name+" plan logged ✓");
}
function tapGlass(i){
  // patch DOM in place so fills animate instead of re-rendering everything
  const d=day(viewDate);
  d.water = (d.water===i+1) ? i : i+1;
  save();
  const wt=waterTarget(viewDate), drank=d.water||0;
  document.querySelectorAll("#water-glasses .glass")
    .forEach((g,idx)=>g.classList.toggle("full",idx<drank));
  const wc=$("water-count");
  if(wc) wc.textContent=(drank*0.25).toFixed(2)+" / "+(wt.glasses*0.25).toFixed(2)+" L";
  const rings=document.querySelectorAll("#summary-card .ring");
  if(rings[2]){ const C=2*Math.PI*28;
    rings[2].setAttribute("stroke-dashoffset",
      (C*(1-Math.min(1,drank/Math.max(1,wt.glasses)))).toFixed(1)); }
  const legs=document.querySelectorAll("#summary-card .leg-val");
  if(legs[2]) legs[2].innerHTML=(drank*0.25).toFixed(2)+"<small> / "+(wt.glasses*0.25).toFixed(2)+" L</small>";
}

/* ---------- food picker ---------- */
function openPicker(target,slot,planId){
  pickCtx={target,slot,planId}; pickedFood=null;
  $("food-search").value=""; $("qty-section").style.display="none";
  $("food-modal-title").textContent = target==="plan" ? "Add to plan — "+SLOTS.find(s=>s.key===slot).name
                                                      : "Add food — "+SLOTS.find(s=>s.key===slot).name;
  renderFoodPicker(); openModal("food-modal");
}
function renderFoodPicker(){
  const q=$("food-search").value.toLowerCase();
  const list=D.foods.filter(f=>f.name.toLowerCase().includes(q))
    .sort((a,b)=>a.name.localeCompare(b.name));
  $("food-picker").innerHTML=list.map(f=>`
    <div class="food-row" onclick="pickFood('${f.id}')">
      <span class="dot ${gradeOf(f)}"></span><span class="f-name">${f.name}</span>
      ${f.unit==="g"&&f.basis?`<span class="basis-tag">${f.basis}</span>`:""}
      <span class="f-info">${f.kcal} kcal / ${f.unit==="g"?"100g":f.unit==="ml"?"100ml":UNITS[f.unit]}<br>${f.p}g P</span>
    </div>`).join("") || "<p class='muted'>No match. Add it in Foods → database.</p>";
}
function pickFood(id){
  pickedFood=food(id);
  $("qty-section").style.display="block";
  $("qty-label").textContent=qtyLabel(pickedFood);
  $("qty-input").value = (pickedFood.unit==="g"||pickedFood.unit==="ml") ? 100 : 1;
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
    const pl=D.plans.find(p=>p.id===pickCtx.planId);
    if(!pl.slots[pickCtx.slot]) pl.slots[pickCtx.slot]=[];
    pl.slots[pickCtx.slot].push({foodId:pickedFood.id,qty:q});
    save(); closeModal("food-modal"); renderPlan(); toast("Added to "+pl.name);
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
  renderEnergy();
  drawWeightChart(); drawBars("kcal-chart","kcal",T.kcal); drawBars("protein-chart","p",T.protein,true);
}
/* ---------- energy balance: how resting / active / food drive fat loss ---------- */
function renderEnergy(){
  const p=D.profile; if(!p) return;
  const w=latestWeight();
  const bmrEst=Math.round(10*w + 6.25*p.heightCm - 5*p.age + (p.gender==="male"?5:-161));
  let n=0,sumRest=0,sumAct=0,sumSteps=0,stepN=0,sumIn=0,inN=0,sumDef=0,defN=0,healthDays=0,restReal=0;
  for(let i=13;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const k=todayKey(d), dd=D.days[k]||{}, hd=dd.health, tot=dayTotals(k);
    if(hd) healthDays++;
    const rest=(hd&&hd.restingKcal!=null)?hd.restingKcal:bmrEst;
    if(hd&&hd.restingKcal!=null) restReal++;
    const act=(hd&&hd.activeKcal!=null)?hd.activeKcal:null;
    if(act==null && !tot.logged) continue;
    const out=rest+(act||0);
    n++; sumRest+=rest; sumAct+=(act||0);
    if(hd&&hd.steps!=null){ sumSteps+=hd.steps; stepN++; }
    if(tot.logged){ sumIn+=tot.kcal; inN++; sumDef+=out-tot.kcal; defN++; }
  }
  const el=$("energy-card");
  if(!healthDays){
    el.innerHTML=`<b>Energy balance</b>
      <p class="muted" style="margin:8px 0 12px">Import Apple Health (steps, active + resting energy) to see exactly what's driving your fat loss — and which lever to pull.</p>
      <button class="btn full" onclick="importHealth()">Import from Health</button>`;
    return;
  }
  const rest=Math.round(sumRest/Math.max(1,n)), act=Math.round(sumAct/Math.max(1,n));
  const out=rest+act, eaten=inN?Math.round(sumIn/inN):null;
  const deficit=defN?Math.round(sumDef/defN):null;
  const steps=stepN?Math.round(sumSteps/stepN):null;
  const restPct=Math.round(rest*100/Math.max(1,out)), actPct=100-restPct;
  const maxScale=Math.max(out,eaten||0,1);
  const kgWk=deficit!=null?deficit*7/7700:null;
  el.innerHTML=`
    <div class="stat-row"><b>Energy balance · fat-loss drivers</b><span class="muted">14-day avg</span></div>
    <div class="stat-row" style="margin-top:12px"><span>Burned</span><b>${out} kcal/day</b></div>
    <div class="ebar">
      <div class="seg" style="width:${(rest/maxScale*100).toFixed(1)}%;background:var(--accent)"></div>
      <div class="seg" style="width:${(act/maxScale*100).toFixed(1)}%;background:var(--good)"></div>
    </div>
    <div class="stat-row"><span>Eaten</span><b>${eaten!=null?eaten+" kcal/day":"— log food to compare"}</b></div>
    <div class="ebar"><div class="seg" style="width:${eaten!=null?(eaten/maxScale*100).toFixed(1):0}%;background:var(--ring1)"></div></div>
    <div class="slot-item"><span class="dot" style="background:var(--accent)"></span>
      <span class="i-name">Resting energy${restReal?"":" (estimated)"}
        <div class="muted" style="font-size:11px">idle burn — grows with muscle, shrinks as you lose weight</div></span>
      <span class="i-macro">${rest} kcal<br>${restPct}% of burn</span></div>
    <div class="slot-item"><span class="dot" style="background:var(--good)"></span>
      <span class="i-name">Active energy
        <div class="muted" style="font-size:11px">${steps!=null?"~"+steps.toLocaleString()+" steps/day · ":""}your most controllable lever</div></span>
      <span class="i-macro">${act} kcal<br>${actPct}% of burn</span></div>
    ${deficit!=null?`<div class="slot-item"><span class="dot ${deficit>0?"g":"b"}"></span>
      <span class="i-name">Daily ${deficit>0?"deficit":"surplus"}
        <div class="muted" style="font-size:11px">burned − eaten · this is what actually moves the scale</div></span>
      <span class="i-macro"><b style="color:var(--${deficit>0?"good":"bad"})">${deficit>0?"−":"+"}${Math.abs(deficit)} kcal</b><br>≈ ${Math.abs(kgWk).toFixed(2)} kg/wk ${deficit>0?"loss":"gain"}</span></div>`:""}
    <p class="muted" style="margin:10px 0 0">Rules of thumb: +1,000 steps/day ≈ 35 kcal ≈ 0.25 kg extra loss over 2 months. A steady 500 kcal deficit ≈ 0.45 kg/week.</p>`;
}
function cssVar(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
function hexA(hex,a){
  hex=hex.trim();
  if(hex.startsWith("rgba")) return hex.replace(/[\d.]+\)$/,a+")");
  if(hex.startsWith("rgb")) return hex.replace("rgb(","rgba(").replace(")",","+a+")");
  const n=parseInt(hex.slice(1),16), r=n>>16&255, g=n>>8&255, b=n&255;
  return `rgba(${r},${g},${b},${a})`;
}
function svgSmooth(pts){ // Catmull-Rom → cubic bezier path string
  if(!pts.length) return "";
  let d="M"+pts[0].x.toFixed(1)+" "+pts[0].y.toFixed(1);
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[Math.max(0,i-1)], p1=pts[i], p2=pts[i+1], p3=pts[Math.min(pts.length-1,i+2)];
    d+=" C"+(p1.x+(p2.x-p0.x)/6).toFixed(1)+" "+(p1.y+(p2.y-p0.y)/6).toFixed(1)
      +" "+(p2.x-(p3.x-p1.x)/6).toFixed(1)+" "+(p2.y-(p3.y-p1.y)/6).toFixed(1)
      +" "+p2.x.toFixed(1)+" "+p2.y.toFixed(1);
  }
  return d;
}
function drawWeightChart(){
  const p=D.profile;
  const raw=D.weights.length?D.weights:[{date:p.startDate,kg:p.startWeight}];
  const W=360,H=210,L=34,R=12,T=14,B=24;
  const start=fromKey(p.startDate), end=fromKey(p.targetDate);
  const allW=[...raw.map(q=>q.kg),p.startWeight,p.targetWeight];
  const minW=Math.min(...allW)-0.8, maxW=Math.max(...allW)+0.8;
  const X=d=>L+clamp((fromKey(d)-start)/(end-start),0,1)*(W-L-R);
  const Y=v=>T+(maxW-v)/(maxW-minW)*(H-T-B);
  const pts=raw.map(q=>({x:X(q.date),y:Y(q.kg)}));
  let grid="";
  for(let i=0;i<=3;i++){
    const v=minW+(maxW-minW)*(3-i)/3, gy=Y(v).toFixed(1);
    grid+=`<line x1="${L}" y1="${gy}" x2="${W-R}" y2="${gy}" stroke="var(--hairline)"/>
           <text x="4" y="${(+gy+3).toFixed(1)}">${v.toFixed(1)}</text>`;
  }
  const line=svgSmooth(pts);
  const area=pts.length>1
    ? line+` L${pts[pts.length-1].x.toFixed(1)} ${H-B} L${pts[0].x.toFixed(1)} ${H-B} Z` : "";
  const lp=pts[pts.length-1];
  $("weight-chart").innerHTML=`
  <svg viewBox="0 0 ${W} ${H}">
    <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="var(--accent)" stop-opacity="0.28"/>
      <stop offset="1" stop-color="var(--accent)" stop-opacity="0"/>
    </linearGradient></defs>
    ${grid}
    <line x1="${X(p.startDate).toFixed(1)}" y1="${Y(p.startWeight).toFixed(1)}"
      x2="${X(p.targetDate).toFixed(1)}" y2="${Y(p.targetWeight).toFixed(1)}"
      stroke="var(--dim)" stroke-width="1.5" stroke-dasharray="4 5" opacity="0.55"/>
    ${area?`<path class="warea" d="${area}" fill="url(#wg)"/>`:""}
    ${pts.length>1?`<path class="wline" d="${line}" fill="none" stroke="var(--accent)"
      stroke-width="2.5" stroke-linecap="round" pathLength="1"/>`:""}
    <g class="wdot">
      <circle cx="${lp.x.toFixed(1)}" cy="${lp.y.toFixed(1)}" r="9" fill="var(--accent)" opacity="0.18"/>
      <circle cx="${lp.x.toFixed(1)}" cy="${lp.y.toFixed(1)}" r="4.5" fill="var(--accent)"/>
      <circle cx="${lp.x.toFixed(1)}" cy="${lp.y.toFixed(1)}" r="2" fill="var(--card)"/>
    </g>
  </svg>`;
}
function drawBars(id,fieldName,target,underBad){
  const W=360,H=175,L=16,R=10,T=14,B=26;
  const days=[];
  for(let i=13;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i);
    const k=todayKey(d);
    days.push({v:dayTotals(k)[fieldName]||0,wd:"SMTWTFS"[fromKey(k).getDay()],today:i===0}); }
  const maxV=Math.max(target*1.3,...days.map(d=>d.v));
  const areaH=H-T-B, bw=(W-L-R)/14, capW=Math.min(bw-7,13), rad=capW/2;
  const ty=(T+(maxV-target)/maxV*areaH).toFixed(1);
  let bars="";
  days.forEach((d,i)=>{
    const cx=L+i*bw+bw/2;
    bars+=`<rect x="${(cx-capW/2).toFixed(1)}" y="${T}" width="${capW}" height="${areaH}" rx="${rad}" fill="var(--card2)"/>
      <text x="${cx.toFixed(1)}" y="${H-9}" text-anchor="middle"${d.today?' style="fill:var(--text);font-weight:800"':""}>${d.wd}</text>`;
    if(!d.v) return;
    let col;
    if(underBad) col = d.v>=target*0.9?"var(--good)":d.v>=target*0.6?"var(--ok)":"var(--bad)";
    else col = d.v<=target*1.02?"var(--good)":d.v<=target*1.12?"var(--ok)":"var(--bad)";
    const bh=Math.max(capW,d.v/maxV*areaH);
    bars+=`<rect class="bar-v" style="animation-delay:${(i*0.03).toFixed(2)}s"
      x="${(cx-capW/2).toFixed(1)}" y="${(T+areaH-bh).toFixed(1)}"
      width="${capW}" height="${bh.toFixed(1)}" rx="${rad}" fill="${col}"/>`;
  });
  const lbl=Math.round(target)+(underBad?"g":"");
  $(id).innerHTML=`<svg viewBox="0 0 ${W} ${H}">
    ${bars}
    <line x1="${L-4}" y1="${ty}" x2="${W-R}" y2="${ty}" stroke="var(--text)" opacity="0.55"
      stroke-width="1.2" stroke-dasharray="3 4"/>
    <rect x="${L-4}" y="${(+ty-16).toFixed(1)}" width="${lbl.length*6+12}" height="13" rx="6.5" fill="var(--card2)"/>
    <text x="${L+2}" y="${(+ty-6).toFixed(1)}">${lbl}</text>
  </svg>`;
}

/* ---------- FOODS / PLAN ---------- */
function foodsTab(which){
  const tabs={prep:"prep-list", plan:"plan-editor", db:"db-editor"};
  for(const t in tabs){
    $("tab-"+t).classList.toggle("active",t===which);
    $(tabs[t]).style.display=t===which?"block":"none";
  }
}
/* ---------- day prep list: everything to get ready for today ---------- */
function renderPrep(){
  const pl=planForDate(todayKey());
  const agg={};
  for(const s of SLOTS) for(const pi of ((pl.slots||{})[s.key]||[])){
    const f=food(pi.foodId); if(!f) continue;
    if(!agg[f.id]) agg[f.id]={f,qty:0,slots:[],p:0,kcal:0};
    const m=itemMacros(f,pi.qty);
    agg[f.id].qty+=pi.qty; agg[f.id].p+=m.p; agg[f.id].kcal+=m.kcal;
    agg[f.id].slots.push(SLOTS.find(x=>x.key===s.key).name);
  }
  const items=Object.values(agg);
  const isProt=a=>(a.f.p*4*100/Math.max(1,a.f.kcal)>=25)||a.p>=8;
  const prot=items.filter(isProt).sort((a,b)=>b.p-a.p);
  const rest=items.filter(a=>!isProt(a)).sort((a,b)=>b.kcal-a.kcal);
  const totP=r1(items.reduce((x,a)=>x+a.p,0));
  const totK=Math.round(items.reduce((x,a)=>x+a.kcal,0));
  const row=a=>`<div class="slot-item"><span class="dot ${gradeOf(a.f)}"></span>
    <span class="i-name">${a.f.name}
      <div class="muted" style="font-size:11px">${[...new Set(a.slots)].join(" · ")}</div></span>
    <span class="i-qty">${qtyText(a.f,r1(a.qty))}</span>
    <span class="i-macro" style="min-width:64px">${r1(a.p)}g P<br>${a.kcal} kcal</span></div>`;
  $("prep-list").innerHTML=`
    <div class="card">
      <div class="stat-row"><b>Today · ${pl.name}</b>
        <span class="muted">${totK} kcal · ${totP}g protein</span></div>
      <div class="muted">Combined across all meals — weigh out or thaw these once, cook through the day.</div>
    </div>
    <div class="section-title">Protein — get these ready</div>
    <div class="card">${prot.map(row).join("")||"<p class='muted'>Nothing planned.</p>"}</div>
    <div class="section-title">Carbs, veg &amp; others</div>
    <div class="card">${rest.map(row).join("")||"<p class='muted'>Nothing planned.</p>"}</div>`;
}
let selPlanId=null;
const WD=["Su","Mo","Tu","We","Th","Fr","Sa"];
function selPlan(){ return D.plans.find(p=>p.id===selPlanId)||D.plans[0]; }
function renderPlan(){
  if(!selPlanId||!D.plans.find(p=>p.id===selPlanId)) selPlanId=D.plans[0].id;
  const pl=selPlan();
  // plan tabs
  let html=`<div class="pill-row">`+
    D.plans.map(p=>`<button class="pill ${p.id===pl.id?"active":""}" onclick="switchPlan('${p.id}')">${p.name}</button>`).join("")+
    `<button class="pill" onclick="addPlan()">＋ New</button></div>`;
  // totals
  let tk=0,tp=0;
  for(const s of SLOTS) for(const pi of (pl.slots[s.key]||[])){
    const f=food(pi.foodId); if(!f) continue;
    const m=itemMacros(f,pi.qty); tk+=m.kcal; tp+=m.p;
  }
  // name + day assignment
  html+=`<div class="card">
    <label>Plan name</label><input value="${pl.name}" onchange="renamePlan(this.value)">
    <label>Days this plan applies (tap to toggle — a day moves here from its old plan)</label>
    <div style="display:flex;gap:6px;margin-top:4px">`+
    WD.map((w,i)=>`<button class="pill ${pl.days.includes(i)?"active":""}" style="padding:7px 0;flex:1;text-align:center" onclick="toggleDay(${i})">${w}</button>`).join("")+
    `</div>
    <div class="stat-row" style="margin-top:12px"><span>Plan total</span><b>${tk} kcal · ${r1(tp)}g protein</b></div>
    ${D.plans.length>1?`<button class="btn small warn" style="margin-top:8px" onclick="deletePlan()">Delete this plan</button>`:""}
  </div>`;
  // slots
  for(const s of SLOTS){
    const items=(pl.slots[s.key]||[]);
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
      ${rows}<button class="btn small" style="margin-top:8px" onclick="openPicker('plan','${s.key}','${pl.id}')">${IC.plus}Add</button></div>`;
  }
  html+=`<button class="btn full warn" onclick="resetPlans()">Reset all plans to defaults</button>`;
  $("plan-editor").innerHTML=html;
}
function resetPlans(){
  if(!confirm("Restore the 4 default meal plans? Your plan edits will be lost (logged days are untouched).")) return;
  D.plans=DEFAULT_PLANS(); selPlanId=null; save(); renderPlan(); toast("Plans reset ✓");
}
function switchPlan(id){ selPlanId=id; renderPlan(); }
function renamePlan(v){ if(v.trim()){ selPlan().name=v.trim(); save(); renderPlan(); } }
function toggleDay(i){
  const pl=selPlan();
  if(pl.days.includes(i)) pl.days=pl.days.filter(d=>d!==i);
  else{ for(const p of D.plans) p.days=(p.days||[]).filter(d=>d!==i); pl.days.push(i); }
  save(); renderPlan();
}
function addPlan(){
  const id="p"+Date.now();
  D.plans.push({id, name:"New plan", days:[],
    slots:{pre:[],bf:[],mid:[],lunch:[],eve:[],night:[]}});
  selPlanId=id; save(); renderPlan();
}
function deletePlan(){
  if(!confirm("Delete plan '"+selPlan().name+"'?")) return;
  D.plans=D.plans.filter(p=>p.id!==selPlanId);
  selPlanId=D.plans[0].id; save(); renderPlan();
}
function delPlanItem(slot,i){ selPlan().slots[slot].splice(i,1); save(); renderPlan(); }

function renderDB(){
  const q=($("db-search").value||"").toLowerCase();
  const list=D.foods.filter(f=>f.name.toLowerCase().includes(q))
    .sort((a,b)=>a.name.localeCompare(b.name));
  $("db-list").innerHTML=list.map(f=>`
    <div class="food-row" onclick="editFood('${f.id}')">
      <span class="dot ${gradeOf(f)}"></span><span class="f-name">${f.name}</span>
      ${f.unit==="g"&&f.basis?`<span class="basis-tag">${f.basis}</span>`:""}
      <span class="f-info">${f.kcal} kcal / ${f.unit==="g"?"100g":f.unit==="ml"?"100ml":UNITS[f.unit]}<br>${f.p}P ${f.c}C ${f.f}F</span>
    </div>`).join("");
}
function editFood(id){
  const f=id?food(id):{id:"",name:"",unit:"g",basis:"raw",kcal:0,p:0,c:0,f:0,fb:0,sg:0,caf:0};
  $("editfood-title").textContent=id?"Edit food":"New food";
  $("editfood-form").innerHTML=`
    <label>Name</label><input id="ef-name" value="${f.name}">
    <button class="btn small" style="margin-top:10px" onclick="usdaLookup()">${IC.search}Look up nutrition (USDA)</button>
    <div id="usda-results"></div>
    <div class="grid2">
      <div><label>Unit</label><select id="ef-unit" onchange="efUnitChanged()">
        ${Object.entries(UNITS).map(([k,v])=>`<option value="${k}" ${f.unit===k?"selected":""}>${v==="g"?"grams":v}</option>`).join("")}
      </select></div>
      <div><label>Base quantity</label><input id="ef-per" type="number" inputmode="decimal" step="0.5"
        value="${(f.unit==="g"||f.unit==="ml")?100:1}" onchange="efPerChanged()"></div>
    </div>
    <label>Weight basis (for grams)</label><select id="ef-basis">
      <option value="raw" ${f.basis==="raw"?"selected":""}>raw / uncooked</option>
      <option value="cooked" ${f.basis==="cooked"?"selected":""}>cooked</option>
    </select>
    <p class="muted" style="margin:8px 0 0">Macros below are for <b>base quantity × unit</b> (e.g. 1 tbsp, 100 g). Change unit or base and the numbers auto-convert (g ↔ ml ↔ tsp ↔ tbsp ↔ cup).</p>
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
  _efPrev={unit:f.unit, per:(f.unit==="g"||f.unit==="ml")?100:1};
  openModal("editfood-modal");
}
/* --- unit-aware macro conversion (volume equivalents in ml; g assumed ≈ ml) --- */
const ML_EQ={g:1, ml:1, tsp:5, tbsp:15, cup:250};
let _efPrev={unit:"g", per:100};
const EF_FIELDS=["ef-kcal","ef-p","ef-c","ef-f","ef-fb","ef-sg"];
function efConvert(newUnit,newPer){
  const o=_efPrev;
  if(ML_EQ[o.unit]&&ML_EQ[newUnit]&&o.per>0&&newPer>0){
    const fac=(ML_EQ[newUnit]*newPer)/(ML_EQ[o.unit]*o.per);
    for(const id of EF_FIELDS){
      const el=$(id), v=(parseFloat(el.value)||0)*fac;
      el.value=id==="ef-kcal"?Math.round(v):Math.round(v*10)/10;
    }
    toast("Macros converted ✓");
  }
  _efPrev={unit:newUnit, per:newPer};
}
function efUnitChanged(){
  const u=$("ef-unit").value;
  const p=(u==="g"||u==="ml")?100:1;
  $("ef-per").value=p;
  efConvert(u,p);
}
function efPerChanged(){
  efConvert($("ef-unit").value, parseFloat($("ef-per").value)||1);
}
/* ---------- USDA FoodData Central lookup ---------- */
let _usda=[];
function nutrVal(food,names,unit){
  for(const name of names){
    const n=(food.foodNutrients||[]).find(x=>x.nutrientName===name&&(!unit||x.unitName===unit));
    if(n&&n.value!=null) return Math.round(n.value*10)/10;
  }
  return 0;
}
async function usdaLookup(){
  const q=$("ef-name").value.trim();
  if(!q){ toast("Type a food name first"); return; }
  const box=$("usda-results");
  box.innerHTML=`<p class="muted" style="margin:10px 0 0">Searching USDA…</p>`;
  try{
    const key=D.fdcKey||"DEMO_KEY";
    const res=await fetch("https://api.nal.usda.gov/fdc/v1/foods/search?api_key="+encodeURIComponent(key)
      +"&pageSize=8&query="+encodeURIComponent(q));
    if(res.status===429) throw new Error("rate");
    const j=await res.json();
    _usda=(j.foods||[]).slice(0,8);
    if(!_usda.length){ box.innerHTML=`<p class="muted" style="margin:10px 0 0">No USDA match — enter values manually.</p>`; return; }
    box.innerHTML=`<div class="food-list" style="max-height:30vh;margin:10px 0 0">`+
      _usda.map((f,i)=>`<div class="food-row" onclick="applyUsda(${i})">
        <span class="f-name">${f.description}${f.brandName?` <span class="muted">· ${f.brandName}</span>`:""}</span>
        <span class="f-info">${nutrVal(f,["Energy"],"KCAL")} kcal<br>${nutrVal(f,["Protein"])}g P /100g</span>
      </div>`).join("")+`</div>
      <p class="muted" style="margin:8px 0 0">Values are per 100 g (lab-verified, USDA).</p>`;
  }catch(e){
    box.innerHTML=`<p class="muted" style="margin:10px 0 0">${e.message==="rate"
      ?"Lookup temporarily rate-limited — try again in a bit."
      :"Lookup failed (offline?). Enter values manually."}</p>`;
  }
}
function applyUsda(i){
  const f=_usda[i]; if(!f) return;
  $("ef-unit").value="g"; $("ef-per").value=100; _efPrev={unit:"g",per:100};
  $("ef-kcal").value=nutrVal(f,["Energy"],"KCAL");
  $("ef-p").value=nutrVal(f,["Protein"]);
  $("ef-c").value=nutrVal(f,["Carbohydrate, by difference"]);
  $("ef-f").value=nutrVal(f,["Total lipid (fat)"]);
  $("ef-fb").value=nutrVal(f,["Fiber, total dietary"]);
  $("ef-sg").value=nutrVal(f,["Sugars, total including NLEA","Total Sugars","Sugars, Total"]);
  $("usda-results").innerHTML=`<p class="muted" style="margin:8px 0 0">Applied: ${f.description} (per 100 g). Set the raw/cooked basis below.</p>`;
  toast("Nutrition filled ✓");
}
function saveFood(id){
  const unit=$("ef-unit").value;
  // normalize entered macros (per base-qty) to canonical storage (per 100 g/ml, or per 1 unit)
  const canonical=(unit==="g"||unit==="ml")?100:1;
  const per=parseFloat($("ef-per").value)||canonical;
  const k=canonical/per;
  const f={ id:id||("c"+Date.now()), name:$("ef-name").value.trim(),
    unit, basis:unit==="g"?$("ef-basis").value:"",
    kcal:Math.round((+$("ef-kcal").value||0)*k),
    p:r1((+$("ef-p").value||0)*k), c:r1((+$("ef-c").value||0)*k),
    f:r1((+$("ef-f").value||0)*k), fb:r1((+$("ef-fb").value||0)*k),
    sg:r1((+$("ef-sg").value||0)*k),
    caf:$("ef-caf").checked?1:0 };
  if(!f.name){ toast("Name required"); return; }
  const i=D.foods.findIndex(x=>x.id===f.id);
  if(i>=0) D.foods[i]=f; else D.foods.push(f);
  save(); closeModal("editfood-modal"); renderDB(); toast("Saved ✓");
}
function deleteFood(id){
  D.foods=D.foods.filter(f=>f.id!==id);
  for(const pl of D.plans) for(const s in pl.slots)
    pl.slots[s]=pl.slots[s].filter(pi=>pi.foodId!==id);
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
      <label style="display:flex;align-items:center;gap:8px;margin-top:14px;font-size:14px;color:var(--text)">
        <input type="checkbox" id="pf-health" style="width:auto" ${p.useHealthEnergy?"checked":""}>
        Use Apple Health active energy for calorie targets (import daily; ignores activity level)</label>
      <button class="btn primary full" style="margin-top:14px" onclick="saveProfile()">Save profile</button>
    </div>
    <div class="card">
      <b>Data</b>
      <button class="btn full" style="margin-top:10px" onclick="exportData()">Export backup (JSON)</button>
      <button class="btn full" style="margin-top:8px" onclick="$('import-file').click()">Import backup</button>
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
    useHealthEnergy:$("pf-health").checked,
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
function renderChat(animLast){
  $("chat-setup").style.display = D.apiKey ? "none" : "block";
  const log=$("chatlog"), msgs=D.chat||[];
  log.innerHTML=msgs.map((m,i)=>
    `<div class="msg ${m.role==="user"?"me":"ai"}${animLast&&i===msgs.length-1?" anim":""}">${escapeHtml(m.content)}</div>`).join("");
  window.scrollTo(0,document.body.scrollHeight);
}
// auto-grow the chat textarea
$("chat-text")?.addEventListener("input",function(){
  this.style.height="46px";
  this.style.height=Math.min(120,this.scrollHeight)+"px";
});
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
  const tp=planForDate(todayKey());
  const planTxt=`Today is a "${tp.name}" day.\n`+SLOTS.map(s=>{
    const items=((tp.slots||{})[s.key]||[]).map(pi=>{const f=food(pi.foodId);
      return f?`${f.name} ${pi.qty}${f.unit==="g"?"g":"x"}`:"";}).filter(Boolean).join(", ");
    return items?`${s.name}: ${items}`:null; }).filter(Boolean).join("\n")+
    `\nOther plans: ${D.plans.map(p=>p.name).join(", ")} (auto-assigned by weekday).`;
  return `You are a concise nutrition coach inside the user's personal food tracker app.
User profile: ${p.gender}, ${p.age}y, ${p.heightCm}cm, current ${T.weight}kg, target ${p.targetWeight}kg by ${p.targetDate}.
Adaptive daily targets: ${T.kcal} kcal, ${T.protein}g protein, ${T.carbs}g carbs, ${T.fat}g fat, ${wt.glasses} glasses water (250ml).
Today so far: ${Math.round(tot.kcal)} kcal, ${tot.p}g protein, ${tot.c}g carbs, ${tot.f}g fat. Remaining: ${T.kcal-Math.round(tot.kcal)} kcal, ${Math.max(0,T.protein-tot.p).toFixed(0)}g protein.
Last 7 days:\n${last7.join("\n")||"nothing logged"}
User's default meal plan:\n${planTxt}
Food DB includes Indian staples; rice is tracked by COOKED weight, dals/meats by RAW weight.
Answer briefly and practically. Suggest concrete foods/quantities from their plan and remaining macros when relevant.`;
}
let _sending=false;
async function sendChat(){
  const txt=$("chat-text").value.trim();
  if(!txt||_sending) return;
  if(!D.apiKey){ toast("Add your API key first"); renderChat(); return; }
  if(!D.profile){ toast("Set up profile first"); return; }
  _sending=true;
  const ta=$("chat-text"); ta.value=""; ta.style.height="46px";
  D.chat.push({role:"user",content:txt}); save();
  const log=$("chatlog");
  log.insertAdjacentHTML("beforeend",
    `<div class="msg me anim">${escapeHtml(txt)}</div>
     <div class="msg ai anim typing" id="pending"><span></span><span></span><span></span></div>`);
  log.scrollIntoView(false); window.scrollTo(0,document.body.scrollHeight);
  try{
    const res=await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{ "content-type":"application/json",
        "authorization":"Bearer "+D.apiKey },
      body:JSON.stringify({ model:"gpt-4o-mini", max_tokens:700,
        messages:[{role:"system",content:coachContext()},
          ...D.chat.slice(-12).map(m=>({role:m.role,content:m.content}))] })
    });
    const j=await res.json();
    const reply=j.choices&&j.choices[0]?j.choices[0].message.content:(j.error?`Error: ${j.error.message}`:"No reply");
    D.chat.push({role:"assistant",content:reply});
    if(D.chat.length>40) D.chat=D.chat.slice(-40);
    save();
  }catch(e){ D.chat.push({role:"assistant",content:"Network error: "+e.message}); save(); }
  _sending=false;
  renderChat(true);
}
$("chat-text")?.addEventListener("keydown",e=>{
  if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendChat(); }});

/* ---------- Apple Health via Shortcuts ---------- */
function cleanNum(v){ // "70 kg" → 70, "12,400" → 12400
  if(v==null) return null;
  const n=parseFloat(String(v).replace(/,/g,"").replace(/[^\d.\-]/g,""));
  return isNaN(n)?null:n;
}
function applyHealthData(h){
  const k = h.date || todayKey();
  const d = day(k);
  d.health = d.health || {};
  const steps=cleanNum(h.steps), act=cleanNum(h.activeKcal),
        restK=cleanNum(h.restingKcal), wkg=cleanNum(h.weightKg);
  if(steps!=null) d.health.steps = Math.round(steps);
  if(act!=null)   d.health.activeKcal = Math.round(act);
  if(restK!=null&&restK>300) d.health.restingKcal = Math.round(restK);
  let msg=[];
  if(wkg!=null && wkg>20){
    const kg=r1(wkg);
    const ex=D.weights.find(w=>w.date===k);
    if(ex) ex.kg=kg; else D.weights.push({date:k,kg});
    D.weights.sort((a,b)=>a.date<b.date?-1:1);
    msg.push(kg+" kg");
  }
  if(d.health.steps!=null) msg.push(d.health.steps.toLocaleString()+" steps");
  if(d.health.activeKcal!=null) msg.push(d.health.activeKcal+" active kcal");
  if(d.health.restingKcal!=null) msg.push(d.health.restingKcal+" resting kcal");
  save(); renderToday();
  toast(msg.length?("Imported: "+msg.join(", ")+" ✓"):"Nothing to import");
}
async function importHealth(){
  // Data arrives from the "Fuel Import" iPhone Shortcut via clipboard (or #h= URL hash)
  let txt="";
  try{ txt = await navigator.clipboard.readText(); }
  catch(e){ toast("Tap Import again and choose 'Allow Paste'"); return; }
  let h=null;
  try{
    h=JSON.parse(txt);
  }catch(e){
    // lenient rescue: pull the numbers out even if the Shortcut's text is malformed
    const grab=key=>{
      const m=txt.match(new RegExp('"?'+key+'"?\\s*[:=]\\s*"?\\s*([\\d][\\d.,]*)',"i"));
      return m?m[1]:null;
    };
    h={ steps:grab("steps"), activeKcal:grab("activeKcal"),
        restingKcal:grab("restingKcal"), weightKg:grab("weightKg") };
  }
  if(!h || (h.steps==null&&h.activeKcal==null&&h.restingKcal==null&&h.weightKg==null)){
    toast("Clipboard has no Health data — run 'Fuel Import' Shortcut first");
    return;
  }
  applyHealthData(h);
}
// alternative path: Shortcut opens fuel/#h=<urlencoded json>
(function(){
  if(location.hash.startsWith("#h=")){
    try{ applyHealthData(JSON.parse(decodeURIComponent(location.hash.slice(3)))); }catch(e){}
    history.replaceState(null,"",location.pathname);
  }
})();

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
