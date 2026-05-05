export const PRODUCTS = {
  flour:    {emoji:'🥐',    name:'Борошно',          sellPrice:22,  feedValue:10, category:'crop'},
  carrot:   {emoji:'🥕',    name:'Морква',           sellPrice:28,  feedValue:20, category:'crop'},
  corn:     {emoji:'🌽',    name:'Кукурудза',        sellPrice:30,  feedValue:25, category:'crop'},
  tomato:   {emoji:'🍅',    name:'Помідор',          sellPrice:40,  feedValue:30, category:'crop'},
  seeds:    {emoji:'🌻',    name:'Насіння',          sellPrice:48,  feedValue:25, category:'crop'},
  melon:    {emoji:'🍉',    name:'Кавун',            sellPrice:65,  feedValue:40, category:'crop'},
  pumpkin:  {emoji:'🎃',    name:'Гарбуз',           sellPrice:90,  feedValue:50, category:'crop'},
  milk:     {emoji:'🥛',    name:'Молоко',           sellPrice:45,  feedValue:0,  category:'animal'},
  egg:      {emoji:'🥚',    name:'Яйце',             sellPrice:25,  feedValue:0,  category:'animal'},
  wool:     {emoji:'🧶',    name:'Вовна',            sellPrice:60,  feedValue:0,  category:'animal'},
  honey:    {emoji:'🍯',    name:'Мед',              sellPrice:80,  feedValue:0,  category:'animal'},
  feather:  {emoji:'🪶',    name:"Пір'я",            sellPrice:30,  feedValue:0,  category:'animal'},
  meat:     {emoji:'🥩',    name:"М'ясо",            sellPrice:70,  feedValue:0,  category:'animal'},
  butter:   {emoji:'🧈',    name:'Масло',            sellPrice:80,  feedValue:0,  category:'crafted'},
  cheese:   {emoji:'🧀',    name:'Сир',              sellPrice:90,  feedValue:0,  category:'crafted'},
  bread:    {emoji:'🍞',    name:'Хліб',             sellPrice:120, feedValue:0,  category:'crafted'},
  honey_bun:{emoji:'🍯🍞',  name:'Булочка з медом',  sellPrice:200, feedValue:0,  category:'crafted'},
  pizza:    {emoji:'🍕',    name:'Піца',             sellPrice:350, feedValue:0,  category:'crafted'},
  omelette: {emoji:'🍳',    name:'Омлет',            sellPrice:85,  feedValue:0,  category:'crafted'},
  cake:     {emoji:'🎂',    name:'Торт',             sellPrice:280, feedValue:0,  category:'crafted'},
  soup:     {emoji:'🍲',    name:'Суп',              sellPrice:150, feedValue:0,  category:'crafted'},
};

export const RESOURCE_LABELS = {
  boards:       {emoji:'🪵', name:'Дошки'},
  steel:        {emoji:'🧱', name:'Сталь'},
  rubber:       {emoji:'🛞', name:'Гума'},
  tires:        {emoji:'🛞', name:'Шини'},
  engine_parts: {emoji:'⚙️', name:'Деталі двигуна'},
  electronics:  {emoji:'🔌', name:'Електроніка'},
  hydraulics:   {emoji:'🧰', name:'Гідравліка'},
  fuel:         {emoji:'⛽', name:'Пальне'},
};

export function getItemLabel(k) {
  const p = PRODUCTS[k];
  if (p) return {emoji: p.emoji, name: p.name};
  const r = RESOURCE_LABELS[k];
  if (r) return r;
  return {emoji:'📦', name:k};
}
