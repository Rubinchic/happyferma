const express = require('express');
const bcrypt = require('bcrypt');
const { client } = require('../config/redis');
const config = require('../config');

const router = express.Router();

// POST /auth — Реєстрація або вхід
router.post('/', async (req, res) => {
  const { username, password, mode, gameData } = req.body;

  if (!username || !password || !mode) {
    return res.status(400).json({ error: 'Поля username, password та mode обовʼязкові' });
  }

  const userKey = `user:${username.toLowerCase()}`;

  try {
    const raw = await client.get(userKey);

    if (mode === 'register') {
      if (raw) {
        return res.status(400).json({ error: 'Акаунт вже існує' });
      }

      const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
      const newUser = {
        password: hashedPassword,
        displayName: username,
        gameData: JSON.stringify(gameData || {}),
        createdAt: new Date().toISOString(),
      };

      await client.set(userKey, JSON.stringify(newUser));
      return res.json({ success: true, message: 'Реєстрація успішна' });
    }

    if (mode === 'login') {
      if (!raw) {
        return res.status(401).json({ error: 'Користувача не знайдено' });
      }

      const userData = JSON.parse(raw);
      const isMatch = await bcrypt.compare(password, userData.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Невірний пароль' });
      }

      return res.json({ success: true, data: userData.gameData });
    }

    return res.status(400).json({ error: 'Невідомий режим. Використовуй "login" або "register"' });
  } catch (err) {
    console.error('[auth]', err);
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});

module.exports = router;
