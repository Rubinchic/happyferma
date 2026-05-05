export const RECIPES = [
  {id:'butter',    output:'butter',    outputAmt:1, name:'Масло',           category:'dairy',  ingredients:{milk:3},                              time:5,  xp:10, desc:'Збиваємо молоко до густого масла'},
  {id:'cheese',    output:'cheese',    outputAmt:1, name:'Сир',             category:'dairy',  ingredients:{milk:4},                              time:8,  xp:15, desc:'Молоко ферментується у смачний сир'},
  {id:'bread',     output:'bread',     outputAmt:1, name:'Хліб',            category:'bakery', ingredients:{flour:2,milk:1,egg:1},                time:10, xp:20, desc:'Класичний домашній хліб'},
  {id:'omelette',  output:'omelette',  outputAmt:1, name:'Омлет',           category:'bakery', ingredients:{egg:3,milk:1},                        time:5,  xp:12, desc:'Пухкий омлет на сніданок'},
  {id:'honey_bun', output:'honey_bun', outputAmt:2, name:'Булочки з медом', category:'bakery', ingredients:{flour:2,butter:1,honey:1},             time:12, xp:30, desc:'Солодкі медові булочки. Потрібно спочатку зробити масло!'},
  {id:'cake',      output:'cake',      outputAmt:1, name:'Торт',            category:'bakery', ingredients:{flour:3,egg:3,milk:2,honey:2,butter:2},time:20, xp:60, desc:'Розкішний святковий торт!'},
  {id:'soup',      output:'soup',      outputAmt:2, name:'Суп',             category:'meals',  ingredients:{carrot:2,corn:1,tomato:2},             time:8,  xp:18, desc:'Ароматний овочевий суп'},
  {id:'pizza',     output:'pizza',     outputAmt:1, name:'Піца',            category:'meals',  ingredients:{flour:2,egg:1,milk:1,cheese:1,tomato:2,meat:1}, time:20, xp:50, desc:'Справжня піца з усього найкращого! Потрібен сир.'},
];

export const RECIPE_CATEGORIES = {
  dairy:  {label:'🥛 Молочне', color:'#e3f2fd'},
  bakery: {label:'🍞 Випічка',  color:'#fff8e1'},
  meals:  {label:'🍽 Страви',   color:'#fce4ec'},
};
