export const ANIMALS_DEF = [
  {id:'cow',    emoji:'🐄',name:'Корова', cost:300, produces:'milk',    produceTime:40,  feedCost:30, happinessDecay:8,  unlockLevel:2},
  {id:'chicken',emoji:'🐓',name:'Курка',  cost:150, produces:'egg',     produceTime:25,  feedCost:15, happinessDecay:10, unlockLevel:1},
  {id:'sheep',  emoji:'🐑',name:'Вівця',  cost:250, produces:'wool',    produceTime:60,  feedCost:25, happinessDecay:7,  unlockLevel:2},
  {id:'bee',    emoji:'🐝',name:'Бджоли', cost:400, produces:'honey',   produceTime:90,  feedCost:20, happinessDecay:5,  unlockLevel:3},
  {id:'duck',   emoji:'🦆',name:'Качка',  cost:200, produces:'feather', produceTime:50,  feedCost:18, happinessDecay:9,  unlockLevel:3},
  {id:'pig',    emoji:'🐷',name:'Свиня',  cost:350, produces:'meat',    produceTime:70,  feedCost:35, happinessDecay:8,  unlockLevel:4},
];

export const HOUSES_DEF = [
  {
    id:'chicken_coop', animalId:'chicken',
    name:'Курник', icon:'🏚',
    unlockLevel:1, buildCost:0,
    levels:[
      {lvl:1, capacity:2,  reqLevel:1,  label:"Старий курник",     upgradeCost:500,    upgradeLabel:"Дерев'яний",   produceBonus:1.0},
      {lvl:2, capacity:5,  reqLevel:2,  label:"Дерев'яний курник", upgradeCost:3000,   upgradeLabel:'Цегляний',     produceBonus:1.2},
      {lvl:3, capacity:10, reqLevel:5,  label:'Цегляний курник',   upgradeCost:15000,  upgradeLabel:'Промисловий',  produceBonus:1.5},
      {lvl:4, capacity:20, reqLevel:9,  label:'Птахофабрика',      upgradeCost:null,   upgradeLabel:'Максимум',     produceBonus:2.0},
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
      {lvl:1, capacity:2,  reqLevel:2,  label:'Мала овчарня',    upgradeCost:4000,   upgradeLabel:'Середня',       produceBonus:1.0},
      {lvl:2, capacity:5,  reqLevel:4,  label:'Середня овчарня', upgradeCost:20000,  upgradeLabel:'Велика',        produceBonus:1.3},
      {lvl:3, capacity:9,  reqLevel:8,  label:'Велика овчарня',  upgradeCost:100000, upgradeLabel:'Вовняна ферма', produceBonus:1.6},
      {lvl:4, capacity:16, reqLevel:13, label:'Вовняна ферма',   upgradeCost:null,   upgradeLabel:'Максимум',      produceBonus:2.0},
    ]
  },
  {
    id:'beehive', animalId:'bee',
    name:'Вулик', icon:'🏺',
    unlockLevel:3, buildCost:2000,
    levels:[
      {lvl:1, capacity:1,  reqLevel:3,  label:'Малий вулик',    upgradeCost:8000,   upgradeLabel:'Середній', produceBonus:1.0},
      {lvl:2, capacity:3,  reqLevel:6,  label:'Середній вулик', upgradeCost:40000,  upgradeLabel:'Великий',  produceBonus:1.4},
      {lvl:3, capacity:6,  reqLevel:10, label:'Великий вулик',  upgradeCost:200000, upgradeLabel:'Пасіка',   produceBonus:1.8},
      {lvl:4, capacity:12, reqLevel:15, label:'Медова пасіка',  upgradeCost:null,   upgradeLabel:'Максимум', produceBonus:2.5},
    ]
  },
  {
    id:'duck_pond', animalId:'duck',
    name:'Качина ферма', icon:'⛺',
    unlockLevel:3, buildCost:1200,
    levels:[
      {lvl:1, capacity:2,  reqLevel:3,  label:'Малий ставок',  upgradeCost:6000,   upgradeLabel:'Середній',      produceBonus:1.0},
      {lvl:2, capacity:5,  reqLevel:5,  label:'Середній ставок',upgradeCost:30000, upgradeLabel:'Великий',        produceBonus:1.3},
      {lvl:3, capacity:9,  reqLevel:9,  label:'Велике озеро',  upgradeCost:150000, upgradeLabel:'Качина ферма',   produceBonus:1.6},
      {lvl:4, capacity:15, reqLevel:14, label:'Качина ферма',  upgradeCost:null,   upgradeLabel:'Максимум',       produceBonus:2.0},
    ]
  },
  {
    id:'pigsty', animalId:'pig',
    name:'Свинарник', icon:'🏗',
    unlockLevel:4, buildCost:3000,
    levels:[
      {lvl:1, capacity:1,  reqLevel:4,  label:'Малий свинарник',    upgradeCost:10000,  upgradeLabel:'Середній',       produceBonus:1.0},
      {lvl:2, capacity:3,  reqLevel:7,  label:'Середній свинарник', upgradeCost:50000,  upgradeLabel:'Великий',        produceBonus:1.3},
      {lvl:3, capacity:6,  reqLevel:11, label:'Великий свинарник',  upgradeCost:250000, upgradeLabel:"М'ясний завод",  produceBonus:1.7},
      {lvl:4, capacity:10, reqLevel:16, label:"М'ясний завод",      upgradeCost:null,   upgradeLabel:'Максимум',       produceBonus:2.2},
    ]
  },
];
