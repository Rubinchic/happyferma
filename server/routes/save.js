const express = require('express');
const { client } = require('../config/redis');

const router = express.Router();

// POST /save — Зберегти прогрес гравця
router.post('/', async (req, res) => {
  const { username, gameData } = req.body;

  if (!username || gameData === undefined) {
    return res.status(400).json({ error: 'Поля username та gameData обовʼязкові' });
  }

  const userKey = `user:${username.toLowerCase()}`;

  try {
    const raw = await client.get(userKey);

    if (!raw) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    const userData = JSON.parse(raw);
    userData.gameData = gameData;
    userData.savedAt = new Date().toISOString();

    await client.set(userKey, JSON.stringify(userData));
    res.json({ success: true });
  } catch (err) {
    console.error('[save]', err);
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});

module.exports = router;
