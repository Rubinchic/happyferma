// ============================================================
// MAIN ENTRY — імпортує всі модулі і робить їх глобально 
// доступними для game.js (який використовує window.*)
// ============================================================

import { CROPS }               from './data/crops.js';
import { PRODUCTS, RESOURCE_LABELS, getItemLabel } from './data/products.js';
import { ANIMALS_DEF, HOUSES_DEF }  from './data/animals.js';
import { RECIPES, RECIPE_CATEGORIES } from './data/recipes.js';
import { ACHIEVEMENTS, ACHIEVEMENT_TARGETS } from './data/achievements.js';
import { QUEST_POOL }          from './data/quests.js';
import { YARD_DEF, GROUND_TTL_MS, GROUND_CAP_QTY, INV_LEVEL_BONUS_PCT, INV_EVERY5_BONUS_PCT, GRID_SIZE } from './data/yard.js';
import { TOURIST_ORDER_TEMPLATES } from './data/orders.js';
import { apiLogin, apiRegister, apiSave, saveKnownUser, loadKnownUsers } from './api/server.js';

// Expose everything to global scope so game.js (non-module) can access
Object.assign(window, {
  CROPS, PRODUCTS, RESOURCE_LABELS, getItemLabel,
  ANIMALS_DEF, HOUSES_DEF,
  RECIPES, RECIPE_CATEGORIES,
  ACHIEVEMENTS, ACHIEVEMENT_TARGETS,
  QUEST_POOL,
  YARD_DEF, GROUND_TTL_MS, GROUND_CAP_QTY,
  INV_LEVEL_BONUS_PCT, INV_EVERY5_BONUS_PCT, GRID_SIZE,
  TOURIST_ORDER_TEMPLATES,
  // API helpers
  _apiLogin: apiLogin,
  _apiRegister: apiRegister,
  _apiSave: apiSave,
  _saveKnownUser: saveKnownUser,
  _loadKnownUsers: loadKnownUsers,
});

// Load game.js after modules are ready
const script = document.createElement('script');
script.src = './src/game.js';
document.head.appendChild(script);
