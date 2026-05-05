export const YARD_DEF = {
  hq: {
    id:'hq', icon:'🏚', name:'Дім фермера',
    levels:[
      {lvl:1, reqLevel:1,  upgradeCost:600,   autoSlots:0, orderSlots:1, label:'Старий дім'},
      {lvl:2, reqLevel:3,  upgradeCost:4500,  autoSlots:1, orderSlots:2, label:'Надійний дім'},
      {lvl:3, reqLevel:7,  upgradeCost:28000, autoSlots:2, orderSlots:3, label:'Штаб ферми'},
      {lvl:4, reqLevel:12, upgradeCost:null,  autoSlots:3, orderSlots:4, label:'Панська садиба'},
    ],
  },
  barn: {
    id:'barn', icon:'📦', name:'Склад / Амбар',
    levels:[
      {lvl:1, reqLevel:1,  upgradeCost:900,   invCap:250, label:'Старий амбар'},
      {lvl:2, reqLevel:4,  upgradeCost:6500,  invCap:350, label:'Охайний склад'},
      {lvl:3, reqLevel:8,  upgradeCost:42000, invCap:500, label:'Великий склад'},
      {lvl:4, reqLevel:13, upgradeCost:null,  invCap:700, label:'Логістичний центр'},
    ],
  },
  kitchen: {
    id:'kitchen', icon:'🍳', name:'Кухня (крафт-слоти)',
    levels:[
      {lvl:1, reqLevel:1,  upgradeCost:700,  craftSlots:1, label:'Плита'},
      {lvl:2, reqLevel:5,  upgradeCost:9000, craftSlots:2, label:'Кухня'},
      {lvl:3, reqLevel:10, upgradeCost:null, craftSlots:3, label:'Міні-цех'},
    ],
  },
  truck: {
    id:'truck', icon:'🚚', name:'Вантажівка (міські замовлення)',
    levels:[
      {lvl:0, reqLevel:2,  upgradeCost:2500,  reqItems:[{k:'boards',qty:20},{k:'steel',qty:12},{k:'rubber',qty:6}],          cityUnlocked:false, rewardMul:1.0,  slotBonus:0, label:'Не збудовано'},
      {lvl:1, reqLevel:2,  upgradeCost:16000, reqItems:[{k:'steel',qty:30},{k:'engine_parts',qty:8},{k:'rubber',qty:14}],    cityUnlocked:true,  rewardMul:1.0,  slotBonus:0, label:'Стара вантажівка'},
      {lvl:2, reqLevel:6,  upgradeCost:90000, reqItems:[{k:'steel',qty:60},{k:'electronics',qty:12},{k:'fuel',qty:20}],      cityUnlocked:true,  rewardMul:1.15, slotBonus:1, label:'Надійна вантажівка'},
      {lvl:3, reqLevel:11, upgradeCost:null,  reqItems:[{k:'steel',qty:90},{k:'hydraulics',qty:16},{k:'tires',qty:10}],      cityUnlocked:true,  rewardMul:1.30, slotBonus:1, label:'Фура'},
    ],
  }
};

export const GROUND_TTL_MS    = 10 * 60 * 1000;
export const GROUND_CAP_QTY   = 220;
export const INV_LEVEL_BONUS_PCT  = 0.07;
export const INV_EVERY5_BONUS_PCT = 0.12;
export const GRID_SIZE = 35;
