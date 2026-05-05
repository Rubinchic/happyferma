'use strict';
// ============================================================
// DATA DEFINITIONS
// ============================================================
const CROPS = [
  {id:'wheat',     emoji:'🌾',name:'Пшениця',   cost:10,  reward:0, time:8,   gives:'flour',   givesAmt:1, givesEmoji:'🥐', unlockLevel:1},
  {id:'carrot',    emoji:'🥕',name:'Морква',     cost:20,  reward:0, time:18,  gives:'carrot',  givesAmt:2, givesEmoji:'🥕', unlockLevel:1},
  {id:'corn',      emoji:'🌽',name:'Кукурудза',  cost:30,  reward:0, time:22,  gives:'corn',    givesAmt:3, givesEmoji:'🌽', unlockLevel:2},
  {id:'tomato',    emoji:'🍅',name:'Помідор',    cost:50,  reward:0, time:35,  gives:'tomato',  givesAmt:4, givesEmoji:'🍅', unlockLevel:2},
  {id:'sunflower', emoji:'🌻',name:'Соняшник',   cost:80,  reward:0, time:55,  gives:'seeds',   givesAmt:5, givesEmoji:'🌻', unlockLevel:3},
  {id:'melon',     emoji:'🍉',name:'Кавун',      cost:120, reward:0, time:75,  gives:'melon',   givesAmt:4, givesEmoji:'🍉', unlockLevel:4},
  {id:'pumpkin',   emoji:'🎃',name:'Гарбуз',     cost:200, reward:0, time:110, gives:'pumpkin', givesAmt:5, givesEmoji:'🎃', unlockLevel:6},
];

const PRODUCTS = {
  flour:   {emoji:'🥐',name:'Борошно',   sellPrice:22,  feedValue:10, category:'crop'},
  carrot:  {emoji:'🥕',name:'Морква',    sellPrice:28,  feedValue:20, category:'crop'},
  corn:    {emoji:'🌽',name:'Кукурудза', sellPrice:30,  feedValue:25, category:'crop'},
  tomato:  {emoji:'🍅',name:'Помідор',   sellPrice:40,  feedValue:30, category:'crop'},
  seeds:   {emoji:'🌻',name:'Насіння',   sellPrice:48,  feedValue:25, category:'crop'},
  melon:   {emoji:'🍉',name:'Кавун',     sellPrice:65,  feedValue:40, category:'crop'},
  pumpkin: {emoji:'🎃',name:'Гарбуз',    sellPrice:90,  feedValue:50, category:'crop'},
  milk:    {emoji:'🥛',name:'Молоко',    sellPrice:45,  feedValue:0,  category:'animal'},
  egg:     {emoji:'🥚',name:'Яйце',      sellPrice:25,  feedValue:0,  category:'animal'},
  wool:    {emoji:'🧶',name:'Вовна',     sellPrice:60,  feedValue:0,  category:'animal'},
  honey:   {emoji:'🍯',name:'Мед',       sellPrice:80,  feedValue:0,  category:'animal'},
  feather: {emoji:'🪶',name:'Пір\'я',   sellPrice:30,  feedValue:0,  category:'animal'},
  meat:    {emoji:'🥩',name:'М\'ясо',     sellPrice:70,  feedValue:0,  category:'animal'},
  // crafted goods
  butter:  {emoji:'🧈',name:'Масло',      sellPrice:80,  feedValue:0,  category:'crafted'},
  cheese:  {emoji:'🧀',name:'Сир',        sellPrice:90,  feedValue:0,  category:'crafted'},
  bread:   {emoji:'🍞',name:'Хліб',       sellPrice:120, feedValue:0,  category:'crafted'},
  honey_bun:{emoji:'🍯🍞',name:'Булочка з медом', sellPrice:200, feedValue:0, category:'crafted'},
  pizza:   {emoji:'🍕',name:'Піца',       sellPrice:350, feedValue:0,  category:'crafted'},
  omelette:{emoji:'🍳',name:'Омлет',      sellPrice:85,  feedValue:0,  category:'crafted'},
  cake:    {emoji:'🎂',name:'Торт',       sellPrice:280, feedValue:0,  category:'crafted'},
  soup:    {emoji:'🍲',name:'Суп',        sellPrice:150, feedValue:0,  category:'crafted'},
};

const ANIMALS_DEF = [
  {id:'cow',    emoji:'🐄',name:'Корова',  cost:300, produces:'milk',   produceTime:40,  feedCost:30, happinessDecay:8,  unlockLevel:2},
  {id:'chicken',emoji:'🐓',name:'Курка',   cost:150, produces:'egg',    produceTime:25,  feedCost:15, happinessDecay:10, unlockLevel:1},
  {id:'sheep',  emoji:'🐑',name:'Вівця',   cost:250, produces:'wool',   produceTime:60,  feedCost:25, happinessDecay:7,  unlockLevel:2},
  {id:'bee',    emoji:'🐝',name:'Бджоли',  cost:400, produces:'honey',  produceTime:90,  feedCost:20, happinessDecay:5,  unlockLevel:3},
  {id:'duck',   emoji:'🦆',name:'Качка',   cost:200, produces:'feather',produceTime:50,  feedCost:18, happinessDecay:9,  unlockLevel:3},
  {id:'pig',    emoji:'🐷',name:'Свиня',   cost:350, produces:'meat',   produceTime:70,  feedCost:35, happinessDecay:8,  unlockLevel:4},
];

const ACHIEVEMENTS = [
  {id:'first_plant',   icon:'🌱', name:'Перший крок',       desc:'Посади перший врожай',         xp:20,   coins:0},
  {id:'first_harvest', icon:'🌾', name:'Перший збір',        desc:'Збери перший врожай',          xp:30,   coins:50},
  {id:'first_sell',    icon:'🛒', name:'Перший продаж',      desc:'Продай товар на ринку',        xp:25,   coins:30},
  {id:'first_animal',  icon:'🐾', name:'Друг тварин',        desc:'Купи першу тварину',           xp:50,   coins:100},
  {id:'first_craft',   icon:'🍳', name:'Кухар',              desc:'Скрафти перший предмет',       xp:40,   coins:80},
  {id:'first_auto',    icon:'⚙️', name:'Автоматизатор',      desc:'Запусти перше авто-поле',      xp:100,  coins:200},
  {id:'harvest10',     icon:'🌿', name:'Збирач',             desc:'Збери 10 врожаїв',             xp:50,   coins:100},
  {id:'harvest50',     icon:'🌾', name:'Досвідчений',        desc:'Збери 50 врожаїв',             xp:100,  coins:300},
  {id:'harvest200',    icon:'🏆', name:'Великий фермер',     desc:'Збери 200 врожаїв',            xp:250,  coins:800},
  {id:'harvest500',    icon:'👑', name:'Майстер поля',       desc:'Збери 500 врожаїв',            xp:500,  coins:2000},
  {id:'harvest1000',   icon:'🌟', name:'Легенда ферми',      desc:'Збери 1000 врожаїв',           xp:1000, coins:5000},
  {id:'animals3',      icon:'🐔', name:'Маленька стайня',    desc:'Май 3 тварини',                xp:80,   coins:200},
  {id:'animals5',      icon:'🐄', name:'Стайня',             desc:'Май 5 тварин',                 xp:150,  coins:500},
  {id:'animals10',     icon:'🐖', name:'Велика ферма',       desc:'Май 10 тварин',                xp:300,  coins:1500},
  {id:'collect100',    icon:'📦', name:'Збирач продуктів',   desc:'Збери 100 продуктів з тварин', xp:200,  coins:600},
  {id:'collect500',    icon:'🏭', name:'Молочний завод',     desc:'Збери 500 продуктів з тварин', xp:500,  coins:2000},
  {id:'coins500',      icon:'💰', name:'Скарбничка',         desc:'Накопичи 500 монет',           xp:50,   coins:0},
  {id:'coins2000',     icon:'💎', name:'Багатій',            desc:'Накопичи 2000 монет',          xp:100,  coins:0},
  {id:'coins10000',    icon:'💍', name:'Інвестор',           desc:'Накопичи 10 000 монет',        xp:300,  coins:0},
  {id:'coins100000',   icon:'🏦', name:'Банкір',             desc:'Накопичи 100 000 монет',       xp:1000, coins:0},
  {id:'earned50000',   icon:'💸', name:'Підприємець',        desc:'Зароби 50 000 монет всього',   xp:500,  coins:2500},
  {id:'level3',        icon:'⭐', name:'Досвідчений',        desc:'Досягни рівня 3',              xp:0,    coins:200},
  {id:'level5',        icon:'🌟', name:'Фермер',             desc:'Досягни рівня 5',              xp:0,    coins:500},
  {id:'level10',       icon:'💫', name:'Старший фермер',     desc:'Досягни рівня 10',             xp:0,    coins:2000},
  {id:'level15',       icon:'🔥', name:'Майстер фермер',     desc:'Досягни рівня 15',             xp:0,    coins:8000},
  {id:'sell20',        icon:'🛍', name:'Торговець',          desc:'Продай 20 товарів',            xp:80,   coins:150},
  {id:'sell100',       icon:'🏪', name:'Крамар',             desc:'Продай 100 товарів',           xp:200,  coins:500},
  {id:'sell500',       icon:'🏬', name:'Оптовик',            desc:'Продай 500 товарів',           xp:500,  coins:2000},
  {id:'water20',       icon:'💧', name:'Поливальник',        desc:'Полий 20 ділянок',             xp:40,   coins:80},
  {id:'water100',      icon:'🚿', name:'Садівник',           desc:'Полий 100 ділянок',            xp:150,  coins:300},
  {id:'craft10',       icon:'🍞', name:'Пекар',              desc:'Скрафти 10 предметів',         xp:200,  coins:400},
  {id:'craft_pizza',   icon:'🍕', name:'Піцайоло',           desc:'Скрафти піцу',                 xp:300,  coins:500},
  {id:'auto_complete', icon:'🤖', name:'Промисловий фермер', desc:'Заверши 5 авто-полів',         xp:300,  coins:1000},
  {id:'unlock10cells', icon:'🔓', name:'Землевласник',       desc:'Розблокуй 10 клітинок',        xp:150,  coins:300},
  {id:'all_crops',     icon:'🌈', name:'Агроном',            desc:'Виростив всі 7 культур',       xp:400,  coins:1000},
  {id:'all_animals',   icon:'🐗', name:'Зоолог',             desc:'Купи всі 6 видів тварин',      xp:500,  coins:1500},
];

// ============================================================
// HOUSES DEFINITIONS
// ============================================================
const HOUSES_DEF = [
  {
    id:'chicken_coop', animalId:'chicken',
    name:'Курник', icon:'🏚',
    unlockLevel:1, buildCost:0,
    levels:[
      {lvl:1, capacity:2,  reqLevel:1,  label:'Старий курник',     upgradeCost:500,    upgradeLabel:'Дерев\'яний',   produceBonus:1.0},
      {lvl:2, capacity:5,  reqLevel:2,  label:'Дерев\'яний курник',upgradeCost:3000,   upgradeLabel:'Цегляний',      produceBonus:1.2},
      {lvl:3, capacity:10, reqLevel:5,  label:'Цегляний курник',    upgradeCost:15000,  upgradeLabel:'Промисловий',   produceBonus:1.5},
      {lvl:4, capacity:20, reqLevel:9,  label:'Птахофабрика',       upgradeCost:null,   upgradeLabel:'Максимум',      produceBonus:2.0},
    ]
  },
  {
    id:'cowshed', animalId:'cow',
    name:'Корівник', icon:'🏠',
    unlockLevel:2, buildCost:1000,
    levels:[
      {lvl:1, capacity:1,  reqLevel:2,  label:'Маленький корівник', upgradeCost:5000,   upgradeLabel:'Середній',      produceBonus:1.0},
      {lvl:2, capacity:3,  reqLevel:4,  label:'Середній корівник',  upgradeCost:25000,  upgradeLabel:'Великий',       produceBonus:1.3},
      {lvl:3, capacity:6,  reqLevel:7,  label:'Великий корівник',   upgradeCost:120000, upgradeLabel:'Молочний завод',produceBonus:1.6},
      {lvl:4, capacity:12, reqLevel:12, label:'Молочний завод',     upgradeCost:null,   upgradeLabel:'Максимум',      produceBonus:2.2},
    ]
  },
  {
    id:'sheepfold', animalId:'sheep',
    name:'Овчарня', icon:'🛖',
    unlockLevel:2, buildCost:800,
    levels:[
      {lvl:1, capacity:2,  reqLevel:2,  label:'Мала овчарня',       upgradeCost:4000,   upgradeLabel:'Середня',       produceBonus:1.0},
      {lvl:2, capacity:5,  reqLevel:4,  label:'Середня овчарня',    upgradeCost:20000,  upgradeLabel:'Велика',        produceBonus:1.3},
      {lvl:3, capacity:9,  reqLevel:8,  label:'Велика овчарня',     upgradeCost:100000, upgradeLabel:'Вовняна ферма', produceBonus:1.6},
      {lvl:4, capacity:16, reqLevel:13, label:'Вовняна ферма',      upgradeCost:null,   upgradeLabel:'Максимум',      produceBonus:2.0},
    ]
  },
  {
    id:'beehive', animalId:'bee',
    name:'Вулик', icon:'🏺',
    unlockLevel:3, buildCost:2000,
    levels:[
      {lvl:1, capacity:1,  reqLevel:3,  label:'Малий вулик',        upgradeCost:8000,   upgradeLabel:'Середній',      produceBonus:1.0},
      {lvl:2, capacity:3,  reqLevel:6,  label:'Середній вулик',     upgradeCost:40000,  upgradeLabel:'Великий',       produceBonus:1.4},
      {lvl:3, capacity:6,  reqLevel:10, label:'Великий вулик',      upgradeCost:200000, upgradeLabel:'Пасіка',        produceBonus:1.8},
      {lvl:4, capacity:12, reqLevel:15, label:'Медова пасіка',      upgradeCost:null,   upgradeLabel:'Максимум',      produceBonus:2.5},
    ]
  },
  {
    id:'duck_pond', animalId:'duck',
    name:'Качина ферма', icon:'⛺',
    unlockLevel:3, buildCost:1200,
    levels:[
      {lvl:1, capacity:2,  reqLevel:3,  label:'Малий ставок',       upgradeCost:6000,   upgradeLabel:'Середній',      produceBonus:1.0},
      {lvl:2, capacity:5,  reqLevel:5,  label:'Середній ставок',    upgradeCost:30000,  upgradeLabel:'Великий',       produceBonus:1.3},
      {lvl:3, capacity:9,  reqLevel:9,  label:'Велике озеро',       upgradeCost:150000, upgradeLabel:'Качина ферма',  produceBonus:1.6},
      {lvl:4, capacity:15, reqLevel:14, label:'Качина ферма',       upgradeCost:null,   upgradeLabel:'Максимум',      produceBonus:2.0},
    ]
  },
  {
    id:'pigsty', animalId:'pig',
    name:'Свинарник', icon:'🏗',
    unlockLevel:4, buildCost:3000,
    levels:[
      {lvl:1, capacity:1,  reqLevel:4,  label:'Малий свинарник',    upgradeCost:10000,  upgradeLabel:'Середній',      produceBonus:1.0},
      {lvl:2, capacity:3,  reqLevel:7,  label:'Середній свинарник', upgradeCost:50000,  upgradeLabel:'Великий',       produceBonus:1.3},
      {lvl:3, capacity:6,  reqLevel:11, label:'Великий свинарник',  upgradeCost:250000, upgradeLabel:'М\'ясний завод',produceBonus:1.7},
      {lvl:4, capacity:10, reqLevel:16, label:'М\'ясний завод',     upgradeCost:null,   upgradeLabel:'Максимум',      produceBonus:2.2},
    ]
  },
];

// ============================================================
// RECIPES
// ============================================================
const RECIPES = [
  // ── Базові молочні ──
  {
    id:'butter', output:'butter', outputAmt:1,
    name:'Масло', category:'dairy',
    ingredients:{ milk:3 },
    time:5, xp:10,
    desc:'Збиваємо молоко до густого масла'
  },
  {
    id:'cheese', output:'cheese', outputAmt:1,
    name:'Сир', category:'dairy',
    ingredients:{ milk:4 },
    time:8, xp:15,
    desc:'Молоко ферментується у смачний сир'
  },
  // ── Хлібобулочні ──
  {
    id:'bread', output:'bread', outputAmt:1,
    name:'Хліб', category:'bakery',
    ingredients:{ flour:2, milk:1, egg:1 },
    time:10, xp:20,
    desc:'Класичний домашній хліб'
  },
  {
    id:'omelette', output:'omelette', outputAmt:1,
    name:'Омлет', category:'bakery',
    ingredients:{ egg:3, milk:1 },
    time:5, xp:12,
    desc:'Пухкий омлет на сніданок'
  },
  {
    id:'honey_bun', output:'honey_bun', outputAmt:2,
    name:'Булочки з медом', category:'bakery',
    ingredients:{ flour:2, butter:1, honey:1 },
    time:12, xp:30,
    desc:'Солодкі медові булочки. Потрібно спочатку зробити масло!'
  },
  {
    id:'cake', output:'cake', outputAmt:1,
    name:'Торт', category:'bakery',
    ingredients:{ flour:3, egg:3, milk:2, honey:2, butter:2 },
    time:20, xp:60,
    desc:'Розкішний святковий торт!'
  },
  // ── Ситні страви ──
  {
    id:'soup', output:'soup', outputAmt:2,
    name:'Суп', category:'meals',
    ingredients:{ carrot:2, corn:1, tomato:2 },
    time:8, xp:18,
    desc:'Ароматний овочевий суп'
  },
  {
    id:'pizza', output:'pizza', outputAmt:1,
    name:'Піца', category:'meals',
    ingredients:{ flour:2, egg:1, milk:1, cheese:1, tomato:2, meat:1 },
    time:20, xp:50,
    desc:'Справжня піца з усього найкращого! Потрібен сир.'
  },
];

const RECIPE_CATEGORIES = {
  dairy:  { label:'🥛 Молочне', color:'#e3f2fd' },
  bakery: { label:'🍞 Випічка',  color:'#fff8e1' },
  meals:  { label:'🍽 Страви',   color:'#fce4ec' },
};

const GRID_SIZE = 35;

// ============================================================
// STORAGE HELPERS
// ============================================================
const STORE_KEY = 'veselaFarma_accounts';

function loadAllAccounts() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
  catch { return {}; }
}
function saveAllAccounts(accounts) {
  localStorage.setItem(STORE_KEY, JSON.stringify(accounts));
}
function getAccount(name) { return loadAllAccounts()[name.toLowerCase()] || null; }

  async function saveAccount(name, data) {
    try {
      const response = await fetch('https://farm.slivce.cc/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name,
          gameData: data // Відправляємо весь об'єкт G
        })
      });
      const result = await response.json();
      if (result.success) {
        console.log("✅ Збережено в Redis");
      }
    } catch (e) {
      console.error("❌ Помилка синхронізації:", e);
    }
  }

function getAllAccountNames() {
  return Object.values(loadAllAccounts()).map(a => a.displayName || a.name);
}

function defaultGameState(name) {
  return {
    displayName: name,
    password: '',
    coins: 200,
    water: 10, maxWater: 10,
    level: 1, xp: 0, xpNext: 100,
    day: 1,
    inventory: {},
    animals: [],
    animalIdCounter: 0,
    cells: Array(GRID_SIZE).fill(null).map((_,i) => ({state:'empty',crop:null,plantedAt:null,waterBonus:false,unlocked:i<7})),
    unlockedCells: 7,
    stats: {planted:0,harvested:0,watered:0,earned:0,sold:0,animalsBought:0,productsCollected:0},
    achievements: [],
    joinedDate: new Date().toLocaleDateString('uk-UA'),
    selectedCrop: 'wheat',
    selectedTool: 'plant',
    // Houses: key = houseId, value = {level, built}
    houses: { chicken_coop: {level:1, built:true} }, // курник є з початку безкоштовно
    craftQueue: [], // [{recipeId, startTime, duration}]
    autoFields: [], // [{cellIndex, cropId, budget, cyclesLeft, active}]
    houseFeed: {}, // {houseId: productId}
    // Yard buildings
    yard: { hqLevel: 1, barnLevel: 1, kitchenLevel: 1, truckLevel: 0 },
    // Overflow buffer "on ground" (expires in 10 min)
    groundDrops: [], // [{k, qty, expiresAt}]
    // City orders (requires truck)
    cityOrders: { orders: [], nextRefreshAt: 0 },
  };
}

// Helper: get house state (with migration for old saves)
function getHouseState(houseId) {
  if (!G.houses) G.houses = { chicken_coop: {level:1, built:true} };
  return G.houses[houseId] || null;
}

// Helper: get capacity for animal type
function getCapacityForAnimal(animalId) {
  const house = HOUSES_DEF.find(h => h.animalId === animalId);
  if (!house) return 0;
  const hs = getHouseState(house.id);
  if (!hs || !hs.built) return 0;
  return house.levels[hs.level - 1].capacity;
}

// Helper: count animals of type
function countAnimals(animalId) {
  return G.animals.filter(a => a.type === animalId).length;
}

// Helper: get produce bonus from house level
function getHouseProduceBonus(animalId) {
  const house = HOUSES_DEF.find(h => h.animalId === animalId);
  if (!house) return 1.0;
  const hs = getHouseState(house.id);
  if (!hs || !hs.built) return 1.0;
  return house.levels[hs.level - 1].produceBonus;
}

// ============================================================
// GLOBAL STATE
// ============================================================
let G = null; // current game state
let currentUser = null;
let ticks = 0;

// ============================================================
// AUTH
// ============================================================
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t,i)=>t.classList.toggle('active', (tab==='login'?i===0:i===1)));
  document.getElementById('loginForm').style.display = tab==='login'?'':'none';
  document.getElementById('registerForm').style.display = tab==='register'?'':'none';
  document.getElementById('authError').textContent='';
}

  function renderSavedAccounts() {
    const wrap = document.getElementById('savedAccounts');
    if (!wrap) return;

    try {
      // Читаємо дані з кешу (замініть 'VF_KNOWN_USERS' на ваш ключ, якщо він інший, наприклад 'farm_accounts')
      const raw = localStorage.getItem('VF_KNOWN_USERS') || '[]';
      const accounts = JSON.parse(raw);

      if (!Array.isArray(accounts) || accounts.length === 0) {
        wrap.innerHTML = '';
        return;
      }

      // Фільтруємо биті записи (null/undefined)
      const validAccounts = accounts.filter(acc => acc !== null && acc !== undefined);

      if (validAccounts.length === 0) {
        wrap.innerHTML = '';
        return;
      }

      wrap.innerHTML = `<p style="font-size: 0.9rem; color: #666; margin-bottom: 8px;">Раніше заходили:</p>` +
              validAccounts.map(acc => {
                const name = acc.displayName || acc.name || acc;
                const loginName = acc.name || acc;
                return `<span class="account-chip" style="cursor:pointer; background:#e0f7fa; padding:5px 10px; border-radius:12px; margin:4px; display:inline-block;" onclick="quickLogin('${loginName}')">${name}</span>`;
              }).join('');

    } catch (e) {
      console.error("Помилка читання списку акаунтів:", e);
      localStorage.removeItem('VF_KNOWN_USERS');
      wrap.innerHTML = '';
    }
  }

  // Функція для кліку по чіпу з іменем
  function quickLogin(name) {
    const nameInput = document.getElementById('loginName');
    const passInput = document.getElementById('loginPass');

    if (nameInput) nameInput.value = name;
    if (passInput) passInput.focus();
  }

  async function doLogin() {
    const nameEl = document.getElementById('loginName');
    const passEl = document.getElementById('loginPass');

    if (!nameEl || !passEl) return;

    const name = nameEl.value.trim();
    const pass = passEl.value.trim();

    if (!name || !pass) return setAuthError('Введіть ім\'я та пароль!');

    try {
      const response = await fetch('https://farm.slivce.cc/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, password: pass, mode: 'login' })
      });

      const res = await response.json();
      console.log(res);

      if (response.ok) {
        let data = (typeof res.data === 'string') ? JSON.parse(res.data) : res.data;

        if (!data.displayName) data.displayName = name;

        startGame(data);
      } else {
        setAuthError(res.error || 'Помилка входу');
      }
    } catch (e) {
      setAuthError('Сервер не відповідає. Перевірте Docker.');
      console.log(e)
    }
  }

  async function doRegister() {
    const nameEl = document.getElementById('regName');
    const passEl = document.getElementById('regPass');
    const pass2El = document.getElementById('regPass2');

    if (!nameEl || !passEl || !pass2El) return;

    const name = nameEl.value.trim();
    const pass = passEl.value.trim();
    const pass2 = pass2El.value.trim();

    if (!name || !pass || !pass2) return setAuthError('Заповніть усі поля!');
    if (name.length < 2) return setAuthError('Ім\'я занадто коротке!');
    if (pass.length < 4) return setAuthError('Пароль занадто короткий!');
    if (pass !== pass2) return setAuthError('Паролі не співпадають!');

    const initialData = defaultGameState(name);

    try {
      const response = await fetch('https://farm.slivce.cc/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name,
          password: pass,
          mode: 'register',
          gameData: initialData
        })
      });

      const res = await response.json();
      console.log(res);

      if (response.ok) {
        startGame(initialData);
      } else {
        setAuthError(res.error || 'Помилка реєстрації');
      }
    } catch (e) {
      setAuthError('Помилка сервера');
    }
  }

function setAuthError(msg) { document.getElementById('authError').textContent = msg; }

function startGame(acc) {
  G = acc;
  currentUser = acc.displayName;
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('gameUI').style.display = '';
  if (!G.craftQueue) G.craftQueue = [];
  if (!G.autoFields) G.autoFields = [];
  if (!G.houseFeed) G.houseFeed = {};
  if (!G.houses) G.houses = { chicken_coop: {level:1, built:true} };
  if (!G.yard) G.yard = { hqLevel: 1, barnLevel: 1, kitchenLevel: 1, truckLevel: 0 };
  if (typeof G.yard.hqLevel !== 'number') G.yard.hqLevel = 1;
  if (typeof G.yard.barnLevel !== 'number') G.yard.barnLevel = 1;
  if (typeof G.yard.kitchenLevel !== 'number') G.yard.kitchenLevel = 1;
  if (typeof G.yard.truckLevel !== 'number') G.yard.truckLevel = 0;
  if (!G.groundDrops) G.groundDrops = [];
  if (!G.cityOrders) G.cityOrders = { orders: [], nextRefreshAt: 0 };
  if (!G.cityOrders.orders) G.cityOrders.orders = [];
  migrateAutoFields();
  if (!G.quests) G.quests = {active:[], completed:[], lastRefresh:0};
  generateDailyQuests();
  renderAll();
  updateSystemLocks();
  startTimers();
  addLog(`👋 Привіт, ${G.displayName}! Вдалого дня на фермі!`);
}

function doLogout() {
  if (!confirm('Виходимо з ферми?')) return;
  saveCurrentGame();
  G = null; currentUser = null;
  document.getElementById('gameUI').style.display = 'none';
  document.getElementById('authScreen').style.display = '';
  renderSavedAccounts();
}

function saveCurrentGame() {
  if (G && currentUser) saveAccount(currentUser, G);
}

// ============================================================
// TABS
// ============================================================
let currentTab = 'farm';
const TAB_BTN_MAP = {farm:'tabFarm',animals:'tabAnimals',houses:'tabHouses',yard:'tabYard',inventory:'tabInventory',craft:'tabCraft',market:'tabMarket',orders:'tabOrders',quests:'tabQuests',profile:'tabProfile'};
function switchTab(tab) {
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  const btnId = TAB_BTN_MAP[tab];
  if (btnId) document.getElementById(btnId).classList.add('active');
  currentTab = tab;
  if (tab==='animals') { setTimeout(()=>{ initBarnScene(); renderAnimals(); }, 50); }
  if (tab==='houses') renderHouses();
  if (tab==='yard') renderYard();
  if (tab==='craft') renderCraft();
  if (tab==='orders') { renderOrders(); }
  if (tab==='quests') { generateDailyQuests(); renderQuests(); }
  if (tab==='inventory') renderInventory();
  if (tab==='market') renderMarket();
  if (tab==='profile') renderProfile();
}
function tabLabel(t){return{farm:'ферма',animals:'твар',inventory:'комор',market:'ринок',profile:'профіль'}[t]||t;}

// ============================================================
// RENDER ALL
// ============================================================
function renderAll() {
  updateTopBar();
  renderCropShop();
  renderGrid();
  renderAnimalShop();
  renderFeedInventory();
  if (currentTab==='animals') renderAnimals();
  if (currentTab==='inventory') renderInventory();
  if (currentTab==='market') renderMarket();
  if (currentTab==='profile') renderProfile();
}

// ============================================================
// YARD / LIMITS
// ============================================================
const YARD_DEF = {
  hq: {
    id: 'hq', icon: '🏚', name: 'Дім фермера',
    levels: [
      { lvl: 1, reqLevel: 1, upgradeCost: 600,  autoSlots: 0, orderSlots: 1, label: 'Старий дім' },
      { lvl: 2, reqLevel: 3, upgradeCost: 4500, autoSlots: 1, orderSlots: 2, label: 'Надійний дім' },
      { lvl: 3, reqLevel: 7, upgradeCost: 28000,autoSlots: 2, orderSlots: 3, label: 'Штаб ферми' },
      { lvl: 4, reqLevel: 12,upgradeCost: null, autoSlots: 3, orderSlots: 4, label: 'Панська садиба' },
    ],
  },
  barn: {
    id: 'barn', icon: '📦', name: 'Склад / Амбар',
    levels: [
      { lvl: 1, reqLevel: 1, upgradeCost: 900,   invCap: 250, label: 'Старий амбар' },
      { lvl: 2, reqLevel: 4, upgradeCost: 6500,  invCap: 350, label: 'Охайний склад' },
      { lvl: 3, reqLevel: 8, upgradeCost: 42000, invCap: 500, label: 'Великий склад' },
      { lvl: 4, reqLevel: 13,upgradeCost: null,  invCap: 700, label: 'Логістичний центр' },
    ],
  },
  kitchen: {
    id: 'kitchen', icon: '🍳', name: 'Кухня (крафт-слоти)',
    levels: [
      { lvl: 1, reqLevel: 1, upgradeCost: 700,   craftSlots: 1, label: 'Плита' },
      { lvl: 2, reqLevel: 5, upgradeCost: 9000,  craftSlots: 2, label: 'Кухня' },
      { lvl: 3, reqLevel: 10,upgradeCost: null,  craftSlots: 3, label: 'Міні-цех' },
    ],
  },
  truck: {
    id: 'truck', icon: '🚚', name: 'Вантажівка (міські замовлення)',
    levels: [
      // NOTE: truck uses ONLY existing items (no new "wood/metal" resources)
      // NOTE: intentionally requires NEW resources (not obtainable yet) so the truck can't be built until you design the mechanic.
      { lvl: 0, reqLevel: 2, upgradeCost: 2500,  reqItems:[{k:'boards',qty:20},{k:'steel',qty:12},{k:'rubber',qty:6}],  cityUnlocked: false, rewardMul: 1.0, slotBonus: 0, label: 'Не збудовано' },
      { lvl: 1, reqLevel: 2, upgradeCost: 16000, reqItems:[{k:'steel',qty:30},{k:'engine_parts',qty:8},{k:'rubber',qty:14}], cityUnlocked: true,  rewardMul: 1.0, slotBonus: 0, label: 'Стара вантажівка' },
      { lvl: 2, reqLevel: 6, upgradeCost: 90000, reqItems:[{k:'steel',qty:60},{k:'electronics',qty:12},{k:'fuel',qty:20}],    cityUnlocked: true,  rewardMul: 1.15,slotBonus: 1, label: 'Надійна вантажівка' },
      { lvl: 3, reqLevel: 11,upgradeCost: null,  reqItems:[{k:'steel',qty:90},{k:'hydraulics',qty:16},{k:'tires',qty:10}],    cityUnlocked: true,  rewardMul: 1.30,slotBonus: 1, label: 'Фура' },
    ],
  }
};

const GROUND_TTL_MS = 10 * 60 * 1000;
const GROUND_CAP_QTY = 220; // total qty buffer on ground (big enough to be "simple")
const INV_LEVEL_BONUS_PCT = 0.07;   // +7% each level
const INV_EVERY5_BONUS_PCT = 0.12;  // +12% extra on each 5th level (5,10,15...)

function invCount() {
  return Object.values(G.inventory || {}).reduce((a,b)=>a+(b||0),0);
}
function groundCount() {
  if (!G.groundDrops) G.groundDrops = [];
  pruneGroundDrops();
  return (G.groundDrops||[]).reduce((s,x)=>s+(x.qty||0),0);
}
function pruneGroundDrops() {
  if (!G || !G.groundDrops) return;
  const now = Date.now();
  G.groundDrops = G.groundDrops.filter(d => (d.qty||0) > 0 && (d.expiresAt||0) > now);
}
function getInvCap() {
  const lvl = Math.max(1, G?.yard?.barnLevel || 1);
  const def = YARD_DEF.barn.levels.find(x => x.lvl === lvl) || YARD_DEF.barn.levels[0];
  const playerLvl = Math.max(1, G?.level || 1);
  const mult = Math.pow(1 + INV_LEVEL_BONUS_PCT, Math.max(0, playerLvl - 1))
             * Math.pow(1 + INV_EVERY5_BONUS_PCT, Math.floor(playerLvl / 5));
  return Math.max(0, Math.round((def.invCap || 0) * mult));
}
function getCraftSlots() {
  const lvl = Math.max(1, G?.yard?.kitchenLevel || 1);
  const def = YARD_DEF.kitchen.levels.find(x => x.lvl === lvl) || YARD_DEF.kitchen.levels[0];
  return def.craftSlots;
}
function getAutoFieldSlots() {
  const lvl = Math.max(1, G?.yard?.hqLevel || 1);
  const def = YARD_DEF.hq.levels.find(x => x.lvl === lvl) || YARD_DEF.hq.levels[0];
  return def.autoSlots;
}
function getCityOrderSlots() {
  const hqLvl = Math.max(1, G?.yard?.hqLevel || 1);
  const hqDef = YARD_DEF.hq.levels.find(x => x.lvl === hqLvl) || YARD_DEF.hq.levels[0];
  const truckLvl = Math.max(0, G?.yard?.truckLevel || 0);
  const tDef = YARD_DEF.truck.levels.find(x => x.lvl === truckLvl) || YARD_DEF.truck.levels[0];
  return Math.max(0, (hqDef.orderSlots || 0) + (tDef.slotBonus || 0));
}
function isCityOrdersUnlocked() {
  const truckLvl = Math.max(0, G?.yard?.truckLevel || 0);
  const tDef = YARD_DEF.truck.levels.find(x => x.lvl === truckLvl) || YARD_DEF.truck.levels[0];
  return !!tDef.cityUnlocked;
}
function getTruckRewardMul() {
  const truckLvl = Math.max(0, G?.yard?.truckLevel || 0);
  const tDef = YARD_DEF.truck.levels.find(x => x.lvl === truckLvl) || YARD_DEF.truck.levels[0];
  return tDef.rewardMul || 1.0;
}

function canAcceptToStorage(key, amount) {
  const freeInv = Math.max(0, getInvCap() - invCount());
  const freeGround = Math.max(0, GROUND_CAP_QTY - groundCount());
  return (freeInv + freeGround) >= amount;
}

const RESOURCE_LABELS = {
  boards:       { emoji:'🪵', name:'Дошки' },
  steel:        { emoji:'🧱', name:'Сталь' },
  rubber:       { emoji:'🛞', name:'Гума' },
  tires:        { emoji:'🛞', name:'Шини' },
  engine_parts: { emoji:'⚙️', name:'Деталі двигуна' },
  electronics:  { emoji:'🔌', name:'Електроніка' },
  hydraulics:   { emoji:'🧰', name:'Гідравліка' },
  fuel:         { emoji:'⛽', name:'Пальне' },
};

function getItemLabel(k) {
  const p = PRODUCTS[k];
  if (p) return { emoji: p.emoji, name: p.name };
  const r = RESOURCE_LABELS[k];
  if (r) return r;
  return { emoji:'📦', name:k };
}

function hasReqItems(reqItems) {
  if (!reqItems || !reqItems.length) return true;
  return reqItems.every(it => (G.inventory[it.k] || 0) >= it.qty);
}
function reqItemsMissingList(reqItems) {
  if (!reqItems || !reqItems.length) return [];
  return reqItems
    .map(it => ({...it, have: (G.inventory[it.k] || 0)}))
    .filter(it => it.have < it.qty);
}
function reqItemsToText(reqItems, withHave) {
  if (!reqItems || !reqItems.length) return '—';
  return reqItems.map(it => {
    const p = getItemLabel(it.k);
    const have = (G.inventory[it.k] || 0);
    return withHave
      ? `${p.emoji} ${p.name} ${have}/${it.qty}`
      : `${p.emoji} ${p.name} ×${it.qty}`;
  }).join(' • ');
}
function deductReqItems(reqItems) {
  if (!reqItems || !reqItems.length) return true;
  if (!hasReqItems(reqItems)) return false;
  reqItems.forEach(it => {
    G.inventory[it.k] = (G.inventory[it.k] || 0) - it.qty;
    if (G.inventory[it.k] <= 0) delete G.inventory[it.k];
  });
  return true;
}

function addToGround(key, amount) {
  if (!G.groundDrops) G.groundDrops = [];
  pruneGroundDrops();
  const now = Date.now();
  const existing = G.groundDrops.find(d => d.k === key);
  if (existing) {
    existing.qty += amount;
    existing.expiresAt = now + GROUND_TTL_MS;
  } else {
    G.groundDrops.push({ k: key, qty: amount, expiresAt: now + GROUND_TTL_MS });
  }
}

function pickupGround(key) {
  if (!G || !G.groundDrops) return;
  pruneGroundDrops();
  const d = G.groundDrops.find(x => x.k === key);
  if (!d) return;
  const qty = d.qty || 0;
  if (!qty) return;
  const freeInv = Math.max(0, getInvCap() - invCount());
  if (freeInv <= 0) return addLog('📦 Комора повна. Апгрейдни амбар у "Дворі".');
  const take = Math.min(qty, freeInv);
  d.qty -= take;
  G.inventory[key] = (G.inventory[key] || 0) + take;
  if (d.qty <= 0) G.groundDrops = G.groundDrops.filter(x => x !== d);
  addLog(`📦 Підібрано з землі: ${take}x${PRODUCTS[key]?.emoji||'📦'} ${PRODUCTS[key]?.name||key}`);
  updateTopBar();
  if (currentTab === 'yard') renderYard();
  if (currentTab === 'inventory') renderInventory();
  saveCurrentGame();
}

function updateSystemLocks() {
  // Auto-field tool lock (HQ level)
  const autoBtn = document.getElementById('toolAuto');
  if (autoBtn) {
    const unlocked = getAutoFieldSlots() > 0;
    autoBtn.disabled = !unlocked;
    if (!unlocked && G.selectedTool === 'auto') {
      G.selectedTool = 'plant';
      document.querySelectorAll('.tool-btn').forEach(b=>b.classList.remove('selected'));
      renderCropShop();
    }
  }
}

function upgradeYardBuilding(kind) {
  if (!G || !G.yard) return;
  const y = G.yard;
  if (kind === 'hq') {
    const cur = Math.max(1, y.hqLevel||1);
    const next = YARD_DEF.hq.levels.find(l => l.lvl === cur + 1);
    if (!next) return addLog('✅ HQ вже максимум!');
    if (G.level < next.reqLevel) return addLog(`🔒 Потрібен рівень ${next.reqLevel} для апгрейду HQ.`);
    if (G.coins < next.upgradeCost) return addLog(`❌ Не вистачає монет: потрібно ${next.upgradeCost}🪙`);
    G.coins -= next.upgradeCost; y.hqLevel = cur + 1;
    addLog(`⬆️ 🏚 HQ апгрейджено до рівня ${y.hqLevel}!`);
    updateSystemLocks();
  }
  if (kind === 'barn') {
    const cur = Math.max(1, y.barnLevel||1);
    const next = YARD_DEF.barn.levels.find(l => l.lvl === cur + 1);
    if (!next) return addLog('✅ Амбар вже максимум!');
    if (G.level < next.reqLevel) return addLog(`🔒 Потрібен рівень ${next.reqLevel} для апгрейду амбару.`);
    if (G.coins < next.upgradeCost) return addLog(`❌ Не вистачає монет: потрібно ${next.upgradeCost}🪙`);
    G.coins -= next.upgradeCost; y.barnLevel = cur + 1;
    addLog(`⬆️ 📦 Амбар апгрейджено до рівня ${y.barnLevel}! Ліміт інвентаря тепер ${getInvCap()}.`);
  }
  if (kind === 'kitchen') {
    const cur = Math.max(1, y.kitchenLevel||1);
    const next = YARD_DEF.kitchen.levels.find(l => l.lvl === cur + 1);
    if (!next) return addLog('✅ Кухня вже максимум!');
    if (G.level < next.reqLevel) return addLog(`🔒 Потрібен рівень ${next.reqLevel} для апгрейду кухні.`);
    if (G.coins < next.upgradeCost) return addLog(`❌ Не вистачає монет: потрібно ${next.upgradeCost}🪙`);
    G.coins -= next.upgradeCost; y.kitchenLevel = cur + 1;
    addLog(`⬆️ 🍳 Кухню апгрейджено до рівня ${y.kitchenLevel}! Слотів крафту: ${getCraftSlots()}.`);
  }
  if (kind === 'truck') {
    const cur = Math.max(0, y.truckLevel||0);
    const next = YARD_DEF.truck.levels.find(l => l.lvl === cur + 1);
    if (!next) return addLog('✅ Вантажівка вже максимум!');
    if (G.level < next.reqLevel) return addLog(`🔒 Потрібен рівень ${next.reqLevel} для апгрейду вантажівки.`);
    if (!hasReqItems(next.reqItems)) return addLog(`📦 Не вистачає ресурсів: ${reqItemsToText(next.reqItems, true)}`);
    if (G.coins < next.upgradeCost) return addLog(`❌ Не вистачає монет: потрібно ${next.upgradeCost}🪙`);
    // Pay + consume existing items
    G.coins -= next.upgradeCost;
    deductReqItems(next.reqItems);
    y.truckLevel = cur + 1;
    addLog(`⬆️ 🚚 Вантажівка: рівень ${y.truckLevel}. Міські замовлення ${isCityOrdersUnlocked()?'відкрито':'ще закрито'}.`);
    if (isCityOrdersUnlocked()) initCityOrdersSystem(true);
  }
  updateTopBar();
  if (currentTab === 'yard') renderYard();
  if (currentTab === 'orders') renderOrders();
  saveCurrentGame();
}

function renderYard() {
  const wrap = document.getElementById('yardGrid');
  if (!wrap || !G) return;
  pruneGroundDrops();
  initCityOrdersSystem(false);

  const hqLvl = Math.max(1, G.yard.hqLevel||1);
  const barnLvl = Math.max(1, G.yard.barnLevel||1);
  const kitchenLvl = Math.max(1, G.yard.kitchenLevel||1);
  const truckLvl = Math.max(0, G.yard.truckLevel||0);
  const hqDef = YARD_DEF.hq.levels.find(x=>x.lvl===hqLvl) || YARD_DEF.hq.levels[0];
  const barnDef = YARD_DEF.barn.levels.find(x=>x.lvl===barnLvl) || YARD_DEF.barn.levels[0];
  const kitDef = YARD_DEF.kitchen.levels.find(x=>x.lvl===kitchenLvl) || YARD_DEF.kitchen.levels[0];
  const trkDef = YARD_DEF.truck.levels.find(x=>x.lvl===truckLvl) || YARD_DEF.truck.levels[0];

  const invCap = getInvCap();
  const invUsed = invCount();
  const gUsed = groundCount();
  const gLeft = Math.max(0, GROUND_CAP_QTY - gUsed);

  const groundList = (G.groundDrops||[]).length
    ? `<div style="margin-top:6px;">
        ${(G.groundDrops||[]).map(d => {
          const p = PRODUCTS[d.k] || {emoji:'📦', name:d.k};
          const remain = Math.max(0, Math.ceil(((d.expiresAt||0)-Date.now())/1000));
          const m=Math.floor(remain/60), s=remain%60;
          const t = m>0 ? `${m}хв ${s}с` : `${s}с`;
          return `<span class="ground-pill">${p.emoji} ${p.name} ×${d.qty} • ⏱ ${t} <button style="margin-left:6px;border:none;background:transparent;cursor:pointer;font-weight:900;color:#1a472a;" onclick="pickupGround('${d.k}')">підняти</button></span>`;
        }).join('')}
      </div>`
    : `<div class="bsmall">На землі нічого немає.</div>`;

  const upgradeBtn = (kind, curLvl, defArr) => {
    const next = defArr.find(l => l.lvl === curLvl + 1);
    if (!next) return `<button class="bbtn secondary" disabled>Максимум</button>`;
    const locked = G.level < next.reqLevel;
    const afford = G.coins >= next.upgradeCost;
    const needItemsOk = hasReqItems(next.reqItems);
    const dis = locked || !afford || !needItemsOk;
    const label = locked ? `🔒 Рвн.${next.reqLevel}` : !needItemsOk ? `📦 Нема ресурсів` : `⬆️ ${next.upgradeCost}🪙`;
    return `<button class="bbtn primary" ${dis?'disabled':''} onclick="upgradeYardBuilding('${kind}')">${label}</button>`;
  };

  const nextReqLine = (curLvl, defArr) => {
    const next = defArr.find(l => l.lvl === curLvl + 1);
    if (!next) return '';
    if (!next.reqItems || !next.reqItems.length) return '';
    const missing = reqItemsMissingList(next.reqItems);
    const text = reqItemsToText(next.reqItems, true);
    return `<div class="bsmall" style="color:${missing.length ? '#c0392b' : '#27ae60'}">Ресурси: ${text}</div>`;
  };

  wrap.innerHTML = `
    <div class="bcard">
      <div class="btop"><div class="bicon">🏚</div><div><div class="bname">Дім фермера (HQ)</div><div class="bsmall">${hqDef.label}</div></div><div class="blvl">Рівень ${hqLvl}</div></div>
      <div class="bdesc">Керує доступними системами: авто-поля та лімітом слотів замовлень. Нові механіки відкриваються по рівнях.</div>
      <div class="bmini">
        <div class="m"><div class="mv">${getAutoFieldSlots()}</div><div class="ml">⚙️ авто-поля</div></div>
        <div class="m"><div class="mv">${getCityOrderSlots()}</div><div class="ml">📦 слоти замовл.</div></div>
      </div>
      <div class="bacts">${upgradeBtn('hq', hqLvl, YARD_DEF.hq.levels)}<button class="bbtn secondary" onclick="switchTab('orders')">До замовлень</button></div>
      <div class="bsmall">Підказка: авто-поле відкривається з HQ 2 рівня.</div>
    </div>

    <div class="bcard">
      <div class="btop"><div class="bicon">📦</div><div><div class="bname">Склад / Амбар</div><div class="bsmall">${barnDef.label}</div></div><div class="blvl">Рівень ${barnLvl}</div></div>
      <div class="bdesc">Ліміт інвентаря. Якщо переповнення — зайве падає “на землю” на 10 хв (буфер), далі збір/крафт може блокуватися.</div>
      <div class="bmini">
        <div class="m"><div class="mv">${invUsed}/${invCap}</div><div class="ml">📦 комора</div></div>
        <div class="m"><div class="mv">${gUsed}/${GROUND_CAP_QTY}</div><div class="ml">🧺 на землі</div></div>
      </div>
      <div class="bacts">${upgradeBtn('barn', barnLvl, YARD_DEF.barn.levels)}<button class="bbtn secondary" onclick="switchTab('inventory')">Відкрити комору</button></div>
      <div class="bsmall">Вільно на землі: <b>${gLeft}</b> шт. (очищується через 10 хв).</div>
      ${groundList}
    </div>

    <div class="bcard">
      <div class="btop"><div class="bicon">🍳</div><div><div class="bname">Кухня</div><div class="bsmall">${kitDef.label}</div></div><div class="blvl">Рівень ${kitchenLvl}</div></div>
      <div class="bdesc">Обмежує одночасний крафт слотами. Базово 1 слот, апгрейдом — до 2–3.</div>
      <div class="bmini">
        <div class="m"><div class="mv">${(G.craftQueue||[]).length}/${getCraftSlots()}</div><div class="ml">⏳ у роботі</div></div>
        <div class="m"><div class="mv">${getCraftSlots()}</div><div class="ml">🍳 слоти крафту</div></div>
      </div>
      <div class="bacts">${upgradeBtn('kitchen', kitchenLvl, YARD_DEF.kitchen.levels)}<button class="bbtn secondary" onclick="switchTab('craft')">Крафт</button></div>
      <div class="bsmall">Коли слоти зайняті — новий рецепт не запускається.</div>
    </div>

    <div class="bcard">
      <div class="btop"><div class="bicon">🚚</div><div><div class="bname">Вантажівка</div><div class="bsmall">${trkDef.label}</div></div><div class="blvl">Рівень ${truckLvl}</div></div>
      <div class="bdesc">Відкриває “міські замовлення” (окремо від туриста). Чим вищий рівень — тим кращі нагороди і більше слотів.</div>
      <div class="bmini">
        <div class="m"><div class="mv">${isCityOrdersUnlocked() ? '✅' : '🔒'}</div><div class="ml">місто</div></div>
        <div class="m"><div class="mv">×${getTruckRewardMul().toFixed(2)}</div><div class="ml">💰 бонус</div></div>
      </div>
      <div class="bacts">${upgradeBtn('truck', truckLvl, YARD_DEF.truck.levels)}<button class="bbtn secondary" onclick="switchTab('orders')">До замовлень</button></div>
      ${nextReqLine(truckLvl, YARD_DEF.truck.levels)}
      <div class="bsmall">${isCityOrdersUnlocked()
        ? 'Міські замовлення активні у вкладці "Замовлення".'
        : 'Поки що вантажівка вимагає нові ресурси, яких ще нема в грі — це задумано.'}</div>
    </div>
  `;
}

function updateTopBar() {
  document.getElementById('coins').textContent = G.coins;
  document.getElementById('levelBadge').textContent = G.level;
  document.getElementById('waterStat').textContent = G.water;
  document.getElementById('maxWaterStat').textContent = G.maxWater;
  document.getElementById('dayNum').textContent = G.day;
  document.getElementById('topName').textContent = G.displayName;
  document.getElementById('topLevel').textContent = `Рівень ${G.level} • ${G.xp}/${G.xpNext} XP`;
  const invTotal = invCount();
  document.getElementById('invCount').textContent = invTotal;
  const capEl = document.getElementById('invCapStat');
  if (capEl) capEl.textContent = getInvCap();
  document.getElementById('sp').textContent = G.stats.planted;
  document.getElementById('sh').textContent = G.stats.harvested;
  document.getElementById('sw').textContent = G.stats.watered;
  document.getElementById('se').textContent = G.stats.earned;
  const invHint = document.getElementById('invCapHint');
  if (invHint) {
    const g = groundCount();
    invHint.textContent = `Місця: ${invTotal}/${getInvCap()} • На землі: ${g}/${GROUND_CAP_QTY} (10 хв)`;
  }
}

// ============================================================
// CROP SHOP
// ============================================================
function renderCropShop() {
  const el = document.getElementById('cropShop');
  el.innerHTML = '';
  CROPS.forEach(c => {
    const locked = c.unlockLevel && G.level < c.unlockLevel;
    const d = document.createElement('div');
    d.className = `shop-item${G.selectedCrop===c.id?' selected':''}${locked?' disabled':''}`;
    d.innerHTML = `<span class="ie">${c.emoji}</span><div>
      <div class="item-name">${c.name}${locked?` 🔒${c.unlockLevel}рвн`:''}</div>
      <div class="item-price">💰${c.cost} → 📦${c.givesAmt}${c.givesEmoji}</div>
      <div class="item-grow">⏱${c.time}сек</div></div>`;
    if (!locked) d.onclick = () => selectCrop(c.id);
    el.appendChild(d);
  });
}

function selectCrop(id) {
  G.selectedCrop = id;
  G.selectedTool = 'plant';
  document.querySelectorAll('.tool-btn').forEach(b=>b.classList.remove('selected'));
  renderCropShop();
  const c = CROPS.find(x=>x.id===id);
  if (c) setHint(`${c.emoji} ${c.name}: коштує ${c.cost}🪙, дає ${c.givesAmt}${c.givesEmoji} через ${c.time}сек. Полив прискорює на 30%!`);
}

function selectTool(tool) {
  G.selectedTool = tool;
  G.selectedCrop = null;
  document.querySelectorAll('.tool-btn').forEach(b=>b.classList.remove('selected'));
  document.getElementById('tool'+tool.charAt(0).toUpperCase()+tool.slice(1)).classList.add('selected');
  renderCropShop();
  const hints = {
    water:'💧 Клікай на посаджені клітинки для поливу — прискорює ріст!',
    harvest:'🌾 Клікай на мигаючі стиглі клітинки щоб зібрати врожай!',
    plow:'⛏ Клікай щоб видалити культуру (врожай втрачається!)',
    auto:'⚙️ Клікни на вільну розблоковану клітинку щоб налаштувати авто-поле!'
  };
  setHint(hints[tool]||'');
}

function setHint(t) { document.getElementById('hintBox').textContent = t; }

// ============================================================
// FARM GRID
// ============================================================
// ── Field unlock pricing (dynamic) ──
function getCellUnlockCost(index) {
  // First 7 free, then exponentially more expensive
  if (index < 7) return 0;
  const base = [100, 200, 350, 600, 1000, 1800, 3000, 5000, 8500, 14000, 22000, 35000, 55000, 85000, 130000, 200000, 300000, 450000, 700000, 1000000, 1500000, 2000000, 3000000, 5000000, 7500000, 10000000, 15000000, 22000000];
  return base[index - 7] || Math.round(500000 * Math.pow(1.6, index - 28));
}
function getCellUnlockLevel(index) {
  if (index < 7) return 1;
  const lvls = [1,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,11,12,13,14,15,16,17,18];
  return lvls[index - 7] || Math.floor((index - 7) / 2) + 1;
}
function isAutoField(cellIndex) {
  if (!G.autoFields) return false;
  return G.autoFields.some(af => af.cellIndex === cellIndex && af.active);
}
// Migration helper: fix auto_running cells on load
function migrateAutoFields() {
  if (!G || !G.autoFields) return;
  G.autoFields.forEach(af => {
    const cell = G.cells[af.cellIndex];
    if (cell && cell.state !== 'auto_running') {
      cell.state = 'auto_running';
      cell.crop = af.cropId;
    }
  });
}

function renderGrid() {
  const grid = document.getElementById('farmGrid');
  grid.innerHTML = '';
  if (!G.unlockedCells) G.unlockedCells = 7;
  G.cells.forEach((cell, i) => {
    const unlocked = cell.unlocked !== false && i < G.unlockedCells;
    const div = document.createElement('div');
    const isAuto = isAutoField(i);

    if (!unlocked) {
      const cost = getCellUnlockCost(i);
      const reqLvl = getCellUnlockLevel(i);
      const canBuy = G.coins >= cost && G.level >= reqLvl;
      div.className = 'cell locked-cell';
      div.innerHTML = `<div class="cell-lock-icon">🔒</div><div class="cell-lock-cost">${cost >= 1000 ? (cost/1000).toFixed(0)+'k' : cost}🪙</div>`;
      div.title = `Рвн.${reqLvl} • ${cost}🪙`;
      if (canBuy) { div.classList.add('can-unlock'); div.onclick = () => unlockCell(i); }
      grid.appendChild(div);
      return;
    }

    div.className = `cell ${cell.state}${cell.waterBonus?' watered':''}${isAuto?' auto-field':''}`;
    if (cell.pest && G.activeEvent?.id === 'pest') div.style.boxShadow = '0 0 0 3px #e74c3c, 0 0 8px rgba(231,76,60,.5)';
    else div.style.boxShadow = '';
    div.dataset.index = i;
    if (isAuto) div.title = '⚙️ Авто-поле';
    // auto_running state: big countdown timer
    if (cell.state === 'auto_running') {
      const af = (G.autoFields||[]).find(x => x.cellIndex === i && x.active);
      const crop = CROPS.find(c=>c.id===cell.crop);
      if (af && crop) {
        const totalDur = af.totalDuration || af.totalDurationMs || 1;
        const remaining = Math.max(0, totalDur - (Date.now() - af.startTime));
        const pct = Math.min(100, 100 - (remaining / totalDur * 100));
        const rm = Math.floor(remaining/60000), rs = Math.floor((remaining%60000)/1000);
        const timeStr = rm > 0 ? `${rm}хв ${rs}с` : `${rs}с`;
        const watered = cell.waterBonus;
        div.innerHTML = `<div style="font-size:.65rem;line-height:1.2;text-align:center;padding:2px 1px;">
          <div style="font-size:1rem">${crop.emoji}${watered ? '💧' : ''}${cell.pest ? '🐛' : ''}</div>
          <div data-countdown style="font-weight:900;color:#1a6fa8;font-size:.6rem;">⚙️ ${timeStr}</div>
          <div style="font-size:.52rem;color:#666;">×${af.totalCycles} циклів</div>
        </div><div class="prog"><div class="prog-fill" style="width:${pct.toFixed(1)}%;background:linear-gradient(90deg,#3498db,#1a6fa8)"></div></div>`;
      } else {
        div.textContent = crop ? crop.emoji : '⚙️';
      }
      div.onclick = () => openAutoFieldModal(i);
      grid.appendChild(div);
      return;
    }

    let content = cell.state === 'empty' ? (isAuto ? '⚙️' : '🟫') : cell.state === 'planted' ? '🌱' : cell.state === 'growing' ? '🌿' : '';
    if (cell.state === 'ready') {
      const crop = CROPS.find(c=>c.id===cell.crop);
      content = crop ? crop.emoji : '🌾';
    }
    if (cell.state !== 'empty' && cell.plantedAt && cell.state !== 'ready') {
      const crop = CROPS.find(c=>c.id===cell.crop);
      const elapsed = (Date.now()-cell.plantedAt)/1000;
      const growTime = cell.waterBonus ? crop.time*0.7 : crop.time;
      const pct = Math.min(100,(elapsed/growTime)*100);
      const pestBadge = cell.pest ? '<div style="position:absolute;top:1px;right:2px;font-size:.9rem;animation:pestWiggle 1s ease-in-out infinite">🐛</div>' : '';
      div.style.position = 'relative';
      div.innerHTML = `${pestBadge}${content}<div class="prog"><div class="prog-fill" style="width:${pct}%"></div></div>`;
    } else {
      div.style.position = cell.pest ? 'relative' : '';
      const pestBadge = cell.pest ? '<div style="position:absolute;top:1px;right:2px;font-size:.9rem;animation:pestWiggle 1s ease-in-out infinite">🐛</div>' : '';
      div.innerHTML = pestBadge + content;
    }
    div.onclick = () => cellClick(i);
    grid.appendChild(div);
  });
}

function unlockCell(i) {
  const cost = getCellUnlockCost(i);
  const reqLvl = getCellUnlockLevel(i);
  if (G.level < reqLvl) return setHint(`🔒 Потрібен рівень ${reqLvl}!`);
  if (G.coins < cost) return setHint(`💰 Потрібно ${cost}🪙 для розблокування!`);
  G.coins -= cost;
  G.cells[i].unlocked = true;
  if (i >= G.unlockedCells) G.unlockedCells = i + 1;
  addLog(`🔓 Розблоковано клітинку #${i+1} за ${cost}🪙!`);
  spawnParticles('🔓', window.innerWidth/2, window.innerHeight/2);
  updateTopBar(); renderGrid(); saveCurrentGame();
}

function cellClick(i) {
  const cell = G.cells[i];
  // Handle pest clicking
  if (cell.pest && G.activeEvent && G.activeEvent.id === 'pest') {
    cell.pest = false;
    G.activeEvent.cleared = (G.activeEvent.cleared || 0) + 1;
    spawnParticles('✨', window.innerWidth/2, window.innerHeight/2);
    addLog('🥊 Прогнав шкідника! ' + G.activeEvent.cleared + '/' + G.activeEvent.targets.length);
    renderGrid();
    renderEventBanner();
    if (G.activeEvent.cleared >= G.activeEvent.targets.length) {
      endEvent(true);
    }
    return;
  }
  if (cell.unlocked === false) return unlockCell(i);
  if (cell.state === 'auto_running') {
    // Allow watering auto-fields
    if (G.selectedTool === 'water') {
      if (cell.waterBonus) return setHint('Вже полито!');
      if (G.water <= 0) return setHint('Нема води!');
      G.water--; cell.waterBonus = true; G.stats.watered++;
      // Apply water bonus to auto-field: reduce remaining time by 30%
      const af = (G.autoFields||[]).find(x => x.cellIndex === i && x.active);
      if (af) {
        const remaining = Math.max(0, (af.totalDuration||af.totalDurationMs||1) - (Date.now() - af.startTime));
        const bonus = remaining * 0.3;
        af.startTime -= bonus; // shift startTime back = effectively less remaining
        af.waterBonus = true;
      }
      addLog('💧 Авто-поле поливено! Час скорочено на 30%');
      checkAchievement('water20', G.stats.watered);
      updateTopBar(); renderGrid(); saveCurrentGame();
      return;
    }
    openAutoFieldModal(i);
    return;
  }
  if (isAutoField(i)) { openAutoFieldModal(i); return; }
  const tool = G.selectedTool;
  if (tool === 'plant') {
    if (cell.state !== 'empty') return setHint('Скопай або збери спочатку!');
    const crop = CROPS.find(c=>c.id===G.selectedCrop);
    if (!crop) return setHint('Обери культуру!');
    if (G.level < crop.unlockLevel) return setHint(`🔒 ${crop.name} доступна з рівня ${crop.unlockLevel}!`);
    if (G.coins < crop.cost) return setHint(`Не вистачає монет! Потрібно ${crop.cost}🪙`);
    G.coins -= crop.cost;
    cell.state = 'planted'; cell.crop = crop.id;
    cell.plantedAt = Date.now();
    cell.waterBonus = !!(G.activeEvent && G.activeEvent.id === 'rain');
    G.stats.planted++;
    updateQuestProgress('plant', 1);
    addLog(`🌱 Посаджено ${crop.emoji} ${crop.name}`);
    checkAchievement('first_plant');
    setHint(`${crop.emoji} Посаджено! Зросте через ${crop.time}сек.`);
  } else if (tool === 'water') {
    if (cell.state==='empty'||cell.state==='ready') return setHint('Нема що поливати!');
    if (cell.waterBonus) return setHint('Вже полито!');
    if (G.water <= 0) return setHint('Нема води! Зачекай поповнення (кожні 5 сек).');
    G.water--; cell.waterBonus = true; G.stats.watered++;
    updateQuestProgress('water', 1);
    addLog('💧 Полито клітинку');
    setHint('💧 Ріст прискорено на 30%!');
    checkAchievement('water20', G.stats.watered);
  } else if (tool === 'harvest') {
    if (cell.state !== 'ready') return setHint('Ще не дозріло! Зачекай...');
    doHarvest(i); return;
  } else if (tool === 'plow') {
    if (cell.state === 'empty') return setHint('Тут вже порожньо!');
    cell.state='empty'; cell.crop=null; cell.plantedAt=null; cell.waterBonus=false;
    addLog('⛏ Клітинку скопано');
  } else if (tool === 'auto') {
    openAutoFieldModal(i); return;
  }
  updateTopBar(); renderGrid(); saveCurrentGame();
}

function doHarvest(i) {
  const cell = G.cells[i];
  if (cell.state === 'auto_running') return;
  if (cell.state !== 'ready') return;
  const crop = CROPS.find(c=>c.id===cell.crop);
  if (!crop) return;
  let amt = cell.waterBonus ? crop.givesAmt+1 : crop.givesAmt;
  if (cell.pestFailed) { amt = Math.max(1, Math.floor(amt * 0.8)); cell.pestFailed = false; }
  if (!addToInventory(crop.gives, amt, {source:'harvest'})) {
    addLog(`📦 Комора переповнена! Апгрейдни амбар у "Дворі" або підніми речі з землі.`);
    return;
  }
  const harvestedCropId = cell.crop;
  cell.state='empty'; cell.crop=null; cell.plantedAt=null; cell.waterBonus=false;
  G.stats.harvested++;
  addXP(15);
  checkAchievement('first_harvest');
  updateQuestProgress('harvest', 1, harvestedCropId);
  addLog(`${crop.emoji} Зібрано ${crop.name}! +${amt}${PRODUCTS[crop.gives].emoji} в комору`);
  showFloatText(`+${amt}${PRODUCTS[crop.gives].emoji}`, event);
  checkAchievement('harvest10', G.stats.harvested);
  checkAchievement('harvest50', G.stats.harvested);
  updateTopBar(); renderGrid();
  if (currentTab==='inventory') renderInventory();
  renderFeedInventory();
  saveCurrentGame();
}

function harvestAll() {
  let count = 0;
  G.cells.forEach((cell, i) => { if (cell.state==='ready' && !isAutoField(i) && cell.state !== 'auto_running') { doHarvest(i); count++; } });
  if (!count) setHint('Нема стиглих культур!');
  else addLog(`🌾 Зібрано ${count} культур!`);
}


// ============================================================
// ANIMALS
// ============================================================
function renderAnimalShop() {
  const el = document.getElementById('animalShopList');
  el.innerHTML = '';
  ANIMALS_DEF.forEach(a => {
    const locked = a.unlockLevel && G.level < a.unlockLevel;
    const d = document.createElement('div');
    d.className = `animal-shop-item${locked?' disabled':''}`;
    d.innerHTML = `<span class="aie">${a.emoji}</span><div>
      <div class="item-name">${a.name}${locked?` 🔒${a.unlockLevel}рвн`:''}</div>
      <div class="item-price">💰${a.cost}🪙</div>
      <div class="item-grow">${PRODUCTS[a.produces]?.emoji||'?'} кожні ${a.produceTime}с</div></div>`;
    if (!locked) d.onclick = () => buyAnimal(a.id);
    el.appendChild(d);
  });
}

function renderFeedInventory() {
  const el = document.getElementById('feedInventory');
  const feedable = Object.entries(G.inventory)
    .filter(([k,v]) => v > 0 && PRODUCTS[k] && PRODUCTS[k].feedValue > 0 && PRODUCTS[k].category==='crop');
  if (!feedable.length) {
    el.innerHTML = '<div style="font-size:.8rem;color:#888;">Зберіть врожай щоб годувати тварин!</div>';
    return;
  }
  el.innerHTML = feedable.map(([k,v]) => `
    <div style="display:flex;align-items:center;gap:6px;padding:4px 0;">
      <span style="font-size:1.3rem;">${PRODUCTS[k].emoji}</span>
      <span style="font-size:.82rem;font-weight:700;">${PRODUCTS[k].name}</span>
      <span style="margin-left:auto;font-weight:900;color:#f39c12;">${v}</span>
    </div>`).join('');
}

function buyAnimal(id) {
  const def = ANIMALS_DEF.find(a=>a.id===id);
  if (!def) return;
  // Check house capacity
  const house = HOUSES_DEF.find(h => h.animalId === id);
  if (house) {
    const hs = getHouseState(house.id);
    if (!hs || !hs.built) return addLog(`🏠 Спочатку побудуй ${house.name} у вкладці "Будиночки"!`);
    const capacity = house.levels[hs.level - 1].capacity;
    if (countAnimals(id) >= capacity) return addLog(`🚫 ${house.name} заповнений (${capacity}/${capacity})! Апгрейдуй у вкладці "Будиночки".`);
  }
  if (G.coins < def.cost) return addLog(`❌ Не вистачає монет для ${def.name}!`);
  G.coins -= def.cost;
  G.animalIdCounter = (G.animalIdCounter||0)+1;
  const animal = {
    uid: G.animalIdCounter,
    type: def.id,
    name: def.name + ' #' + G.animalIdCounter,
    happiness: 100,
    lastFed: Date.now(),
    lastProduced: Date.now(),
    pendingProducts: 0,
  };
  G.animals.push(animal);
  G.stats.animalsBought = (G.stats.animalsBought||0)+1;
  addLog(`${def.emoji} Куплено ${def.name}! Годуй щоб отримувати продукти!`);
  checkAchievement('first_animal');
  checkAchievement('animals5', G.animals.length);
  updateTopBar(); renderAnimals(); saveCurrentGame();
}

// ============================================================
// ANIMATED BARN ENGINE
// ============================================================
const animalWalkState = {}; // uid -> {x, y, vx, vy, state, stateTimer, flip}
let barnW = 600, barnH = 120;
let barnAnimFrame = null;
let selectedAnimalUid = null;

function initBarnScene() {
  // Build fence
  const fence = document.getElementById('barnFence');
  if (!fence) return;
  fence.innerHTML = '';
  const W = fence.offsetWidth || 700;
  const postCount = Math.floor(W / 55);
  for (let i = 0; i < postCount; i++) {
    const post = document.createElement('div');
    post.className = 'fence-post';
    post.style.cssText = `left:${i*55+10}px;height:32px;`;
    fence.appendChild(post);
  }
  const rail1 = document.createElement('div');
  rail1.className = 'fence-rail';
  rail1.style.bottom = '22px';
  fence.appendChild(rail1);
  const rail2 = document.createElement('div');
  rail2.className = 'fence-rail';
  rail2.style.bottom = '10px';
  fence.appendChild(rail2);

  // Grass patches
  const grass = document.getElementById('barnGrass');
  if (grass) {
    grass.innerHTML = ['🌿','🌱','🍀','🌿','🌱','🍀','🌿','🌱','🍀','🌿','🌱']
      .map((g,i) => `<span class="grass-patch" style="left:${i*9+Math.random()*4}%;font-size:${.9+Math.random()*.5}rem">${g}</span>`)
      .join('') +
      ['🌼','🌸','🌺','🌼','🌸']
      .map((f,i) => `<span class="flower-deco" style="left:${15+i*18}%;font-size:.9rem">${f}</span>`)
      .join('');
  }

  // Size
  const scene = document.getElementById('barnScene');
  if (scene) {
    barnW = scene.offsetWidth - 10;
    barnH = 100;
  }

  // Init positions for all animals
  G.animals.forEach(a => {
    if (!animalWalkState[a.uid]) {
      animalWalkState[a.uid] = {
        x: 80 + Math.random() * (barnW - 180),
        y: 10 + Math.random() * 50,
        vx: (Math.random() - .5) * 1.2,
        vy: 0,
        state: 'walk',
        stateTimer: Math.random() * 180,
        flip: Math.random() > .5,
        eatTimer: 0,
        showBubble: false,
        bubbleText: '',
        bubbleTimer: 0,
      };
    }
  });
}

function renderAnimals() {
  const layer = document.getElementById('barnAnimalsLayer');
  const noAnim = document.getElementById('noAnimalsBarn');
  if (!layer) return;

  if (!G.animals.length) {
    layer.innerHTML = '';
    if (noAnim) noAnim.style.display = 'flex';
    if (barnAnimFrame) { cancelAnimationFrame(barnAnimFrame); barnAnimFrame = null; }
    renderSelectedAnimalInfo(null);
    return;
  }
  if (noAnim) noAnim.style.display = 'none';

  // Start anim loop if not running
  if (!barnAnimFrame) {
    initBarnScene();
    startBarnLoop();
  }
  renderSelectedAnimalInfo(selectedAnimalUid);
}

function startBarnLoop() {
  function loop() {
    if (!G || !G.animals.length) { barnAnimFrame = null; return; }
    updateBarnAnimations();
    barnAnimFrame = requestAnimationFrame(loop);
  }
  barnAnimFrame = requestAnimationFrame(loop);
}

function updateBarnAnimations() {
  const layer = document.getElementById('barnAnimalsLayer');
  if (!layer) return;

  G.animals.forEach(animal => {
    const def = ANIMALS_DEF.find(a => a.id === animal.type);
    let ws = animalWalkState[animal.uid];
    if (!ws) {
      animalWalkState[animal.uid] = ws = {
        x: 80 + Math.random() * (barnW - 180),
        y: 10 + Math.random() * 50,
        vx: (Math.random() - .5) * 1.2,
        vy: 0,
        state: 'walk',
        stateTimer: Math.random() * 200,
        flip: false,
        eatTimer: 0,
        showBubble: false,
        bubbleText: '',
        bubbleTimer: 0,
      };
    }

    ws.stateTimer--;
    if (ws.bubbleTimer > 0) ws.bubbleTimer--;
    else ws.showBubble = false;

    // State machine
    if (ws.stateTimer <= 0) {
      const roll = Math.random();
      if (animal.happiness < 20) {
        ws.state = 'scared';
        ws.stateTimer = 60;
        ws.showBubble = true;
        ws.bubbleText = '😭 Голодна!';
        ws.bubbleTimer = 80;
      } else if (roll < .35) {
        ws.state = 'walk';
        ws.vx = (Math.random() - .5) * 1.8;
        ws.stateTimer = 80 + Math.random() * 120;
        ws.flip = ws.vx < 0;
      } else if (roll < .55) {
        ws.state = 'idle';
        ws.vx = 0;
        ws.stateTimer = 60 + Math.random() * 100;
      } else if (roll < .7) {
        ws.state = 'sleep';
        ws.vx = 0;
        ws.stateTimer = 100 + Math.random() * 150;
        ws.showBubble = true;
        ws.bubbleText = '💤 Сплю...';
        ws.bubbleTimer = 120;
      } else if (roll < .85) {
        ws.state = 'eat';
        ws.vx = 0;
        ws.stateTimer = 50 + Math.random() * 80;
        ws.showBubble = true;
        ws.bubbleText = '😋 Ням-ням!';
        ws.bubbleTimer = 90;
      } else {
        ws.state = 'happy';
        ws.stateTimer = 40;
        ws.showBubble = true;
        ws.bubbleText = '🎉 Yay!';
        ws.bubbleTimer = 60;
      }
    }

    // Move
    if (ws.state === 'walk') {
      ws.x += ws.vx;
      // Bounce off walls
      if (ws.x < 60) { ws.x = 60; ws.vx = Math.abs(ws.vx); ws.flip = false; }
      if (ws.x > barnW - 80) { ws.x = barnW - 80; ws.vx = -Math.abs(ws.vx); ws.flip = true; }
    }

    // Render DOM element
    let el = document.getElementById('wa-'+animal.uid);
    if (!el) {
      el = document.createElement('div');
      el.className = 'walking-animal';
      el.id = 'wa-'+animal.uid;
      el.onclick = (e) => { e.stopPropagation(); selectAnimalInBarn(animal.uid); };
      layer.appendChild(el);
    }

    const isSelected = selectedAnimalUid === animal.uid;
    const moodEmoji = animal.happiness > 70 ? '' : animal.happiness > 40 ? '' : '😢';
    const stateClass = ws.state === 'walk' ? 'walking-anim' :
                       ws.state === 'sleep' ? 'sleeping' :
                       ws.state === 'eat' ? 'eating' :
                       ws.state === 'happy' ? 'happy-anim' :
                       ws.state === 'scared' ? 'scared' : '';

    const hpColor = animal.happiness > 60 ? '#2ecc71' : animal.happiness > 30 ? '#f39c12' : '#e74c3c';
    const scaleExtra = isSelected ? 'scale(1.18)' : 'scale(1)';

    el.style.cssText = `left:${ws.x}px;bottom:${ws.y}px;transform:${scaleExtra};`;

    el.innerHTML = `
      <div class="wa-body ${stateClass}">
        ${ws.showBubble ? `<div class="wa-bubble" style="color:${animal.happiness<30?'#e74c3c':'#1a472a'}">${ws.bubbleText}</div>` : ''}
        ${animal.pendingProducts > 0 ? `<div class="produce-sparkle">${PRODUCTS[def.produces]?.emoji||'✨'}</div>` : ''}
        <div class="wa-status">${moodEmoji}</div>
        <div class="wa-name-tag"${isSelected?' style="background:#d4f7b0;color:#1a472a;border:1.5px solid #52b788;"':''}>${animal.name.split(' ')[0]}</div>
        <span class="wa-emoji" style="transform:scaleX(${ws.flip ? -1 : 1})">${def.emoji}</span>
        <div class="wa-shadow"></div>
        <div style="width:30px;height:3px;background:#eee;border-radius:2px;overflow:hidden;margin-top:1px;">
          <div style="height:100%;background:${hpColor};width:${animal.happiness}%;border-radius:2px;"></div>
        </div>
      </div>`;
  });

  // Remove orphaned elements
  layer.querySelectorAll('.walking-animal').forEach(el => {
    const uid = parseInt(el.id.replace('wa-',''));
    if (!G.animals.find(a => a.uid === uid)) el.remove();
  });
}

function selectAnimalInBarn(uid) {
  selectedAnimalUid = uid;
  const animal = G.animals.find(a => a.uid === uid);
  const def = ANIMALS_DEF.find(a => a.id === animal.type);
  // Trigger happy bounce
  const ws = animalWalkState[uid];
  if (ws) { ws.state = 'happy'; ws.stateTimer = 40; ws.showBubble = true; ws.bubbleText = '👋 Привіт!'; ws.bubbleTimer = 60; }
  renderSelectedAnimalInfo(uid);
  document.getElementById('animalHint').textContent = `${def.emoji} ${animal.name} обрана! Стан: ${animal.happiness}% щастя.`;
}

function renderSelectedAnimalInfo(uid) {
  const box = document.getElementById('selectedAnimalInfo');
  if (!box) return;
  if (!uid) { box.innerHTML = `<div style="text-align:center;color:#999;font-size:.85rem;padding:20px 0;"><div style="font-size:3rem;">🐾</div>Клікни на тваринку щоб побачити деталі</div>`; return; }
  const animal = G.animals.find(a => a.uid === uid);
  if (!animal) { selectedAnimalUid = null; renderSelectedAnimalInfo(null); return; }
  const def = ANIMALS_DEF.find(a => a.id === animal.type);
  const prod = PRODUCTS[def.produces];
  const hpColor = animal.happiness > 60 ? '#2ecc71' : animal.happiness > 30 ? '#f39c12' : '#e74c3c';
  const moodText = animal.happiness > 70 ? '😊 Щаслива' : animal.happiness > 40 ? '😐 Нормально' : animal.happiness > 15 ? '😢 Голодна' : '😭 Критично!';
  const prodSinceMin = Math.floor((Date.now() - animal.lastProduced) / 1000);
  const nextIn = Math.max(0, def.produceTime - prodSinceMin);

  box.innerHTML = `
    <div class="sel-anim-header">
      <span class="sel-anim-emoji">${def.emoji}</span>
      <div><div class="sel-anim-name">${animal.name}</div><div class="sel-anim-type">${def.name}</div></div>
    </div>
    <div class="anim-stat-row">
      <span class="anim-stat-label">❤️ Щастя</span>
      <span style="font-weight:900;color:${hpColor};font-size:.9rem;">${animal.happiness}%</span>
    </div>
    <div style="height:8px;background:#eee;border-radius:5px;margin:-4px 0 10px;overflow:hidden;">
      <div style="height:100%;background:${hpColor};width:${animal.happiness}%;border-radius:5px;transition:width .5s;"></div>
    </div>
    <div style="font-size:.78rem;color:#555;line-height:1.8;margin-bottom:6px;">
      <div>${moodText}</div>
      <div>${prod ? `${prod.emoji} Виробляє: ${prod.name}` : ''}</div>
      <div>📦 Готово: <b>${animal.pendingProducts}</b></div>
      <div>⏱ Наступне: ${nextIn > 0 ? `~${nextIn}с` : '⚡ зараз!'}</div>
    </div>
    ${animal.pendingProducts > 0 ? `<button class="collect-big-btn" id="btnCollectSel">📦 Зібрати ${prod?prod.emoji:''} (${animal.pendingProducts})</button>` : ''}
    <button class="feed-big-btn" id="btnFeedSel">🥕 Годувати</button>
    <button class="release-btn" id="btnReleaseSel">🔓 Відпустити</button>`;
  // bind buttons
  const bFeed = document.getElementById('btnFeedSel');
  if (bFeed) bFeed.addEventListener('click', () => openFeedModal(uid));
  const bCol = document.getElementById('btnCollectSel');
  if (bCol) bCol.addEventListener('click', () => collectProduct(uid));
  const bRel = document.getElementById('btnReleaseSel');
  if (bRel) bRel.addEventListener('click', () => releaseAnimal(uid));
}

function releaseAnimal(uid) {
  const animal = G.animals.find(a => a.uid === uid);
  if (!animal) return;
  const def = ANIMALS_DEF.find(a => a.id === animal.type);
  window._confirmCb = () => {
    G.animals = G.animals.filter(a => a.uid !== uid);
    delete animalWalkState[uid];
    const el = document.getElementById("wa-"+uid);
    if (el) el.remove();
    if (selectedAnimalUid === uid) { selectedAnimalUid = null; renderSelectedAnimalInfo(null); }
    addLog(def.emoji + " " + animal.name + " відпущена");
    if (!G.animals.length && barnAnimFrame) { cancelAnimationFrame(barnAnimFrame); barnAnimFrame = null; }
    renderAnimals(); updateTopBar(); saveCurrentGame();
  };
  showConfirmModal("Відпустити " + def.emoji + " " + animal.name + "?", "Тварину не можна повернути.");
}

function collectAllProducts() {
  let count = 0;
  G.animals.forEach(a => {
    if (a.pendingProducts > 0) { collectProduct(a.uid); count++; }
  });
  if (!count) { document.getElementById('animalHint').textContent = '📦 Нема що збирати поки що!'; }
  else spawnParticles('📦', window.innerWidth/2, window.innerHeight/2);
}

function feedAllAnimals() {
  if (!G.houseFeed) G.houseFeed = {};
  let fed = 0;
  G.animals.forEach(animal => {
    if (animal.happiness >= 80) return;
    const house = HOUSES_DEF.find(h => h.animalId === animal.type);
    const preferred = house ? G.houseFeed[house.id] : null;
    // Try preferred first, then any available
    let key = null;
    if (preferred && G.inventory[preferred] > 0) {
      key = preferred;
    } else {
      const fallback = Object.entries(G.inventory).find(([k,v]) => v>0 && PRODUCTS[k]?.feedValue>0 && PRODUCTS[k]?.category==='crop');
      if (fallback) key = fallback[0];
    }
    if (key) { feedAnimal(animal.uid, key); fed++; }
  });
  if (!fed) { document.getElementById('animalHint').textContent = '🥕 Нема голодних тварин або корму!'; }
}

function spawnParticles(emoji, x, y) {
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emoji;
    p.style.cssText = `left:${x + (Math.random()-0.5)*80}px;top:${y + (Math.random()-0.5)*40}px;animation-delay:${Math.random()*.3}s`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

function showConfirmModal(title, desc) {
  const modal = document.getElementById('modalBox');
  modal.innerHTML = `<h3>${title}</h3><p>${desc}</p>
    <div class="modal-btns">
      <button class="modal-btn secondary" id="modalCancel">Скасувати</button>
      <button class="modal-btn primary" id="modalConfirm">Підтвердити</button>
    </div>`;
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalConfirm').addEventListener('click', () => {
    closeModal();
    if (window._confirmCb) { window._confirmCb(); window._confirmCb = null; }
  });
  document.getElementById('modalOverlay').style.display = 'flex';
}

function openFeedModal(uid) {
  const animal = G.animals.find(a=>a.uid===uid);
  if (!animal) return;
  const def = ANIMALS_DEF.find(a=>a.id===animal.type);
  const feedable = Object.entries(G.inventory)
    .filter(([k,v]) => v > 0 && PRODUCTS[k] && PRODUCTS[k].feedValue > 0 && PRODUCTS[k].category==='crop');

  const modal = document.getElementById('modalBox');
  if (!feedable.length) {
    modal.innerHTML = `<h3>${def.emoji} Годувати ${animal.name}</h3>
      <p>😢 В тебе нема їжі для тварин! Збери врожай з поля.</p>
      <div class="modal-btns"><button class="modal-btn secondary" id="modalNoFoodClose">Зрозуміло</button></div>`;
    document.getElementById('modalNoFoodClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').style.display='flex'; return;
  }

  modal.innerHTML = `<h3>${def.emoji} Годувати ${animal.name}</h3>
    <p>Поточне щастя: ${animal.happiness}% • Потрібно корму: ${def.feedCost} очок</p>
    <div class="feed-select">
      ${feedable.map(([k,v]) => {
        const p = PRODUCTS[k];
        return `<div class="feed-option" data-feed="${k}" data-uid="${uid}">
          <span class="fo-emoji">${p.emoji}</span>
          <div class="fo-name">${p.name}</div>
          <div class="fo-qty">в наявності: ${v} | +${p.feedValue} щастя</div>
        </div>`;
      }).join('')}
    </div>
    <div class="modal-btns"><button class="modal-btn secondary" id="modalFeedCancel">Скасувати</button></div>`;
  document.getElementById('modalFeedCancel').addEventListener('click', closeModal);
  document.querySelectorAll('.feed-option').forEach(el => {
    el.addEventListener('click', () => { feedAnimal(parseInt(el.dataset.uid), el.dataset.feed); closeModal(); });
  });
  document.getElementById('modalOverlay').style.display='flex';
}

function feedAnimal(uid, productId) {
  const animal = G.animals.find(a=>a.uid===uid);
  if (!animal) return;
  const def = ANIMALS_DEF.find(a=>a.id===animal.type);
  if (!G.inventory[productId] || G.inventory[productId] <= 0) return addLog('Немає їжі!');
  G.inventory[productId]--;
  if (G.inventory[productId] <= 0) delete G.inventory[productId];
  const feedVal = PRODUCTS[productId].feedValue;
  animal.happiness = Math.min(100, animal.happiness + feedVal);
  animal.lastFed = Date.now();
  addLog(`${def.emoji} ${animal.name} нагодовано ${PRODUCTS[productId].emoji}! +${feedVal}% щастя`);
  // Trigger eat animation in barn
  const ws = animalWalkState[uid];
  if (ws) { ws.state = "eat"; ws.stateTimer = 50; ws.showBubble = true; ws.bubbleText = "😋 Ням!"; ws.bubbleTimer = 70; }
  updateTopBar(); renderFeedInventory(); renderSelectedAnimalInfo(uid);
  if (currentTab==='inventory') renderInventory();
  saveCurrentGame();
}

function collectProduct(uid) {
  const animal = G.animals.find(a=>a.uid===uid);
  if (!animal || animal.pendingProducts <= 0) return;
  const def = ANIMALS_DEF.find(a=>a.id===animal.type);
  const prod = def.produces;
  const amt = animal.pendingProducts;
  if (!addToInventory(prod, amt, {source:'animal'})) {
    addLog(`📦 Комора переповнена! Апгрейдни амбар у "Дворі" або підніми речі з землі.`);
    return;
  }
  animal.pendingProducts = 0;
  G.stats.productsCollected = (G.stats.productsCollected||0)+amt;
  addLog(`${def.emoji} Зібрано ${amt}x${PRODUCTS[prod]?.emoji||'?'} від ${animal.name}!`);
  showFloatText(`+${amt}${PRODUCTS[prod]?.emoji||'?'}`, null, true);
  updateTopBar(); renderAnimals();
  if (currentTab==='inventory') renderInventory();
  saveCurrentGame();
}

function closeModal() { document.getElementById('modalOverlay').style.display='none'; }

// ============================================================
// INVENTORY
// ============================================================
// ============================================================
// HOUSES
// ============================================================
// ============================================================
// AUTO-FIELD SYSTEM
// ============================================================
let _autoModalCrop = null;
let _autoModalCell = null;

function openAutoFieldModal(cellIndex) {
  const cell = G.cells[cellIndex];
  if (!cell || cell.unlocked === false) return;
  if (!G.autoFields) G.autoFields = [];
  const existing = G.autoFields.find(af => af.cellIndex === cellIndex);
  const modal = document.getElementById('modalBox');

  if (existing && existing.active) {
    const crop = CROPS.find(c => c.id === existing.cropId);
    const outProd = crop ? PRODUCTS[crop.gives] : null;
    const totalDur = existing.totalDuration || existing.totalDurationMs || 1;
    const elapsed = Date.now() - existing.startTime;
    const remaining = Math.max(0, totalDur - elapsed);
    const remainSec = Math.ceil(remaining / 1000);
    const rm = Math.floor(remainSec / 60), rs = remainSec % 60;
    const pct = Math.min(100, elapsed / totalDur * 100);

    // How many cycles fully done so far
    const cycleDur = existing.cycleDuration || (totalDur / existing.totalCycles);
    const cyclesDone = Math.min(existing.totalCycles, Math.floor(elapsed / cycleDur));
    const collectedAmt = cyclesDone * (crop ? crop.givesAmt : 0);
    const remainingCycles = existing.totalCycles - cyclesDone;

    // Refund calc: 50% of remaining cycles cost + already-done items
    const costPerCycle = crop ? crop.cost : 0;
    const moneyRefund = Math.floor(remainingCycles * costPerCycle * 0.5);
    const canWater = !existing.waterBonus && G.water > 0;
    const cell = G.cells[cellIndex];
    const alreadyWatered = cell && cell.waterBonus;

    modal.innerHTML = `
      <h3>⚙️ Авто-поле #${cellIndex+1}</h3>
      <div style="display:flex;align-items:center;gap:12px;margin:10px 0;">
        <span style="font-size:3rem;">${crop ? crop.emoji : '🌱'}</span>
        <div>
          <div style="font-family:'Fredoka One','Trebuchet MS',system-ui,sans-serif;font-size:1.1rem;color:#1a472a;">${crop ? crop.name : ''}</div>
          <div style="font-size:.82rem;color:#888;">Всього ${existing.totalCycles} циклів</div>
        </div>
      </div>

      <div style="height:14px;background:#eee;border-radius:8px;overflow:hidden;margin-bottom:6px;">
        <div style="height:100%;background:linear-gradient(90deg,#52b788,#f39c12);width:${pct.toFixed(1)}%;border-radius:8px;transition:width .5s;"></div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:10px 0;">
        <div style="background:#f0f7f0;border-radius:10px;padding:8px;text-align:center;">
          <div style="font-size:1.2rem;font-weight:900;color:#e67e22;">${rm > 0 ? rm+'хв '+rs+'с' : rs+'с'}</div>
          <div style="font-size:.7rem;color:#888;">⏱ Залишилось</div>
        </div>
        <div style="background:#f0f7f0;border-radius:10px;padding:8px;text-align:center;">
          <div style="font-size:1.2rem;font-weight:900;color:#27ae60;">${cyclesDone} / ${existing.totalCycles}</div>
          <div style="font-size:.7rem;color:#888;">✅ Циклів готово</div>
        </div>
        <div style="background:#fff8e1;border-radius:10px;padding:8px;text-align:center;">
          <div style="font-size:1.2rem;font-weight:900;color:#27ae60;">${collectedAmt} ${outProd ? outProd.emoji : ''}</div>
          <div style="font-size:.7rem;color:#888;">📦 Вже готово</div>
        </div>
        <div style="background:#fff8e1;border-radius:10px;padding:8px;text-align:center;">
          <div style="font-size:1.2rem;font-weight:900;color:#3498db;">${existing.totalCycles * (crop ? crop.givesAmt : 0)} ${outProd ? outProd.emoji : ''}</div>
          <div style="font-size:.7rem;color:#888;">🎯 Всього отримаєш</div>
        </div>
      </div>

      ${alreadyWatered
        ? `<div style="background:#e3f2fd;border-radius:10px;padding:8px;text-align:center;font-size:.85rem;color:#1a6fa8;margin-bottom:10px;">💧 Поле вже поливано — час скорочено на 30%!</div>`
        : `<button id="modalAutoWater" ${G.water <= 0 ? 'disabled style="background:#ccc"' : ''} style="width:100%;padding:9px;border:none;border-radius:10px;background:linear-gradient(135deg,#3498db,#1a6fa8);color:#fff;font-family:'Fredoka One','Trebuchet MS',system-ui,sans-serif;font-size:.95rem;cursor:pointer;margin-bottom:8px;">
          💧 Полити (скоротити час на 30%) — є ${G.water} 💧
        </button>`
      }

      <div style="background:#ffeaea;border-radius:10px;padding:8px;font-size:.8rem;color:#c0392b;margin-bottom:10px;">
        🛑 Якщо зупинити: отримаєш <b>${collectedAmt} ${outProd ? outProd.emoji : ''}</b> + повернеться <b>${moneyRefund}🪙</b> (50% за незакінчені цикли)
      </div>

      <div class="modal-btns">
        <button class="modal-btn secondary" id="modalAutoClose">Закрити</button>
        <button class="modal-btn primary" id="modalAutoStop" style="background:linear-gradient(135deg,#e74c3c,#c0392b);">🛑 Зупинити і забрати</button>
      </div>`;

    document.getElementById('modalAutoClose').addEventListener('click', closeModal);
    document.getElementById('modalAutoStop').addEventListener('click', () => {
      stopAutoFieldWithPartialHarvest(cellIndex);
      closeModal();
    });
    const waterBtn = document.getElementById('modalAutoWater');
    if (waterBtn) {
      waterBtn.addEventListener('click', () => {
        if (G.water <= 0) return;
        G.water--;
        const af = G.autoFields.find(x => x.cellIndex === cellIndex && x.active);
        if (af) {
          const totalD = af.totalDuration || af.totalDurationMs || 1;
          const rem = Math.max(0, totalD - (Date.now() - af.startTime));
          af.startTime -= rem * 0.3;
          af.waterBonus = true;
        }
        const c2 = G.cells[cellIndex];
        if (c2) c2.waterBonus = true;
        G.stats.watered++;
        checkAchievement('water20', G.stats.watered);
        addLog('💧 Авто-поле поливано! Час скорочено на 30%');
        updateTopBar(); saveCurrentGame();
        closeModal();
        openAutoFieldModal(cellIndex);
      });
    }
    document.getElementById('modalOverlay').style.display = 'flex';
    return;
  }

  _autoModalCrop = G.selectedCrop || 'wheat';
  _autoModalCell = cellIndex;
  renderAutoFieldModal(cellIndex);
  document.getElementById('modalOverlay').style.display = 'flex';
}

function renderAutoFieldModal(cellIndex) {
  const modal = document.getElementById('modalBox');
  const crop = CROPS.find(c => c.id === _autoModalCrop) || CROPS[0];
  const budgetInput = modal.querySelector('#autobudget');
  const defaultBudget = crop.cost * 5;
  const budget = budgetInput ? Math.max(crop.cost, parseInt(budgetInput.value) || defaultBudget) : defaultBudget;
  const cycles = Math.max(1, Math.floor(budget / crop.cost));
  const actualCost = cycles * crop.cost;
  const totalSec = cycles * crop.time;
  const mins = Math.floor(totalSec / 60), secs = totalSec % 60;
  const timeStr = mins > 0 ? (mins + 'хв ' + (secs > 0 ? secs+'с' : '')) : (secs + 'с');
  const totalOutput = cycles * crop.givesAmt;
  const outProd = PRODUCTS[crop.gives];
  const canAfford = G.coins >= actualCost;

  const cropOpts = CROPS.map(c => {
    const locked = G.level < c.unlockLevel;
    return `<div class="auto-crop-opt${c.id === _autoModalCrop ? ' selected' : ''}${locked ? ' locked-opt' : ''}" data-autocrop="${c.id}">
      <div style="font-size:1.8rem">${c.emoji}</div>
      <div style="font-size:.72rem;font-weight:800">${c.name}</div>
      <div style="color:#888;font-size:.62rem">${c.cost}🪙 • ${c.time}с</div>
      ${locked ? '<div style="color:#e74c3c;font-size:.6rem">🔒 Рвн.'+c.unlockLevel+'</div>' : ''}
    </div>`;
  }).join('');

  modal.innerHTML = `<h3>⚙️ Авто-поле #${cellIndex+1}</h3>
    <p style="font-size:.78rem;color:#666;margin-bottom:8px;">Вклади монети — поле саме виросте і збере весь врожай одним великим таймером!</p>
    <div class="auto-modal-crop-grid">${cropOpts}</div>
    <div class="auto-input-row">
      <label>💰 Інвестиція:</label>
      <input type="number" id="autobudget" value="${budget}" min="${crop.cost}" step="${crop.cost}"
        style="width:130px;padding:7px 10px;border-radius:8px;border:2px solid #d4edda;font-size:1.1rem;font-weight:800;text-align:center;">
      <span style="color:#888;font-size:.8rem;">🪙</span>
    </div>
    <div class="auto-preview-box">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:center;">
        <div style="background:rgba(82,183,136,.15);border-radius:10px;padding:10px;border:2px solid #52b788;">
          <div style="font-size:1.8rem">${crop.emoji}</div>
          <div style="font-weight:800;color:#1a472a;font-size:1.15rem">${cycles} циклів</div>
          <div style="font-size:.7rem;color:#888;">по ${crop.cost}🪙</div>
        </div>
        <div style="background:rgba(243,156,18,.15);border-radius:10px;padding:10px;border:2px solid #f39c12;">
          <div style="font-size:1.8rem">⏱</div>
          <div style="font-weight:800;color:#e67e22;font-size:1.15rem">${timeStr}</div>
          <div style="font-size:.7rem;color:#888;">загальний час</div>
        </div>
        <div style="background:rgba(231,76,60,.12);border-radius:10px;padding:10px;border:2px solid #e74c3c;">
          <div style="font-size:1.8rem">💸</div>
          <div style="font-weight:800;color:#c0392b;font-size:1.15rem">${actualCost}🪙</div>
          <div style="font-size:.7rem;color:#888;">витратиш (є ${G.coins})</div>
        </div>
        <div style="background:rgba(52,152,219,.12);border-radius:10px;padding:10px;border:2px solid #3498db;">
          <div style="font-size:1.8rem">${outProd ? outProd.emoji : '📦'}</div>
          <div style="font-weight:800;color:#1565c0;font-size:1.15rem">${totalOutput} ${outProd ? outProd.name : ''}</div>
          <div style="font-size:.7rem;color:#888;">отримаєш</div>
        </div>
      </div>
      <div style="margin-top:8px;font-size:.85rem;font-weight:800;text-align:center;padding:7px 10px;border-radius:8px;
        background:${canAfford ? 'rgba(39,174,96,.12)' : 'rgba(231,76,60,.12)'};
        color:${canAfford ? '#27ae60' : '#e74c3c'}">
        ${canAfford ? '✅ Вистачає! Можна запускати.' : '❌ Не вистачає ' + (actualCost - G.coins) + '🪙'}
      </div>
    </div>
    <div class="modal-btns" style="margin-top:12px;">
      <button class="modal-btn secondary" id="modalAutoCancel">Скасувати</button>
      <button class="modal-btn primary" id="modalAutoStart" ${!canAfford ? 'disabled style="background:#ccc;cursor:not-allowed"' : ''}>
        🚀 Запустити! (-${actualCost}🪙)
      </button>
    </div>`;

  modal.querySelectorAll('[data-autocrop]').forEach(el => {
    el.addEventListener('click', () => {
      const c = CROPS.find(x => x.id === el.dataset.autocrop);
      if (!c || G.level < c.unlockLevel) return;
      _autoModalCrop = el.dataset.autocrop;
      renderAutoFieldModal(cellIndex);
    });
  });
  const inp = modal.querySelector('#autobudget');
  if (inp) inp.addEventListener('input', () => renderAutoFieldModal(cellIndex));
  modal.querySelector('#modalAutoCancel').addEventListener('click', closeModal);
  const startBtn = modal.querySelector('#modalAutoStart');
  if (startBtn && !startBtn.disabled) {
    startBtn.addEventListener('click', () => {
      const b = parseInt(modal.querySelector('#autobudget').value) || crop.cost;
      startAutoField(cellIndex, _autoModalCrop, b);
      closeModal();
    });
  }
}

function startAutoField(cellIndex, cropId, budget) {
  const crop = CROPS.find(c => c.id === cropId);
  if (!crop) return addLog('❌ Культура не знайдена!');
  // HQ slot limit for auto-fields
  const limit = getAutoFieldSlots();
  const active = (G.autoFields||[]).filter(a => a.active).length;
  const replacing = (G.autoFields||[]).some(a => a.cellIndex === cellIndex && a.active);
  if (limit <= 0) return addLog('🔒 Авто-поля відкриваються після апгрейду HQ у "Дворі".');
  if (!replacing && active >= limit) return addLog(`🚫 Ліміт авто-полів: ${active}/${limit}. Апгрейдни HQ у "Дворі".`);
  const cycles = Math.max(1, Math.floor(budget / crop.cost));
  const actualCost = cycles * crop.cost;
  if (G.coins < actualCost) return addLog(`❌ Не вистачає монет! Потрібно ${actualCost}🪙`);

  // Deduct ALL coins upfront immediately
  G.coins -= actualCost;
  const cycleDuration = crop.time * 1000;
  const totalDuration = cycles * cycleDuration;
  const now = Date.now();

  if (!G.autoFields) G.autoFields = [];
  G.autoFields = G.autoFields.filter(af => af.cellIndex !== cellIndex);
  G.autoFields.push({
    cellIndex, cropId,
    cycles, cyclesLeft: cycles, totalCycles: cycles,
    active: true,
    startTime: now,
    totalDuration,
    cycleDuration,
  });

  // Visual: plant the cell
  const cell = G.cells[cellIndex];
  cell.state = 'planted'; cell.crop = cropId; cell.plantedAt = now;
  cell.waterBonus = !!(G.activeEvent && G.activeEvent.id === 'rain');

  const m = Math.floor(cycles * crop.time / 60), s = (cycles * crop.time) % 60;
  const tStr = m > 0 ? (m + 'хв ' + (s > 0 ? s+'с' : '')) : (s + 'с');
  addLog(`⚙️ Авто-поле #${cellIndex+1}: ${crop.emoji} ×${cycles} циклів (${tStr}) запущено! -${actualCost}🪙`);
  spawnParticles('⚙️', window.innerWidth/2, window.innerHeight/2);
  updateTopBar(); renderGrid(); saveCurrentGame();
}

function stopAutoField(cellIndex) {
  // Simple stop — no harvest (used internally)
  if (!G.autoFields) return;
  const cell = G.cells[cellIndex];
  if (cell) { cell.state='empty'; cell.crop=null; cell.plantedAt=null; cell.waterBonus=false; }
  G.autoFields = G.autoFields.filter(a => a.cellIndex !== cellIndex);
  updateTopBar(); renderGrid(); saveCurrentGame();
}

function stopAutoFieldWithPartialHarvest(cellIndex) {
  if (!G.autoFields) return;
  const af = G.autoFields.find(a => a.cellIndex === cellIndex && a.active);
  if (!af) return;
  const crop = CROPS.find(c => c.id === af.cropId);
  const outProd = crop ? PRODUCTS[crop.gives] : null;
  const totalDur = af.totalDuration || af.totalDurationMs || 1;
  const elapsed = Date.now() - af.startTime;
  const cycleDur = af.cycleDuration || (totalDur / af.totalCycles);

  // Cycles fully completed
  const cyclesDone = Math.min(af.totalCycles, Math.floor(elapsed / cycleDur));
  const remainingCycles = af.totalCycles - cyclesDone;
  const collectedAmt = cyclesDone * (crop ? crop.givesAmt : 0);

  // Give already-done items
  if (collectedAmt > 0 && crop) {
    if (!addToInventory(crop.gives, collectedAmt, {source:'auto'})) {
      addLog('📦 Нема місця щоб забрати врожай авто-поля. Звільни комору або апгрейдни амбар у "Дворі".');
      return;
    }
    G.stats.harvested += cyclesDone;
    addXP(cyclesDone * 10);
  }

  // 50% refund on remaining cycles
  const moneyRefund = Math.floor(remainingCycles * (crop ? crop.cost : 0) * 0.5);
  if (moneyRefund > 0) G.coins += moneyRefund;

  const parts = [];
  if (collectedAmt > 0) parts.push(`+${collectedAmt} ${outProd ? outProd.emoji : ''} ${outProd ? outProd.name : ''}`);
  if (moneyRefund > 0) parts.push(`+${moneyRefund}🪙 повернуто`);
  addLog(`🛑 Авто-поле #${cellIndex+1} зупинено. ${parts.join(' • ')}`);

  const cell = G.cells[cellIndex];
  if (cell) { cell.state='empty'; cell.crop=null; cell.plantedAt=null; cell.waterBonus=false; }
  G.autoFields = G.autoFields.filter(a => a.cellIndex !== cellIndex);
  if (currentTab === 'inventory') renderInventory();
  updateTopBar(); renderGrid(); saveCurrentGame();
}

// Called from gameTick — updates progress and collects completed cycles
function tickAutoFields() {
  if (!G || !G.autoFields || !G.autoFields.length) return;
  const now = Date.now();
  let changed = false;
  const toRemove = [];

  G.autoFields.forEach(af => {
    if (!af.active) return;
    const cell = G.cells[af.cellIndex];
    if (!cell) return;
    const crop = CROPS.find(c => c.id === af.cropId);
    if (!crop) return;

    const elapsed = now - af.startTime;

    // ── DONE: all time has passed ──
    if (elapsed >= af.totalDuration) {
      const totalOutput = af.totalCycles * crop.givesAmt;
      if (!addToInventory(crop.gives, totalOutput, {source:'auto'})) {
        // Keep auto-field until player frees space (avoid losing output)
        const n = Date.now();
        if (!af._blockedNoticeAt || n - af._blockedNoticeAt > 15000) {
          af._blockedNoticeAt = n;
          addLog('📦 Авто-поле готове, але комора переповнена. Звільни місце або апгрейдни амбар у "Дворі".');
        }
        // Keep cell visually locked as auto-field
        cell.state = 'auto_running';
        cell.crop = af.cropId;
        changed = true;
        return;
      }
      G.stats.harvested += af.totalCycles;
      addXP(af.totalCycles * 10);
      cell.state = 'empty'; cell.crop = null; cell.plantedAt = null; cell.waterBonus = false;
      G.stats.autoCompleted = (G.stats.autoCompleted||0)+1;
      checkAchievement('first_auto');
      checkAchievement('auto_complete', G.stats.autoCompleted);
      updateQuestProgress('auto', 1);
      addLog(`✅ Авто-поле #${af.cellIndex+1} готово! +${totalOutput} ${crop.emoji} ${PRODUCTS[crop.gives]?.name||''} в комору!`);
      spawnParticles(crop.emoji, window.innerWidth/2, window.innerHeight/2);
      toRemove.push(af.cellIndex);
      changed = true;
      return;
    }

    // ── STILL RUNNING: keep cell locked as auto_running, show progress ──
    cell.state = 'auto_running';
    cell.crop = af.cropId;
  });

  toRemove.forEach(idx => {
    G.autoFields = G.autoFields.filter(a => a.cellIndex !== idx);
  });

  if (changed) {
    updateTopBar();
    renderGrid();
    if (currentTab === 'inventory') renderInventory();
    saveCurrentGame();
  } else if (G.autoFields.length > 0 && currentTab === 'farm') {
    // Live countdown refresh
    renderGrid();
  }
}
function renderHouses() {
  const grid = document.getElementById('housesGrid');
  if (!grid) return;
  if (!G.houses) G.houses = { chicken_coop: {level:1, built:true} };

  grid.innerHTML = '';

  HOUSES_DEF.forEach(house => {
    const hs = getHouseState(house.id);
    const isBuilt = hs && hs.built;
    const lvl = isBuilt ? hs.level : 0;
    const levelInfo = isBuilt ? house.levels[lvl - 1] : null;
    const nextLevelInfo = isBuilt && lvl < house.levels.length ? house.levels[lvl] : null;
    const isLocked = G.level < house.unlockLevel;
    const animDef = ANIMALS_DEF.find(a => a.id === house.animalId);
    const myAnimals = G.animals.filter(a => a.type === house.animalId);
    const capacity = isBuilt ? levelInfo.capacity : 0;
    const canBuild = !isBuilt && !isLocked && G.coins >= house.buildCost;
    const canUpgrade = isBuilt && nextLevelInfo && G.coins >= nextLevelInfo.upgradeCost;
    const isMaxLevel = isBuilt && lvl >= house.levels.length;

    const card = document.createElement('div');
    card.className = `house-card${isLocked ? ' locked' : ''}`;

    // Animals preview emoji string
    const animPreview = myAnimals.slice(0,6).map(a =>
      `<span title="${a.name}">${animDef.emoji}</span>`).join('');

    // Animals list rows
    const animRows = myAnimals.map(a => {
      const hpColor = a.happiness > 60 ? '#2ecc71' : a.happiness > 30 ? '#f39c12' : '#e74c3c';
      return `<div class="house-animal-row">
        ${animDef.emoji} <span style="flex:1">${a.name}</span>
        <div class="house-animal-hp"><div class="house-animal-hp-fill" style="width:${a.happiness}%;background:${hpColor}"></div></div>
        ${a.pendingProducts > 0 ? `<span style="font-size:.9rem;margin-left:4px;">📦${a.pendingProducts}</span>` : ''}
      </div>`;
    }).join('');

    const capacityPct = capacity > 0 ? (myAnimals.length / capacity * 100) : 0;
    const capColor = myAnimals.length >= capacity ? '#e74c3c' : myAnimals.length >= capacity * 0.7 ? '#f39c12' : '#52b788';

    card.innerHTML = `
      <div class="house-scene">
        <div class="house-bg-sky"></div>
        <div class="house-bg-grass"></div>
        ${isLocked ? `<div class="house-locked-overlay">🔒</div>` : ''}
        ${isBuilt ? `<div class="house-lvl-badge">Рвн. ${lvl}</div>` : ''}
        <div class="house-building">
          <span class="house-icon">${house.icon}</span>
        </div>
        <div class="house-animals-preview">${animPreview}</div>
      </div>
      <div class="house-info">
        <div class="house-name">${house.name}</div>
        <div class="house-animal-type">${animDef.emoji} ${animDef.name} • ${isLocked ? `🔒 Розблок. з рівня ${house.unlockLevel}` : isBuilt ? levelInfo.label : 'Не побудовано'}</div>

        ${isBuilt ? `
          <div class="house-stats">
            <div class="hstat"><div class="hstat-val" style="color:${capColor}">${myAnimals.length}/${capacity}</div><div class="hstat-lbl">Тварин</div></div>
            <div class="hstat"><div class="hstat-val">×${levelInfo.produceBonus.toFixed(1)}</div><div class="hstat-lbl">Бонус продукту</div></div>
          </div>
          <div class="house-capacity-bar">
            <div class="house-capacity-fill" style="width:${capacityPct}%;background:${capColor}"></div>
          </div>
          ${myAnimals.length < capacity ?
            `<button class="add-animal-btn" data-buy="${house.animalId}">➕ Купити ${animDef.emoji} ${animDef.name} (${animDef.cost}🪙)</button>` :
            `<button class="add-animal-btn" disabled>🚫 Будиночок заповнений!</button>`
          }
          ${animRows ? `<div class="house-animals-list">${animRows}</div>` : ''}
          <div class="house-feed-section">
            <div class="house-feed-title">🥩 Чим годуємо:</div>
            <div class="feed-picker-grid" id="feedPicker-${house.id}">
              ${(() => {
                const feedable = Object.entries(G.inventory||{})
                  .filter(([k,v]) => v>0 && PRODUCTS[k] && PRODUCTS[k].feedValue>0 && PRODUCTS[k].category==='crop');
                const currentFeed = (G.houseFeed||{})[house.id] || null;
                const noneSelected = !currentFeed;
                let opts = `<div class="feed-picker-opt${noneSelected?' selected-feed':''}" data-feedhouse="${house.id}" data-feedprod="none">🚫 Авто</div>`;
                const allFeedable = Object.entries(PRODUCTS).filter(([k,p]) => p.feedValue>0 && p.category==='crop');
                allFeedable.forEach(([k,p]) => {
                  const qty = G.inventory[k]||0;
                  const sel = currentFeed===k;
                  opts += `<div class="feed-picker-opt${sel?' selected-feed':''}${qty<=0?' no-stock':''}" data-feedhouse="${house.id}" data-feedprod="${k}">${p.emoji} ${p.name} (${qty})</div>`;
                });
                return opts;
              })()}
            </div>
          </div>
          <div style="margin-top:8px;">
            ${isMaxLevel ?
              `<button class="upgrade-btn max-level" disabled>🏆 Максимальний рівень!</button>` :
              (() => {
                const needLvl = nextLevelInfo.reqLevel || 1;
                const hasLvl = G.level >= needLvl;
                const lockedByLvl = !hasLvl;
                const btnClass = lockedByLvl ? 'no-money' : canUpgrade ? 'can-upgrade' : 'no-money';
                const lockLabel = lockedByLvl ? `🔒 Рівень ${needLvl} потрібен` : `⬆️ Апгрейд до «${nextLevelInfo.upgradeLabel}» — ${nextLevelInfo.upgradeCost}🪙`;
                return `<button class="upgrade-btn ${btnClass}" ${lockedByLvl ? 'disabled' : ''} data-upgrade="${house.id}">
                  ${lockLabel}
                </button>
                <div class="house-upgrade-preview">+${nextLevelInfo.capacity - capacity} місць • ×${nextLevelInfo.produceBonus.toFixed(1)} бонус${needLvl > 1 ? ` • Рвн.${needLvl}` : ''}</div>`;
              })()
            }
          </div>
        ` : `
          ${isLocked ?
            `<div style="text-align:center;padding:10px;color:#999;font-size:.85rem;">Потрібен рівень ${house.unlockLevel}</div>
             <button class="buy-first-btn locked" disabled>🔒 Ще не доступно</button>` :
            `<div style="text-align:center;color:#666;font-size:.85rem;margin-bottom:10px;">
              Побудуй будиночок щоб тримати ${animDef.emoji} ${animDef.name}
            </div>
            <button class="buy-first-btn ${house.buildCost === 0 ? '' : G.coins >= house.buildCost ? '' : 'locked'}" data-build="${house.id}">
              🏗 Побудувати${house.buildCost > 0 ? ` — ${house.buildCost}🪙` : ' (безкоштовно)'}
            </button>`
          }
        `}
      </div>`;

    grid.appendChild(card);
  });

  // Bind events
  grid.querySelectorAll('[data-feedprod]').forEach(el => {
    el.addEventListener('click', () => {
      const houseId = el.dataset.feedhouse;
      const prod = el.dataset.feedprod;
      if (!G.houseFeed) G.houseFeed = {};
      G.houseFeed[houseId] = prod === 'none' ? null : prod;
      addLog(`🥩 ${HOUSES_DEF.find(h=>h.id===houseId)?.name||houseId}: годуємо ${prod==='none'?'автоматично':PRODUCTS[prod]?.name||prod}`);
      renderHouses(); saveCurrentGame();
    });
  });
  grid.querySelectorAll('[data-build]').forEach(btn => {
    btn.addEventListener('click', () => buildHouse(btn.dataset.build));
  });
  grid.querySelectorAll('[data-upgrade]').forEach(btn => {
    btn.addEventListener('click', () => upgradeHouse(btn.dataset.upgrade));
  });
  grid.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => buyAnimalForHouse(btn.dataset.buy));
  });
}

function buildHouse(houseId) {
  const house = HOUSES_DEF.find(h => h.id === houseId);
  if (!house) return;
  if (G.level < house.unlockLevel) return addLog('🔒 Потрібен вищий рівень!');
  if (G.coins < house.buildCost) return addLog(`❌ Не вистачає монет! Потрібно ${house.buildCost}🪙`);
  G.coins -= house.buildCost;
  if (!G.houses) G.houses = {};
  G.houses[houseId] = { level: 1, built: true };
  addLog(`🏗 Побудовано ${house.name}!`);
  updateTopBar(); renderHouses(); saveCurrentGame();
}

function upgradeHouse(houseId) {
  const house = HOUSES_DEF.find(h => h.id === houseId);
  if (!house) return;
  const hs = getHouseState(houseId);
  if (!hs || !hs.built) return;
  const nextLvl = house.levels[hs.level]; // 0-indexed
  if (!nextLvl) return addLog('Максимальний рівень!');
  if (nextLvl.reqLevel && G.level < nextLvl.reqLevel) return addLog(`🔒 Потрібен рівень ${nextLvl.reqLevel} для цього апгрейду!`);
  if (G.coins < nextLvl.upgradeCost) return addLog(`❌ Не вистачає монет! Потрібно ${nextLvl.upgradeCost}🪙`);
  G.coins -= nextLvl.upgradeCost;
  hs.level++;
  addLog(`⬆️ ${house.name} апгрейджено до рівня ${hs.level}! Ліміт тварин: ${house.levels[hs.level-1].capacity}`);
  // Spawn particle effect
  spawnParticles('⭐', window.innerWidth / 2, window.innerHeight / 3);
  updateTopBar(); renderHouses(); saveCurrentGame();
}

function buyAnimalForHouse(animalId) {
  const house = HOUSES_DEF.find(h => h.animalId === animalId);
  if (!house) return;
  const hs = getHouseState(house.id);
  if (!hs || !hs.built) return addLog('Спочатку побудуй будиночок!');
  const capacity = house.levels[hs.level - 1].capacity;
  const current = countAnimals(animalId);
  if (current >= capacity) return addLog('🚫 Будиночок заповнений! Апгрейдуй.');
  const def = ANIMALS_DEF.find(a => a.id === animalId);
  if (G.coins < def.cost) return addLog(`❌ Не вистачає монет! Потрібно ${def.cost}🪙`);
  G.coins -= def.cost;
  G.animalIdCounter = (G.animalIdCounter || 0) + 1;
  const animal = {
    uid: G.animalIdCounter,
    type: def.id,
    name: def.name + ' #' + G.animalIdCounter,
    happiness: 100,
    lastFed: Date.now(),
    lastProduced: Date.now(),
    pendingProducts: 0,
  };
  G.animals.push(animal);
  G.stats.animalsBought = (G.stats.animalsBought || 0) + 1;
  addLog(`${def.emoji} Куплено ${def.name} для ${house.name}!`);
  checkAchievement('first_animal');
  checkAchievement('animals5', G.animals.length);
  updateTopBar(); renderHouses(); renderAnimals(); saveCurrentGame();
}

// ============================================================
// CRAFT SYSTEM
// ============================================================
function canCraft(recipe) {
  return Object.entries(recipe.ingredients).every(([k, qty]) =>
    (G.inventory[k] || 0) >= qty
  );
}

function getCraftingEntry(recipeId) {
  if (!G.craftQueue) G.craftQueue = [];
  return G.craftQueue.find(e => e.recipeId === recipeId) || null;
}

function startCraft(recipeId) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;
  const slots = getCraftSlots();
  const used = (G.craftQueue||[]).length;
  if (used >= slots) return addLog(`🚫 Нема слотів крафту (${used}/${slots}). Апгрейдни кухню у "Дворі".`);
  if (!canCraft(recipe)) { addLog('❌ Не вистачає інгредієнтів!'); return; }
  if (getCraftingEntry(recipeId)) { addLog('⏳ Вже готується!'); return; }
  // Need storage for output (inventory + ground buffer)
  if (!canAcceptToStorage(recipe.output, recipe.outputAmt)) {
    addLog('📦 Нема місця для результату крафту. Апгрейдни амбар у "Дворі" або звільни місце.');
    return;
  }
  // Deduct ingredients
  Object.entries(recipe.ingredients).forEach(([k, qty]) => {
    G.inventory[k] = (G.inventory[k] || 0) - qty;
    if (G.inventory[k] <= 0) delete G.inventory[k];
  });
  if (!G.craftQueue) G.craftQueue = [];
  G.craftQueue.push({ recipeId, startTime: Date.now(), duration: recipe.time * 1000 });
  addLog(`🍳 Почали готувати: ${recipe.name}!`);
  updateTopBar();
  renderCraft();
  saveCurrentGame();
}

function finishCraft(recipeId) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;
  if (!G.craftQueue) G.craftQueue = [];
  // If no storage, keep craft entry until player frees space (avoid losing result)
  if (!addToInventory(recipe.output, recipe.outputAmt, {source:'craft', allowGround:true})) {
    const entry = G.craftQueue.find(e => e.recipeId === recipeId);
    const now = Date.now();
    if (!entry._blockedNoticeAt || now - entry._blockedNoticeAt > 15000) {
      entry._blockedNoticeAt = now;
      addLog('📦 Нема місця для результату крафту. Звільни комору або апгрейдни амбар у "Дворі".');
    }
    return;
  }
  G.craftQueue = G.craftQueue.filter(e => e.recipeId !== recipeId);
  addXP(recipe.xp);
  G.stats.crafted = (G.stats.crafted||0)+1;
  checkAchievement('first_craft');
  checkAchievement('craft10', G.stats.crafted);
  if (recipe.output==='pizza') checkAchievement('craft_pizza');
  updateQuestProgress('craft', recipe.outputAmt, recipe.output);
  addLog(`✅ Готово! ${PRODUCTS[recipe.output].emoji} ${recipe.name} × ${recipe.outputAmt} в коморі!`);
  spawnParticles(PRODUCTS[recipe.output].emoji, window.innerWidth / 2, window.innerHeight / 3);
  updateTopBar();
  if (currentTab === 'craft') renderCraft();
  if (currentTab === 'inventory') renderInventory();
  saveCurrentGame();
}

function renderCraft() {
  const container = document.getElementById('craftContent');
  if (!container) return;
  if (!G.craftQueue) G.craftQueue = [];

  // Tick: finish completed items
  G.craftQueue.forEach(entry => {
    const elapsed = Date.now() - entry.startTime;
    if (elapsed >= entry.duration) finishCraft(entry.recipeId);
  });

  const usedSlots = (G.craftQueue||[]).length;
  const maxSlots = getCraftSlots();
  const hint = document.getElementById('craftSlotsHint');
  if (hint) hint.textContent = `Слоти крафту: ${usedSlots}/${maxSlots} • Апгрейд: вкладка "🏡 Двір"`;

  // Group by category
  const byCategory = {};
  RECIPES.forEach(r => {
    if (!byCategory[r.category]) byCategory[r.category] = [];
    byCategory[r.category].push(r);
  });

  container.innerHTML = '';

  Object.entries(byCategory).forEach(([cat, recipes]) => {
    const catDef = RECIPE_CATEGORIES[cat] || { label: cat, color: '#fff' };
    const section = document.createElement('div');
    section.className = 'craft-section';
    section.innerHTML = `<div class="craft-section-title">${catDef.label}</div><div class="craft-cards" id="craftCards-${cat}"></div>`;
    container.appendChild(section);

    const cardsWrap = section.querySelector('.craft-cards');
    recipes.forEach(recipe => {
      const output = PRODUCTS[recipe.output];
      const craftable = canCraft(recipe);
      const craftingEntry = getCraftingEntry(recipe.id);
      const isCrafting = !!craftingEntry;
      const elapsed = isCrafting ? Date.now() - craftingEntry.startTime : 0;
      const pct = isCrafting ? Math.min(100, (elapsed / craftingEntry.duration) * 100) : 0;
      const remaining = isCrafting ? Math.max(0, Math.ceil((craftingEntry.duration - elapsed) / 1000)) : 0;

      const card = document.createElement('div');
      card.className = `craft-card${craftable && !isCrafting ? ' craftable' : ''}${isCrafting ? ' crafting-active' : ''}`;
      card.style.background = catDef.color;

      // Build ingredient pills
      const ingPills = Object.entries(recipe.ingredients).map(([k, qty]) => {
        const have = (G.inventory[k] || 0);
        const hasEnough = have >= qty || isCrafting;
        const prod = PRODUCTS[k];
        return `<div class="craft-ing ${hasEnough ? 'have' : 'missing'}">
          <span class="craft-ing-emoji">${prod ? prod.emoji : '?'}</span>
          <span>${prod ? prod.name : k}</span>
          <span class="craft-ing-qty">${isCrafting ? qty : have}/${qty}</span>
        </div>`;
      }).join('');

      card.innerHTML = `
        <span class="craft-xp">+${recipe.xp} XP</span>
        <div class="craft-header">
          <span class="craft-output-emoji">${output.emoji}</span>
          <div class="craft-output-info">
            <div class="craft-output-name">${recipe.name}</div>
            <div class="craft-output-desc">${recipe.desc}</div>
          </div>
          <span class="craft-output-yield">× ${recipe.outputAmt} → 💰${output.sellPrice}</span>
        </div>
        <div class="craft-ingredients">${ingPills}</div>
        <div class="craft-progress-wrap${isCrafting ? ' show' : ''}" id="craftProg-${recipe.id}">
          <div class="craft-progress-bar"><div class="craft-progress-fill" id="craftFill-${recipe.id}" style="width:${pct}%"></div></div>
          <div class="craft-progress-label" id="craftLabel-${recipe.id}">⏱ Ще ${remaining}с...</div>
        </div>
        <div class="craft-footer">
          <div class="craft-meta">⏱ ${recipe.time}с</div>
          <button class="craft-btn${isCrafting ? ' crafting' : craftable ? ' can' : ' cant'}" id="craftBtn-${recipe.id}">
            ${isCrafting ? '⏳ Готується...' : craftable ? '🍳 Готувати' : '❌ Не вистачає'}
          </button>
        </div>`;

      cardsWrap.appendChild(card);

      // Bind craft button
      const btn = card.querySelector(`#craftBtn-${recipe.id}`);
      if (btn && !isCrafting && craftable && usedSlots < maxSlots) {
        btn.addEventListener('click', () => startCraft(recipe.id));
      }
      if (btn && !isCrafting && craftable && usedSlots >= maxSlots) {
        btn.classList.remove('can'); btn.classList.add('cant');
        btn.textContent = '🚫 Нема слотів';
      }
    });
  });
}

// Called from gameTick to update craft progress bars without full re-render
function tickCraft() {
  if (!G || !G.craftQueue || !G.craftQueue.length) return;
  let finished = false;
  G.craftQueue.forEach(entry => {
    const elapsed = Date.now() - entry.startTime;
    if (elapsed >= entry.duration) { finished = true; return; }
    // Update progress bars only if craft tab is open
    if (currentTab === 'craft') {
      const pct = Math.min(100, (elapsed / entry.duration) * 100);
      const remaining = Math.max(0, Math.ceil((entry.duration - elapsed) / 1000));
      const fill = document.getElementById(`craftFill-${entry.recipeId}`);
      const label = document.getElementById(`craftLabel-${entry.recipeId}`);
      if (fill) fill.style.width = pct + '%';
      if (label) label.textContent = `⏱ Ще ${remaining}с...`;
    }
  });
  // Always finish completed items regardless of tab
  if (finished) {
    G.craftQueue.filter(e => Date.now() - e.startTime >= e.duration)
      .forEach(e => finishCraft(e.recipeId));
  }
}

function renderInventory() {
  const grid = document.getElementById('invGrid');
  const empty = document.getElementById('invEmpty');
  const items = Object.entries(G.inventory).filter(([k,v])=>v>0);
  if (!items.length) { grid.innerHTML=''; empty.style.display=''; return; }
  empty.style.display='none';
  grid.innerHTML = items.map(([k,v]) => {
    const p = PRODUCTS[k];
    if (!p) return '';
    return `<div class="inv-item">
      <span class="inv-emoji">${p.emoji}</span>
      <div class="inv-name">${p.name}</div>
      <div class="inv-qty">${v}</div>
      <div class="inv-use">${p.feedValue>0?`🐄 корм: +${p.feedValue}`:''}${p.sellPrice?` 💰${p.sellPrice}/шт`:''}</div>
    </div>`;
  }).join('');
}

// ============================================================
// MARKET
// ============================================================
function renderMarket() {
  const grid = document.getElementById('marketGrid');
  grid.innerHTML = Object.entries(PRODUCTS).map(([k,p]) => {
    const qty = G.inventory[k] || 0;
    return `<div class="market-item">
      <span class="me">${p.emoji}</span>
      <div class="mn">${p.name}</div>
      <div class="mp">💰 ${p.sellPrice} монет/шт</div>
      <div style="font-size:.8rem;color:#888;margin-bottom:8px;">У тебе: ${qty}</div>
      <button class="sell-btn" data-sell="${k}" ${qty<=0?'disabled':''}>Продати 1</button>
      ${qty>1?`<button class="sell-all-btn" data-sellall="${k}">Продати всі (${qty})</button>`:''}
    </div>`;
  }).join('');
  grid.querySelectorAll('[data-sell]').forEach(btn => {
    btn.addEventListener('click', () => sellOne(btn.dataset.sell));
  });
  grid.querySelectorAll('[data-sellall]').forEach(btn => {
    btn.addEventListener('click', () => sellAll(btn.dataset.sellall));
  });
}

function getSellPrice(k) {
  const base = PRODUCTS[k]?.sellPrice || 0;
  return base;
}


function sellOne(k) {
  if (!G.inventory[k] || G.inventory[k]<=0) return;
  const p = PRODUCTS[k];
  G.inventory[k]--;
  if (!G.inventory[k]) delete G.inventory[k];
  const sp = getSellPrice(k);
  G.coins += sp;
  G.stats.earned += sp;
  G.stats.sold = (G.stats.sold||0)+1;
  addXP(5);
  checkAchievement('first_sell');
  updateQuestProgress('sell', 1);
  updateQuestProgress('earn', sp);
  addLog(`💰 Продано ${p.emoji} ${p.name} за ${p.sellPrice}🪙`);
  checkAchievement('coins500', G.coins);
  checkAchievement('coins2000', G.coins);
  checkAchievement('sell20', G.stats.sold);
  updateTopBar(); renderMarket();
  if (currentTab==='inventory') renderInventory();
  saveCurrentGame();
}

function sellAll(k) {
  if (!G.inventory[k] || G.inventory[k]<=0) return;
  const p = PRODUCTS[k];
  const qty = G.inventory[k];
  const earned = qty * getSellPrice(k);
  delete G.inventory[k];
  G.coins += earned;
  G.stats.earned += earned;
  G.stats.sold = (G.stats.sold||0)+qty;
  addXP(qty*5);
  checkAchievement('first_sell');
  updateQuestProgress('sell', qty);
  updateQuestProgress('earn', earned);
  addLog(`💰 Продано ${qty}x${p.emoji} за ${earned}🪙!`);
  checkAchievement('coins500', G.coins);
  checkAchievement('coins2000', G.coins);
  updateTopBar(); renderMarket();
  if (currentTab==='inventory') renderInventory();
  saveCurrentGame();
}

// ============================================================
// PROFILE
// ============================================================
function renderProfile() {
  document.getElementById('profAvatar').textContent = '🧑‍🌾';
  document.getElementById('profName').textContent = G.displayName;
  document.getElementById('profJoined').textContent = `Фермер з ${G.joinedDate||'сьогодні'}`;
  document.getElementById('profLevel').textContent = G.level;
  document.getElementById('profCoins').textContent = G.coins;
  document.getElementById('profHarvests').textContent = G.stats.harvested;
  document.getElementById('profAnimals').textContent = G.stats.animalsBought||0;
  document.getElementById('profEarned').textContent = G.stats.earned;
  document.getElementById('profDays').textContent = G.day;
  document.getElementById('profXP').textContent = G.xp;
  document.getElementById('profXPNext').textContent = G.xpNext;
  document.getElementById('profXPBar').style.width = Math.min(100,(G.xp/G.xpNext)*100)+'%';
  const achGrid = document.getElementById('achGrid');
  achGrid.innerHTML = ACHIEVEMENTS.map(a => {
    const earned = (G.achievements||[]).includes(a.id);
    const cur = !earned ? getAchievementProgress(a.id) : null;
    const tgt = !earned ? getAchievementTarget(a.id) : null;
    const showBar = cur !== null && tgt !== null;
    const pct = showBar ? Math.min(100, Math.round(cur / tgt * 100)) : 0;
    const rewardStr = (a.xp > 0 || a.coins > 0)
      ? `<div style="font-size:.68rem;color:#f39c12;margin-top:2px;">${a.xp>0?'+'+a.xp+'XP':''}${a.xp>0&&a.coins>0?' ':''}${a.coins>0?'+'+a.coins+'🪙':''}</div>`
      : '';
    return `<div class="ach${earned?' earned':''}">
      <span class="ach-icon">${a.icon}</span>
      <div style="font-weight:700;font-size:.8rem;">${a.name}</div>
      <div style="font-size:.72rem;color:#888;">${a.desc}</div>
      ${rewardStr}
      ${showBar ? `
        <div style="background:#eee;border-radius:4px;height:5px;margin-top:5px;overflow:hidden;">
          <div style="height:100%;border-radius:4px;background:linear-gradient(90deg,#3498db,#52b788);width:${pct}%;transition:width .3s;"></div>
        </div>
        <div style="font-size:.66rem;color:#aaa;margin-top:2px;">${cur} / ${tgt}</div>
      ` : ''}
    </div>`;
  }).join('');
}

// ============================================================
// XP & LEVELING
// ============================================================
function addXP(amount) {
  G.xp += amount;
  if (G.xp >= G.xpNext) {
    G.xp -= G.xpNext;
    G.level++;
    G.xpNext = Math.round(G.xpNext * 1.6);
    G.maxWater = Math.min(20, G.maxWater+2);
    addLog(`⭐ РІВЕНЬ ${G.level}! Нові можливості розблоковані!`);
    setHint(`🎉 Вітаємо з рівнем ${G.level}!`);
    renderCropShop(); renderAnimalShop();
    checkAchievement('level3', G.level);
  }
}

// ============================================================
// ACHIEVEMENTS
// ============================================================
// Return current progress value for an achievement
function getAchievementProgress(id) {
  if (!G) return 0;
  const map = {
    harvest10: ()=>G.stats.harvested,   harvest50: ()=>G.stats.harvested,
    harvest200:()=>G.stats.harvested,   harvest500:()=>G.stats.harvested,
    harvest1000:()=>G.stats.harvested,
    animals3:  ()=>G.animals.length,    animals5:  ()=>G.animals.length,
    animals10: ()=>G.animals.length,
    collect100:()=>G.stats.productsCollected||0, collect500:()=>G.stats.productsCollected||0,
    coins500:  ()=>G.coins,             coins2000: ()=>G.coins,
    coins10000:()=>G.coins,             coins100000:()=>G.coins,
    earned50000:()=>G.stats.earned||0,
    level3:    ()=>G.level,             level5:    ()=>G.level,
    level10:   ()=>G.level,             level15:   ()=>G.level,
    sell20:    ()=>G.stats.sold||0,     sell100:   ()=>G.stats.sold||0,
    sell500:   ()=>G.stats.sold||0,
    water20:   ()=>G.stats.watered||0,  water100:  ()=>G.stats.watered||0,
    craft10:   ()=>G.stats.crafted||0,
    auto_complete:()=>G.stats.autoCompleted||0,
    unlock10cells:()=>(G.cells||[]).filter(x=>x.unlocked!==false).length,
  };
  return map[id] ? map[id]() : null;
}

// Return target value for achievement
function getAchievementTarget(id) {
  const T = {
    harvest10:10, harvest50:50, harvest200:200, harvest500:500, harvest1000:1000,
    animals3:3, animals5:5, animals10:10, collect100:100, collect500:500,
    coins500:500, coins2000:2000, coins10000:10000, coins100000:100000,
    earned50000:50000, level3:3, level5:5, level10:10, level15:15,
    sell20:20, sell100:100, sell500:500, water20:20, water100:100,
    craft10:10, auto_complete:5, unlock10cells:10,
  };
  return T[id] || null;
}

function checkAchievement(id, value) {
  if (!G.achievements) G.achievements = [];
  if (G.achievements.includes(id)) return;
  const T = {
    harvest10:10,harvest50:50,harvest200:200,harvest500:500,harvest1000:1000,
    animals3:3,animals5:5,animals10:10,collect100:100,collect500:500,
    coins500:500,coins2000:2000,coins10000:10000,coins100000:100000,
    earned50000:50000,level3:3,level5:5,level10:10,level15:15,
    sell20:20,sell100:100,sell500:500,water20:20,water100:100,
    craft10:10,auto_complete:5,unlock10cells:10,
  };
  if (!((id in T) ? (value||0) >= T[id] : true)) return;
  G.achievements.push(id);
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;
  const rw = [];
  if (ach.xp    > 0) { G.xp += ach.xp;      rw.push('+' + ach.xp + 'XP'); }
  if (ach.coins > 0) { G.coins += ach.coins; rw.push('+' + ach.coins + '🪙'); }
  addLog('🏆 ' + ach.icon + ' ' + ach.name + (rw.length ? ' (' + rw.join(', ') + ')' : ''));
  spawnParticles('🏆', window.innerWidth / 2, window.innerHeight / 4);
  updateTopBar();
  if (currentTab === 'profile') renderProfile();
}

function checkAllAchievements() {
  if (!G) return;
  checkAchievement('coins500',    G.coins);
  checkAchievement('coins2000',   G.coins);
  checkAchievement('coins10000',  G.coins);
  checkAchievement('coins100000', G.coins);
  checkAchievement('earned50000', G.stats.earned || 0);
  checkAchievement('harvest10',   G.stats.harvested);
  checkAchievement('harvest50',   G.stats.harvested);
  checkAchievement('harvest200',  G.stats.harvested);
  checkAchievement('harvest500',  G.stats.harvested);
  checkAchievement('harvest1000', G.stats.harvested);
  checkAchievement('animals3',    G.animals.length);
  checkAchievement('animals5',    G.animals.length);
  checkAchievement('animals10',   G.animals.length);
  checkAchievement('collect100',  G.stats.productsCollected || 0);
  checkAchievement('collect500',  G.stats.productsCollected || 0);
  checkAchievement('sell20',      G.stats.sold || 0);
  checkAchievement('sell100',     G.stats.sold || 0);
  checkAchievement('sell500',     G.stats.sold || 0);
  checkAchievement('water20',     G.stats.watered || 0);
  checkAchievement('water100',    G.stats.watered || 0);
  checkAchievement('level3',      G.level);
  checkAchievement('level5',      G.level);
  checkAchievement('level10',     G.level);
  checkAchievement('level15',     G.level);
  const unl = (G.cells || []).filter(x => x.unlocked !== false).length;
  checkAchievement('unlock10cells', unl);
  const gt = new Set((G.cells || []).filter(x => x.crop).map(x => x.crop));
  if (gt.size >= CROPS.length) checkAchievement('all_crops');
  const ot = new Set((G.animals || []).map(a => a.type));
  if (ot.size >= ANIMALS_DEF.length) checkAchievement('all_animals');
  if ((G.stats.autoCompleted || 0) >= 5) checkAchievement('auto_complete', G.stats.autoCompleted);
}
function addToInventory(key, amount, opts) {
  if (!G || !key || !amount) return true;
  if (!opts) opts = {};
  pruneGroundDrops();
  const cap = getInvCap();
  const cur = invCount();
  const freeInv = Math.max(0, cap - cur);
  const curGround = groundCount();
  const freeGround = Math.max(0, GROUND_CAP_QTY - curGround);
  const canUseGround = opts.allowGround !== false; // default: allow ground buffer
  const totalFree = freeInv + (canUseGround ? freeGround : 0);
  if (totalFree < amount) return false;

  const toInv = Math.min(amount, freeInv);
  const toGround = amount - toInv;
  if (toInv > 0) G.inventory[key] = (G.inventory[key]||0) + toInv;
  if (toGround > 0) addToGround(key, toGround);
  return true;
}

// ============================================================
// GAME TIMERS
// ============================================================
let timers = [];
function startTimers() {
  timers.forEach(t=>clearInterval(t));
  timers = [
    setInterval(gameTick, 1000),
    setInterval(regenWater, 30000),
    setInterval(newDay, 90000),
    setInterval(saveCurrentGame, 15000),
  ];
}

function gameTick() {
  if (!G) return;
  ticks++;
  let gridChanged = false;

  // grow crops
  G.cells.forEach(cell => {
    if (cell.state==='auto_running') return; // skip auto-fields
    if (cell.state==='planted'||cell.state==='growing') {
      const crop = CROPS.find(c=>c.id===cell.crop);
      if (!crop) return;
      const elapsed = (Date.now()-cell.plantedAt)/1000;
      const growTime = cell.waterBonus ? crop.time*0.7 : crop.time;
      if (elapsed >= growTime*0.3 && cell.state==='planted') { cell.state='growing'; gridChanged=true; }
      if (elapsed >= growTime) { cell.state='ready'; gridChanged=true; }
    }
  });

  // animal happiness decay & production
  G.animals.forEach(animal => {
    const def = ANIMALS_DEF.find(a=>a.id===animal.type);
    if (!def) return;
    // decay happiness every ~10 seconds
    if (ticks % 30 === 0) {
      animal.happiness = Math.max(0, animal.happiness - def.happinessDecay);
    }
    // produce if happy enough (house bonus speeds up production)
    const elapsed = (Date.now()-animal.lastProduced)/1000;
    const bonus = getHouseProduceBonus(animal.type);
    const effectiveTime = def.produceTime / bonus;
    if (elapsed >= effectiveTime && animal.happiness >= 30) {
      animal.pendingProducts = (animal.pendingProducts||0)+1;
      animal.lastProduced = Date.now();
    }
  });

  if (gridChanged) { renderGrid(); }
  else {
    // update progress bars
    document.querySelectorAll('.cell').forEach((el,i) => {
      if (!G.cells[i]) return;
      const cell = G.cells[i];
      if (cell.state==='auto_running') {
        // Update auto-field progress bar in-place (no full re-render needed)
        const af = (G.autoFields||[]).find(x => x.cellIndex === i && x.active);
        if (!af) return;
        const totalDur = af.totalDuration || af.totalDurationMs || 1;
        const remaining = Math.max(0, totalDur - (Date.now() - af.startTime));
        const pct = Math.min(100, 100 - (remaining / totalDur * 100));
        const bar = el.querySelector('.prog-fill');
        if (bar) bar.style.width = pct.toFixed(1) + '%';
        // Update countdown text
        const rm = Math.floor(remaining/60000), rs = Math.floor((remaining%60000)/1000);
        const timeStr = rm > 0 ? rm+'хв '+rs+'с' : rs+'с';
        const timeEl = el.querySelector('[data-countdown]');
        if (timeEl) timeEl.textContent = '⚙️ ' + timeStr;
        return;
      }
      if (cell.state==='growing'||cell.state==='planted') {
        const crop = CROPS.find(c=>c.id===cell.crop);
        if (!crop) return;
        const elapsed = (Date.now()-cell.plantedAt)/1000;
        const growTime = cell.waterBonus ? crop.time*0.7 : crop.time;
        const pct = Math.min(100,(elapsed/growTime)*100);
        const bar = el.querySelector('.prog-fill');
        if (bar) bar.style.width = pct+'%';
      }
    });
  }

  // periodic UI updates
  if (ticks % 5 === 0) {
    updateTopBar();
    if (currentTab==='animals') {
      if (selectedAnimalUid) renderSelectedAnimalInfo(selectedAnimalUid);
      renderFeedInventory();
    }
  }
  tickCraft(); // always tick craft regardless of active tab
  try { tickEvent(); } catch(e) { console.warn('tickEvent error:', e); G.activeEvent = null; }
  if (ticks % 30 === 0) tickOrders();
  tickAutoFields();
  if (ticks % 20 === 0) checkAllAchievements();
}

function regenWater() {
  if (!G) return;
  if (G.water < G.maxWater) {
    G.water = Math.min(G.maxWater, G.water+1);
    updateTopBar();
  }
}

function newDay() {
  if (!G) return;
  G.day++;
  G.water = G.maxWater;
  addLog(`🌅 Настав новий день ${G.day}! Вода поповнена.`);
  updateTopBar();
}

// ============================================================
// LOG
// ============================================================
function addLog(msg) {
  const log = document.getElementById('logBox');
  if (!log) return;
  const d = document.createElement('div');
  d.className = 'log-entry';
  d.textContent = msg;
  log.insertBefore(d, log.firstChild);
  while (log.children.length > 15) log.removeChild(log.lastChild);
}

// ============================================================
// FLOAT TEXT
// ============================================================
function showFloatText(text, e, center) {
  const div = document.createElement('div');
  div.className = 'float-text';
  let x = window.innerWidth/2 - 40;
  let y = window.innerHeight/2 - 40;
  if (e && e.clientX) { x = e.clientX - 20; y = e.clientY - 20; }
  div.style.left = x+'px'; div.style.top = y+'px';
  div.textContent = text;
  document.body.appendChild(div);
  setTimeout(()=>div.remove(), 1300);
}

// ============================================================
// INIT
// ============================================================

// ============================================================
// ACCOUNT MANAGEMENT
// ============================================================
function resetAccount() {
  const modal = document.getElementById('modalBox');
  modal.innerHTML = `
    <h3>🗑️ Скинути прогрес?</h3>
    <p style="color:#666;font-size:.9rem;margin:12px 0;">Весь прогрес <b>${G.displayName}</b> буде видалено — монети, тварини, поля, будинки. Акаунт залишиться.</p>
    <div class="modal-btns">
      <button class="modal-btn secondary" id="mResetCancel">Скасувати</button>
      <button class="modal-btn primary" id="mResetConfirm" style="background:linear-gradient(135deg,#e74c3c,#c0392b)">🗑️ Так, скинути!</button>
    </div>`;
  document.getElementById('mResetCancel').addEventListener('click', closeModal);
  document.getElementById('mResetConfirm').addEventListener('click', () => {
    const name = G.displayName;
    const pass = G.password;
    const joined = G.joinedDate;
    Object.assign(G, defaultGameState(name));
    G.password = pass;
    G.joinedDate = joined;
    saveCurrentGame();
    closeModal();
    renderAll();
    addLog('🔄 Прогрес скинуто! Починаємо з нуля!');
    switchTab('farm');
  });
  document.getElementById('modalOverlay').style.display = 'flex';
}

function deleteAccount() {
  const modal = document.getElementById('modalBox');
  modal.innerHTML = `
    <h3>❌ Видалити акаунт?</h3>
    <p style="color:#666;font-size:.9rem;margin:12px 0;">Акаунт <b>${G.displayName}</b> буде видалено назавжди. Це незворотньо!</p>
    <div class="modal-btns">
      <button class="modal-btn secondary" id="mDelCancel">Скасувати</button>
      <button class="modal-btn primary" id="mDelConfirm" style="background:linear-gradient(135deg,#e74c3c,#c0392b)">❌ Видалити назавжди</button>
    </div>`;
  document.getElementById('mDelCancel').addEventListener('click', closeModal);
  document.getElementById('mDelConfirm').addEventListener('click', () => {
    const name = G.displayName;
    try {
      const accounts = JSON.parse(localStorage.getItem('farm_accounts') || '{}');
      delete accounts[name];
      localStorage.setItem('farm_accounts', JSON.stringify(accounts));
    } catch(e) {}
    closeModal();
    doLogout();
  });
  document.getElementById('modalOverlay').style.display = 'flex';
}

// ============================================================
// QUESTS SYSTEM
// ============================================================
const QUEST_POOL = [
  {id:'q_w1',minLevel:1,icon:'🌾',name:'Пшеничний ранок',   desc:'Збери 5 пшениці',         type:'harvest',crop:'wheat',    target:5,   rewardCoins:120, rewardXP:40},
  {id:'q_c1',minLevel:1,icon:'🥕',name:'Морквяний день',    desc:'Збери 8 моркви',          type:'harvest',crop:'carrot',   target:8,   rewardCoins:200, rewardXP:60},
  {id:'q_s1',minLevel:1,icon:'💰',name:'Перший продаж',     desc:'Продай 10 товарів',       type:'sell',                    target:10,  rewardCoins:150, rewardXP:50},
  {id:'q_wa',minLevel:1,icon:'💧',name:'Поливний день',     desc:'Полий 10 ділянок',        type:'water',                   target:10,  rewardCoins:100, rewardXP:35},
  {id:'q_pl',minLevel:1,icon:'🌱',name:'День посіву',       desc:'Посади 15 культур',       type:'plant',                   target:15,  rewardCoins:130, rewardXP:45},
  {id:'q_co',minLevel:2,icon:'🌽',name:'Кукурудзяний урожай',desc:'Збери 10 кукурудзи',    type:'harvest',crop:'corn',     target:10,  rewardCoins:350, rewardXP:100},
  {id:'q_to',minLevel:2,icon:'🍅',name:'Томатний сезон',    desc:'Збери 10 помідорів',      type:'harvest',crop:'tomato',   target:10,  rewardCoins:450, rewardXP:120},
  {id:'q_ml',minLevel:2,icon:'🥛',name:'Молочна ферма',     desc:'Збери 5 молока',          type:'collect',product:'milk', target:5,   rewardCoins:300, rewardXP:90},
  {id:'q_eg',minLevel:2,icon:'🥚',name:'Яєчний ранок',      desc:'Збери 8 яєць',            type:'collect',product:'egg',  target:8,   rewardCoins:250, rewardXP:80},
  {id:'q_br',minLevel:2,icon:'🍞',name:'Свіжий хліб',       desc:'Скрафти 2 хліби',         type:'craft',  product:'bread',target:2,   rewardCoins:400, rewardXP:110},
  {id:'q_s5',minLevel:2,icon:'🏪',name:'Активний ринок',    desc:'Продай 50 товарів',       type:'sell',                    target:50,  rewardCoins:500, rewardXP:130},
  {id:'q_me',minLevel:4,icon:'🍉',name:'Кавуновий фест',    desc:'Збери 8 кавунів',         type:'harvest',crop:'melon',   target:8,   rewardCoins:800, rewardXP:200},
  {id:'q_pu',minLevel:6,icon:'🎃',name:'Гарбузовий тиждень',desc:'Збери 5 гарбузів',        type:'harvest',crop:'pumpkin', target:5,   rewardCoins:1200,rewardXP:300},
  {id:'q_hn',minLevel:3,icon:'🍯',name:'Медозбір',          desc:'Збери 5 меду',            type:'collect',product:'honey',target:5,   rewardCoins:700, rewardXP:180},
  {id:'q_wo',minLevel:3,icon:'🧶',name:'Вовняна ферма',     desc:'Збери 5 вовни',           type:'collect',product:'wool', target:5,   rewardCoins:600, rewardXP:160},
  {id:'q_pz',minLevel:4,icon:'🍕',name:'Піцерія',           desc:'Скрафти 1 піцу',          type:'craft',  product:'pizza',target:1,   rewardCoins:1000,rewardXP:250},
  {id:'q_ck',minLevel:4,icon:'🎂',name:'Кондитерська',      desc:'Скрафти 1 торт',          type:'craft',  product:'cake', target:1,   rewardCoins:900, rewardXP:220},
  {id:'q_au',minLevel:3,icon:'⚙️',name:'Автоматизація',     desc:'Заверши 3 авто-поля',     type:'auto',                    target:3,   rewardCoins:800, rewardXP:200},
  {id:'q_su',minLevel:3,icon:'🌻',name:'Поле соняшників',   desc:'Збери 10 насіння',        type:'harvest',crop:'sunflower',target:10, rewardCoins:600, rewardXP:150},
  {id:'q_er',minLevel:2,icon:'💎',name:'Зароби на ринку',   desc:'Зароби 2000 монет',       type:'earn',                    target:2000,rewardCoins:600, rewardXP:150},
];

function getQDef(id) { return QUEST_POOL.find(q => q.id === id); }

function generateDailyQuests() {
  if (!G.quests) G.quests = {active:[], completed:[], lastRefresh:0};
  const avail = QUEST_POOL.filter(q =>
    G.level >= q.minLevel &&
    !(G.quests.completed||[]).includes(q.id) &&
    !(G.quests.active||[]).find(a => a.id === q.id)
  );
  const need = 3 - (G.quests.active||[]).length;
  for (let i = 0; i < need && avail.length; i++) {
    const ri = Math.floor(Math.random() * avail.length);
    G.quests.active.push({id: avail.splice(ri,1)[0].id, progress: 0});
  }
}

function updateQuestProgress(type, val, extra) {
  if (!G || !G.quests || !G.quests.active) return;
  let changed = false;
  G.quests.active.forEach(aq => {
    const d = getQDef(aq.id);
    if (!d || d.type !== type) return;
    if (type === 'harvest' && d.crop    && d.crop    !== extra) return;
    if (type === 'collect' && d.product && d.product !== extra) return;
    if (type === 'craft'   && d.product && d.product !== extra) return;
    aq.progress = Math.min(d.target, (aq.progress||0) + (val||1));
    changed = true;
  });
  if (changed) {
    checkQuestCompletion();
    if (currentTab === 'quests') renderQuests();
  }
}

function checkQuestCompletion() {
  if (!G.quests || !G.quests.active) return;
  const done = G.quests.active.filter(aq => {
    const d = getQDef(aq.id);
    return d && aq.progress >= d.target;
  });
  done.forEach(aq => {
    const d = getQDef(aq.id);
    G.quests.active = G.quests.active.filter(q => q.id !== aq.id);
    G.quests.completed = G.quests.completed || [];
    G.quests.completed.push(aq.id);
    G.coins += d.rewardCoins;
    addXP(d.rewardXP);
    addLog('✅ Квест: ' + d.icon + ' ' + d.name + ' (+' + d.rewardCoins + '🪙 +' + d.rewardXP + 'XP)');
    spawnParticles('✅', window.innerWidth/2, window.innerHeight/3);
    updateTopBar();
    generateDailyQuests();
    if (currentTab === 'quests') renderQuests();
  });
}

function renderQuests() {
  const el = document.getElementById('questsContent');
  if (!el || !G) return;
  if (!G.quests) G.quests = {active:[], completed:[], lastRefresh:0};
  generateDailyQuests();
  const active = G.quests.active || [];
  const doneCount = (G.quests.completed || []).length;
  let h = '<div style="padding:0 16px 24px;">';
  h += '<div style="background:rgba(255,255,255,.15);border-radius:14px;padding:12px 16px;margin-bottom:14px;color:#fff;">';
  h += '<h2 style="margin:0 0 4px;font-size:1.3rem;">📋 Завдання</h2>';
  h += '<div style="font-size:.82rem;opacity:.85;">Виконуй — отримуй монети і XP! Нові завдання з\'являються автоматично.</div>';
  h += '</div>';
  if (!active.length) {
    h += '<div style="text-align:center;padding:40px;color:#fff;opacity:.8;font-size:1rem;">🎉 Всі завдання виконано!<br><small>Нові з\'являться скоро.</small></div>';
  }
  active.forEach(aq => {
    const d = getQDef(aq.id);
    if (!d) return;
    const pct = Math.min(100, Math.round((aq.progress||0) / d.target * 100));
    const done = pct >= 100;
    h += '<div style="background:#fff;border-radius:16px;padding:14px 16px;margin-bottom:12px;box-shadow:0 4px 16px rgba(0,0,0,.1);">';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
    h += '<span style="font-size:2rem;">' + d.icon + '</span>';
    h += '<div style="flex:1;">';
    h += '<div style="font-weight:800;font-size:1rem;color:#1a472a;">' + d.name + '</div>';
    h += '<div style="font-size:.78rem;color:#666;">' + d.desc + '</div></div>';
    h += '<div style="text-align:right;font-size:.75rem;">';
    h += '<div style="color:#f39c12;font-weight:800;">+' + d.rewardCoins + '🪙</div>';
    h += '<div style="color:#3498db;">+' + d.rewardXP + ' XP</div></div></div>';
    h += '<div style="background:#eee;border-radius:8px;height:10px;overflow:hidden;margin-bottom:4px;">';
    h += '<div style="height:100%;border-radius:8px;background:' + (done ? 'linear-gradient(90deg,#27ae60,#2ecc71)' : 'linear-gradient(90deg,#3498db,#52b788)') + ';width:' + pct + '%;transition:width .4s;"></div></div>';
    h += '<div style="display:flex;justify-content:space-between;font-size:.75rem;color:#888;">';
    h += '<span>' + (aq.progress||0) + ' / ' + d.target + '</span>';
    h += '<span style="color:' + (done ? '#27ae60' : '#aaa') + ';">' + (done ? '✅ Виконано!' : pct + '%') + '</span></div></div>';
  });
  h += '<div style="text-align:center;padding:8px;font-size:.78rem;color:rgba(255,255,255,.6);">Виконано всього: ' + doneCount + ' завдань</div>';
  h += '</div>';
  el.innerHTML = h;
}


// ============================================================
// EVENTS SYSTEM
// ============================================================

const EVENT_DEFS = {
  rain: {
    id: 'rain', icon: '🌧', cls: 'rain',
    title: 'Дощ!',
    desc: 'Усі поля политі. Посаджуй під дощ — буде бонус!',
    duration: () => 45 + Math.floor(Math.random() * 46), // 45–90s
    canStart: () => {
      if (!G) return false;
      const hasPlants = (G.cells||[]).some(c => c.state==='planted'||c.state==='growing'||c.state==='ready');
      const hasCrops = Object.keys(G.inventory||{}).length > 0 || true;
      return hasPlants || hasCrops;
    },
    onStart: () => {
      // Water bonus to all current plants
      (G.cells||[]).forEach(cell => {
        if (cell.state==='planted'||cell.state==='growing') cell.waterBonus = true;
      });
      renderGrid();
    },
    onEnd: () => {},
    reward: null,
  },

  pest: {
    id: 'pest', icon: '🐛', cls: 'pest',
    title: 'Шкідники!',
    desc: 'Прожени шкідників: 0/3',
    duration: () => 45 + Math.floor(Math.random() * 16), // 45–60s
    canStart: () => {
      if (!G) return false;
      const targets = (G.cells||[]).filter(c =>
        (c.state==='planted'||c.state==='growing') && c.state!=='auto_running'
      );
      return targets.length >= 2;
    },
    onStart: () => {
      // Pick up to 3 non-auto planted/growing cells
      const candidates = (G.cells||[])
        .map((c,i) => ({c,i}))
        .filter(({c,i}) => (c.state==='planted'||c.state==='growing') && !(G.autoFields||[]).some(af=>af.cellIndex===i && af.active));
      const count = Math.min(3, candidates.length);
      const shuffled = candidates.sort(() => Math.random()-.5).slice(0, count);
      G.activeEvent.targets = shuffled.map(({i}) => i);
      G.activeEvent.cleared = 0;
      shuffled.forEach(({i}) => { G.cells[i].pest = true; });
      renderGrid();
      setHint('🐛 ШКІДНИКИ! Клікни на клітинки з 🐛 щоб прогнати. Швидше — буде нагорода!');
      addLog('🐛 З\'явились шкідники! Переключись на Поле і клікай по заражених грядках!');
    },
    onEnd: () => {
      // Clean up any remaining pests
      (G.cells||[]).forEach(cell => {
        if (cell.pest) { cell.pest = false; cell.pestFailed = true; }
      });
      renderGrid();
    },
    onSuccess: () => {
      addLog('🏆 Шкідників переможено! +50XP +100🪙');
      addXP(50);
      G.coins += 100;
      updateTopBar();
      spawnParticles('🎉', window.innerWidth/2, window.innerHeight/3);
    },
  },
};

function canStartEvent(def) {
  return def.canStart();
}

function startRandomEvent() {
  if (!G || G.activeEvent) return;
  // Only start after player has some harvests
  if ((G.stats.harvested||0) < 3 && (G.day||1) < 2) return;

  const available = Object.values(EVENT_DEFS).filter(d => canStartEvent(d));
  if (!available.length) return;

  const def = available[Math.floor(Math.random() * available.length)];
  const duration = def.duration();

  G.activeEvent = {
    id: def.id,
    startedAt: Date.now(),
    duration: duration * 1000,
    endsAt: Date.now() + duration * 1000,
  };

  if (def.onStart) def.onStart();
  renderEventBanner();
  addLog(def.icon + ' ' + def.title + ' ' + def.desc);
}

function tickEvent() {
  if (!G) return;

  // Decrement next-event timer
  if (!G.activeEvent) {
    if (!G.eventStats) G.eventStats = {lastEvent:0, harvests:0};
    const now = Date.now();
    const minInterval = 120000; // 2 min minimum
    const maxInterval = 300000; // 5 min max
    if (!G.eventStats.nextEventAt) {
      G.eventStats.nextEventAt = now + minInterval + Math.random() * (maxInterval - minInterval);
    }
    if (now >= G.eventStats.nextEventAt) {
      startRandomEvent();
      G.eventStats.nextEventAt = now + minInterval + Math.random() * (maxInterval - minInterval);
    }
    return;
  }

  const ev = G.activeEvent;
  const def = EVENT_DEFS[ev.id];
  const remaining = Math.max(0, ev.endsAt - Date.now());

  // Update banner timer every second
  renderEventBanner();

  // Event over
  if (remaining <= 0) {
    endEvent(false);
    return;
  }
}

function endEvent(success) {
  if (!G || !G.activeEvent) return;
  const ev = G.activeEvent;
  const def = EVENT_DEFS[ev.id];
  if (!def) { G.activeEvent = null; hideEventBanner(); return; }

  if (def.onEnd) def.onEnd();
  if (success && def.onSuccess) def.onSuccess();

  if (!success && ev.id === 'pest') {
    const failed = (ev.targets||[]).filter(i => G.cells[i]?.pest).length;
    if (failed > 0) addLog('🐛 Шкідники зіпсували ' + failed + ' грядок (-20% врожаю)');
  }

  G.activeEvent = null;
  hideEventBanner();
  saveCurrentGame();
}

function renderEventBanner() {
  const banner = document.getElementById('eventBanner');
  if (!banner) return;

  if (!G || !G.activeEvent) {
    banner.style.display = 'none';
    return;
  }

  const ev = G.activeEvent;
  const def = EVENT_DEFS[ev.id];
  if (!def) return;

  const remaining = Math.max(0, Math.ceil((ev.endsAt - Date.now()) / 1000));
  const m = Math.floor(remaining / 60), s = remaining % 60;
  const timeStr = m > 0 ? m + 'хв ' + s + 'с' : s + 'с';

  banner.className = def.cls;
  banner.style.display = 'flex';
  document.getElementById('eventIcon').textContent = def.icon;
  document.getElementById('eventTimer').textContent = '⏱ ' + timeStr;

  let title = def.title;
  let desc = def.desc;

  if (ev.id === 'pest') {
    const cleared = ev.cleared || 0;
    const total = (ev.targets||[]).length;
    desc = 'Прожени шкідників: ' + cleared + '/' + total;
    title = cleared >= total ? '✅ Шкідників переможено!' : '🐛 Шкідники!';
  } else if (ev.id === 'tourist') {
    desc = '×2 ціна на крафт. Замовлень залишилось: ' + (ev.ordersLeft||0);
  }

  document.getElementById('eventTitle').textContent = title;
  document.getElementById('eventDesc').textContent = desc;
}

function hideEventBanner() {
  const banner = document.getElementById('eventBanner');
  if (banner) banner.style.display = 'none';
}



const TOURIST_ORDER_TEMPLATES = [
  { items:[{k:'carrot',qty:5}],                         coins:220,  xp:35  },
  { items:[{k:'egg',qty:4}],                            coins:260,  xp:40  },
  { items:[{k:'milk',qty:3}],                           coins:300,  xp:45  },
  { items:[{k:'honey',qty:2}],                          coins:280,  xp:40  },
  { items:[{k:'corn',qty:4}],                           coins:240,  xp:38  },
  { items:[{k:'flour',qty:5}],                          coins:200,  xp:35  },
  { items:[{k:'wool',qty:3}],                           coins:320,  xp:48  },
  { items:[{k:'bread',qty:2}],                          coins:480,  xp:70  },
  { items:[{k:'egg',qty:3},{k:'milk',qty:2}],           coins:420,  xp:65  },
  { items:[{k:'honey',qty:3},{k:'carrot',qty:4}],       coins:500,  xp:75  },
  { items:[{k:'bread',qty:2},{k:'egg',qty:4}],          coins:600,  xp:90  },
  { items:[{k:'wool',qty:4},{k:'milk',qty:3}],          coins:650,  xp:95  },
  { items:[{k:'omelette',qty:2}],                       coins:700,  xp:100 },
  { items:[{k:'pizza',qty:1}],                          coins:900,  xp:130 },
  { items:[{k:'cake',qty:1}],                           coins:850,  xp:120 },
  { items:[{k:'bread',qty:3},{k:'honey',qty:3}],        coins:800,  xp:115 },
  { items:[{k:'meat',qty:3},{k:'corn',qty:5}],          coins:750,  xp:110 },
  { items:[{k:'pizza',qty:1},{k:'bread',qty:2}],        coins:1100, xp:160 },
  { items:[{k:'cake',qty:1},{k:'milk',qty:4}],          coins:1000, xp:150 },
  { items:[{k:'omelette',qty:2},{k:'honey',qty:3}],     coins:950,  xp:140 },
];

// ============================================================
// CITY ORDERS (requires truck)
// ============================================================
function initCityOrdersSystem(force) {
  if (!G) return;
  if (!G.cityOrders) G.cityOrders = { orders: [], nextRefreshAt: 0 };
  if (!G.cityOrders.orders) G.cityOrders.orders = [];
  if (!isCityOrdersUnlocked()) return;
  const slots = getCityOrderSlots();
  if (slots <= 0) return;
  const now = Date.now();
  if (force || !G.cityOrders.nextRefreshAt) G.cityOrders.nextRefreshAt = now;
  if (now >= (G.cityOrders.nextRefreshAt||0) || (G.cityOrders.orders||[]).length > slots) {
    // refresh window: every 10 minutes
    if (now >= (G.cityOrders.nextRefreshAt||0)) {
      G.cityOrders.orders = [];
      G.cityOrders.nextRefreshAt = now + 10*60*1000;
    }
  }
  // Fill up to slots
  while ((G.cityOrders.orders||[]).length < slots) {
    G.cityOrders.orders.push(generateCityOrder());
  }
  // Trim extra
  if ((G.cityOrders.orders||[]).length > slots) G.cityOrders.orders = G.cityOrders.orders.slice(0, slots);
}

function randInt(a,b){ return Math.floor(a + Math.random()*(b-a+1)); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function generateCityOrder() {
  // Build from products available in game (skip unknown)
  const pool = Object.entries(PRODUCTS).filter(([k,p]) => p && p.sellPrice > 0);
  const count = Math.random() < 0.65 ? 1 : 2;
  const items = [];
  const used = new Set();
  for (let i=0;i<count;i++){
    const [k,p] = pick(pool);
    if (used.has(k)) { i--; continue; }
    used.add(k);
    const base = PRODUCTS[k]?.category === 'crafted' ? randInt(1,2) : PRODUCTS[k]?.category === 'animal' ? randInt(2,4) : randInt(4,8);
    items.push({k, qty: base});
  }
  const rawValue = items.reduce((s,it)=> s + (PRODUCTS[it.k]?.sellPrice||0) * it.qty, 0);
  const mul = getTruckRewardMul();
  const coins = Math.max(60, Math.round(rawValue * (0.95 + Math.random()*0.35) * mul));
  const xp = Math.max(15, Math.round((coins/10) * (0.7 + Math.random()*0.3)));
  return { id: 'cord_' + Date.now() + '_' + Math.floor(Math.random()*9999), items, coins, xp };
}

function canFulfillCityOrder(order) {
  return order.items.every(i => (G.inventory[i.k] || 0) >= i.qty);
}

function fulfillCityOrder(orderId) {
  if (!G || !G.cityOrders || !G.cityOrders.orders) return;
  const idx = G.cityOrders.orders.findIndex(o => o.id === orderId);
  if (idx < 0) return;
  const order = G.cityOrders.orders[idx];
  if (!canFulfillCityOrder(order)) return addLog('❌ Не вистачає товарів для доставки.');
  order.items.forEach(item => {
    G.inventory[item.k] = (G.inventory[item.k] || 0) - item.qty;
    if (G.inventory[item.k] <= 0) delete G.inventory[item.k];
  });
  G.coins += order.coins;
  G.stats.earned += order.coins;
  addXP(order.xp);
  addLog(`🏙️ Доставка в місто виконана! +${order.coins}🪙 +${order.xp}XP`);
  spawnParticles('🚚', window.innerWidth/2, window.innerHeight/2);
  // Replace slot with a new order
  G.cityOrders.orders.splice(idx, 1);
  initCityOrdersSystem(false);
  updateTopBar();
  if (currentTab === 'orders') renderOrders();
  if (currentTab === 'inventory') renderInventory();
  saveCurrentGame();
}

function nextTouristDelay() {
  return (8 + Math.random() * 17) * 60000; // 8–25 minutes
}

function initTouristSystem() {
  if (!G.tourist) G.tourist = { nextVisitAt: Date.now() + nextTouristDelay(), visit: null };
}

function startTouristVisit() {
  if (!G || !G.tourist || G.tourist.visit) return;
  const shuffled = [...TOURIST_ORDER_TEMPLATES].sort(() => Math.random() - .5);
  G.tourist.visit = {
    startedAt: Date.now(),
    expiresAt: Date.now() + 900000,
    chainIndex: 0,
    orders: shuffled.slice(0, 5).map((t, i) => ({
      id: 'tord_' + i + '_' + Date.now(),
      items: t.items.map(x => ({...x})),
      coins: t.coins, xp: t.xp,
    })),
    completedCount: 0,
  };
  addLog('\u{1F9F3} Турист завітав на ферму! У нього 5 замовлень — встигни за 15 хвилин!');
  spawnParticles('\u{1F9F3}', window.innerWidth/2, window.innerHeight/4);
  showTouristBanner();
  if (currentTab === 'orders') renderOrders();
}

function tickOrders() {
  if (!G) return;
  initTouristSystem();
  initCityOrdersSystem(false);
  const now = Date.now();
  const t = G.tourist;
  if (!t.visit) {
    if (now >= t.nextVisitAt) startTouristVisit();
    if (currentTab === 'orders') renderOrders();
    return;
  }
  if (now >= t.visit.expiresAt) {
    const done = t.visit.completedCount;
    const total = t.visit.orders.length;
    if (done < total) addLog('\u{1F9F3} Турист пішов... Виконано ' + done + '/' + total + ' замовлень.');
    t.visit = null;
    t.nextVisitAt = now + nextTouristDelay();
    hideTouristBanner();
    if (currentTab === 'orders') renderOrders();
    return;
  }
  updateTouristBannerTimer();
  if (currentTab === 'orders') renderOrders();
}

function canFulfillTOrder(order) {
  return order.items.every(i => (G.inventory[i.k] || 0) >= i.qty);
}

function fulfillTOrder(orderId) {
  if (!G || !G.tourist || !G.tourist.visit) return;
  const visit = G.tourist.visit;
  const ci = visit.chainIndex;
  const order = visit.orders[ci];
  if (!order || order.id !== orderId) return;
  if (!canFulfillTOrder(order)) return;
  order.items.forEach(item => {
    G.inventory[item.k] = (G.inventory[item.k] || 0) - item.qty;
    if (G.inventory[item.k] <= 0) delete G.inventory[item.k];
  });
  G.coins += order.coins;
  G.stats.earned += order.coins;
  addXP(order.xp);
  visit.completedCount++;
  visit.chainIndex++;
  addLog('\u{1F9F3} Туристу доставлено! +' + order.coins + '\u{1FA99} +' + order.xp + 'XP');
  spawnParticles('\u{1F4B0}', window.innerWidth/2, window.innerHeight/2);
  updateTopBar();
  if (visit.chainIndex >= visit.orders.length) {
    G.coins += 500; addXP(200);
    addLog('\u{1F389} Всі 5 замовлень туриста виконано! Бонус +500\u{1FA99} +200XP!');
    spawnParticles('\u{1F389}', window.innerWidth/2, window.innerHeight/3);
    G.tourist.visit = null;
    G.tourist.nextVisitAt = Date.now() + nextTouristDelay();
    hideTouristBanner();
    updateTopBar();
  }
  if (currentTab === 'orders') renderOrders();
  if (currentTab === 'inventory') renderInventory();
  saveCurrentGame();
}

function showTouristBanner() {
  const banner = document.getElementById('eventBanner');
  if (!banner) return;
  banner.className = 'tourist';
  banner.style.display = 'flex';
  banner.style.cursor = 'pointer';
  banner.onclick = () => switchTab('orders');
  document.getElementById('eventIcon').textContent = '\u{1F9F3}';
  document.getElementById('eventTitle').textContent = 'Турист на фермі!';
  document.getElementById('eventDesc').textContent = 'У нього 5 замовлень — натисни щоб відкрити';
  updateTouristBannerTimer();
}

function updateTouristBannerTimer() {
  if (!G || !G.tourist || !G.tourist.visit) return;
  const remaining = Math.max(0, Math.ceil((G.tourist.visit.expiresAt - Date.now()) / 1000));
  const m = Math.floor(remaining / 60), s = remaining % 60;
  const timer = document.getElementById('eventTimer');
  if (timer) timer.textContent = '\u23f1 ' + (m > 0 ? m + 'хв ' + s + 'с' : s + 'с');
}

function hideTouristBanner() {
  const banner = document.getElementById('eventBanner');
  if (banner) { banner.style.display = 'none'; banner.onclick = null; }
}

function renderOrders() {
  const el = document.getElementById('ordersContent');
  if (!el || !G) return;
  initTouristSystem();
  initCityOrdersSystem(false);
  const now = Date.now();
  const t = G.tourist;
  let h = '<div style="padding:0 16px 28px;">';
  // --- Tourist section ---
  h += '<div class="orders-section-title" style="color:#fff;margin:18px 0 10px;font-weight:900;">🧳 Турист</div>';
  if (!t.visit) {
    h += '<div style="background:rgba(255,255,255,.1);border-radius:14px;padding:24px 18px;margin:10px 0 16px;text-align:center;color:#fff;">';
    h += '<div style="font-size:3.2rem;margin-bottom:10px;opacity:.5;">\u{1F9F3}</div>';
    h += '<div style="font-weight:800;font-size:1.05rem;margin-bottom:6px;opacity:.75;">Туриста зараз немає</div>';
    h += '<div style="font-size:.82rem;opacity:.5;">Він завітає несподівано — будь готовий!</div>';
    h += '</div>';
  } else {
    const visit = t.visit;
    const ci = visit.chainIndex;
    const remaining = Math.max(0, Math.ceil((visit.expiresAt - now) / 1000));
    const mins = Math.floor(remaining / 60), secs = remaining % 60;
    const timeStr = mins > 0 ? mins + 'хв ' + secs + 'с' : secs + 'с';
    const urgent = remaining < 180;
    h += '<div style="background:linear-gradient(135deg,#7b1fa2,#9c27b0);border-radius:14px;padding:14px 16px;margin-bottom:16px;color:#fff;">';
    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
    h += '<span style="font-size:2.5rem;">\u{1F9F3}</span>';
    h += '<div style="flex:1"><div style="font-weight:800;font-size:1.1rem;">Турист на фермі!</div>';
    h += '<div style="font-size:.8rem;opacity:.85;">Виконай замовлення щоб відкрити наступне</div></div>';
    h += '<div style="text-align:right;"><div style="font-size:.72rem;opacity:.8;">Залишилось</div>';
    h += '<div style="font-weight:900;font-size:1rem;' + (urgent ? 'color:#ffcc00' : '') + '">' + timeStr + '</div></div></div>';
    const visitPct = Math.round((visit.expiresAt - now) / 900000 * 100);
    h += '<div style="background:rgba(255,255,255,.2);border-radius:4px;height:6px;overflow:hidden;">';
    h += '<div style="height:100%;border-radius:4px;background:' + (urgent?'#ffcc00':'#fff') + ';width:' + Math.max(0,visitPct) + '%;transition:width 1s;"></div></div>';
    h += '<div style="display:flex;gap:8px;margin-top:10px;justify-content:center;">';
    for (let i = 0; i < 5; i++) {
      const d=i<ci, cur=i===ci, nxt=i===ci+1;
      h += '<span style="font-size:1.1rem;">' + (d?'\u2705':cur?'\u{1F535}':nxt?'\u2B1C':'\u{1F512}') + '</span>';
      if (i<4) h += '<span style="opacity:.3;font-size:.7rem;">──</span>';
    }
    h += '</div></div>';
    for (let i = 0; i < 5; i++) {
      const order = visit.orders[i];
      const isDone=i<ci, isCur=i===ci, isNxt=i===ci+1, isFog=i>ci+1;
      if (isDone) {
        h += '<div style="background:rgba(39,174,96,.2);border:2px solid rgba(39,174,96,.5);border-radius:14px;padding:10px 16px;margin-bottom:10px;display:flex;align-items:center;gap:10px;opacity:.6;">';
        h += '<span style="font-size:1.8rem;">\u2705</span><div style="color:#fff;font-size:.9rem;font-weight:700;">Замовлення '+(i+1)+' — виконано!</div></div>';
        continue;
      }
      if (isFog) {
        h += '<div style="background:rgba(0,0,0,.3);border:2px dashed rgba(255,255,255,.12);border-radius:14px;padding:18px;margin-bottom:10px;text-align:center;">';
        h += '<div style="font-size:2rem;margin-bottom:4px;">\u{1F512}</div>';
        h += '<div style="color:rgba(255,255,255,.35);font-size:.82rem;">Замовлення '+(i+1)+'</div></div>';
        continue;
      }
      if (!order) continue;
      const ok = isCur && canFulfillTOrder(order);
      const tot = order.items.reduce((s,x)=>s+x.qty,0);
      const hav = order.items.reduce((s,x)=>s+Math.min(x.qty,G.inventory[x.k]||0),0);
      const pct = Math.round(hav/tot*100);
      h += '<div class="order-card tier'+(isCur?'2':'1')+'" style="'+(isNxt?'opacity:.6;':'')+'">';
      if (isNxt) h += '<div style="position:absolute;top:8px;right:12px;background:#f39c12;color:#fff;font-size:.65rem;font-weight:800;padding:2px 8px;border-radius:6px;">НАСТУПНЕ</div>';
      h += '<div class="order-header"><span class="order-client-icon">\u{1F9F3}</span>';
      h += '<div><div class="order-client-name">Замовлення '+(i+1)+' / 5</div><div style="font-size:.72rem;color:#888;">Турист</div></div></div>';
      if (isCur && pct>0 && pct<100) {
        h += '<div class="order-progress-bar"><div class="order-progress-fill" style="width:'+pct+'%"></div></div>';
      }
      h += '<div class="order-items">';
      order.items.forEach(function(item) {
        const p=PRODUCTS[item.k]; if (!p) return;
        const have=isCur?(G.inventory[item.k]||0):0;
        const good=isCur&&have>=item.qty;
        h += '<div class="order-item '+(isCur?(good?'have':'missing'):'')+'">'
          + p.emoji+' <b>'+p.name+'</b> \xd7'+item.qty+(isCur?' (\u0454: '+have+')':'')+'</div>';
      });
      h += '</div><div class="order-reward">';
      h += '<div class="order-reward-coins">+'+order.coins+'\u{1FA99}</div>';
      h += '<div class="order-reward-xp">+'+order.xp+'XP</div>';
      if (isCur) {
        h += '<button class="order-deliver-btn'+(ok?'':' partial')+'" '+(ok?'':'disabled')+' onclick="fulfillTOrder(\''+order.id+'\')">'+  (ok ? '📦 Доставити!' : '⏳ Зібрати...')+'</button>';
      }
      h += '</div></div>';
    }
  }

  // --- City orders section ---
  h += '<div class="orders-section-title" style="color:#fff;margin:18px 0 10px;font-weight:900;">🏙️ Міські замовлення</div>';
  if (!isCityOrdersUnlocked()) {
    h += '<div style="background:rgba(0,0,0,.25);border:2px dashed rgba(255,255,255,.18);border-radius:14px;padding:18px;text-align:center;color:#fff;">';
    h += '<div style="font-size:2.4rem;margin-bottom:6px;opacity:.7;">🚚</div>';
    h += '<div style="font-weight:900;margin-bottom:6px;opacity:.85;">Зачинено</div>';
    h += '<div style="font-size:.82rem;opacity:.65;">Побудуй вантажівку у вкладці "🏡 Двір", щоб відкрити міські замовлення.</div>';
    h += '</div>';
  } else if (getCityOrderSlots() <= 0) {
    h += '<div style="background:rgba(0,0,0,.25);border:2px dashed rgba(255,255,255,.18);border-radius:14px;padding:18px;text-align:center;color:#fff;">';
    h += '<div style="font-size:2.4rem;margin-bottom:6px;opacity:.7;">🏚</div>';
    h += '<div style="font-weight:900;margin-bottom:6px;opacity:.85;">Нема слотів</div>';
    h += '<div style="font-size:.82rem;opacity:.65;">Підніми HQ у "🏡 Двір" щоб отримати слоти замовлень.</div>';
    h += '</div>';
  } else {
    const co = G.cityOrders || {orders:[]};
    const orders = co.orders || [];
    const rem = Math.max(0, Math.ceil(((co.nextRefreshAt||0) - now)/1000));
    const rm = Math.floor(rem/60), rs = rem%60;
    const tStr = rem>0 ? (rm>0?`${rm}хв ${rs}с`:`${rs}с`) : 'готово';
    h += `<div style="background:rgba(255,255,255,.12);border-radius:14px;padding:12px 14px;margin-bottom:10px;color:#fff;display:flex;align-items:center;gap:10px;">
      <div style="font-size:1.8rem;">🚚</div>
      <div style="flex:1;">
        <div style="font-weight:900;">Слоти: ${orders.length}/${getCityOrderSlots()}</div>
        <div style="font-size:.8rem;opacity:.75;">Оновлення: ⏱ ${tStr} • Бонус вантажівки: ×${getTruckRewardMul().toFixed(2)}</div>
      </div>
      <button class="order-deliver-btn" style="background:linear-gradient(135deg,#3498db,#1a6fa8);" onclick="initCityOrdersSystem(true);renderOrders()">🔄 Оновити</button>
    </div>`;
    orders.forEach(order => {
      const ok = canFulfillCityOrder(order);
      h += '<div class="order-card tier1">';
      h += '<div class="order-header"><span class="order-client-icon">🏙️</span>';
      h += '<div><div class="order-client-name">Місто</div><div style="font-size:.72rem;color:#888;">Вантажівка</div></div></div>';
      h += '<div class="order-items">';
      order.items.forEach(item => {
        const p=PRODUCTS[item.k]; if (!p) return;
        const have=(G.inventory[item.k]||0);
        const good=have>=item.qty;
        h += '<div class="order-item '+(good?'have':'missing')+'">'
          + p.emoji+' <b>'+p.name+'</b> \xd7'+item.qty+' (\u0454: '+have+')</div>';
      });
      h += '</div><div class="order-reward">';
      h += '<div class="order-reward-coins">+'+order.coins+'\u{1FA99}</div>';
      h += '<div class="order-reward-xp">+'+order.xp+'XP</div>';
      h += '<button class="order-deliver-btn'+(ok?'':' partial')+'" '+(ok?'':'disabled')+' onclick="fulfillCityOrder(\''+order.id+'\')">'+(ok?'🚚 Доставити!':'⏳ Зібрати...')+'</button>';
      h += '</div></div>';
    });
  }

  h += '</div>';
  el.innerHTML = h;
}

window.onload = () => {
  // ---- AUTH ----
  document.getElementById('tabLogin').addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('tabRegister').addEventListener('click', () => switchAuthTab('register'));
  document.getElementById('btnLogin').addEventListener('click', doLogin);
  document.getElementById('btnRegister').addEventListener('click', doRegister);

  // Enter key on auth inputs
  ['loginName','loginPass'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
  });
  ['regName','regPass','regPass2'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => { if(e.key==='Enter') doRegister(); });
  });

  // ---- GAME NAV ----
  document.getElementById('userBadge').addEventListener('click', () => switchTab('profile'));
  document.getElementById('btnLogout').addEventListener('click', doLogout);
  document.getElementById('tabFarm').addEventListener('click', () => switchTab('farm'));
  document.getElementById('tabAnimals').addEventListener('click', () => switchTab('animals'));
  document.getElementById('tabHouses').addEventListener('click', () => switchTab('houses'));
  document.getElementById('tabYard').addEventListener('click', () => switchTab('yard'));
  document.getElementById('tabInventory').addEventListener('click', () => switchTab('inventory'));
  document.getElementById('tabCraft').addEventListener('click', () => switchTab('craft'));
  document.getElementById('tabMarket').addEventListener('click', () => switchTab('market'));
  document.getElementById('tabOrders').addEventListener('click', () => switchTab('orders'));
  document.getElementById('tabQuests').addEventListener('click', () => switchTab('quests'));
  document.getElementById('tabProfile').addEventListener('click', () => switchTab('profile'));
  document.getElementById('btnResetAccount').addEventListener('click', resetAccount);
  document.getElementById('btnDeleteAccount').addEventListener('click', deleteAccount);

  // ---- FARM ----
  document.getElementById('toolWater').addEventListener('click', () => selectTool('water'));
  document.getElementById('toolHarvest').addEventListener('click', () => selectTool('harvest'));
  document.getElementById('toolPlow').addEventListener('click', () => selectTool('plow'));
  document.getElementById('toolAuto').addEventListener('click', () => selectTool('auto'));
  document.getElementById('btnHarvestAll').addEventListener('click', harvestAll);

  // ---- ANIMALS ----
  document.getElementById('btnCollectAll').addEventListener('click', collectAllProducts);
  document.getElementById('btnFeedAll').addEventListener('click', feedAllAnimals);

  // ---- MODAL ----
  document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  // ---- KEYBOARD ----
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  renderSavedAccounts();
};