const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config');
const { connect } = require('./config/redis');
const authRouter = require('./routes/auth');
const saveRouter = require('./routes/save');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// --- Middleware ---
app.use(cors({ origin: config.cors.origin }));
app.use(bodyParser.json({ limit: '5mb' }));

// --- Routes ---
app.use('/auth', authRouter);
app.use('/save', saveRouter);
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

// --- Error handler (must be last) ---
app.use(errorHandler);

// --- Start ---
async function start() {
  await connect();
  app.listen(config.port, () => {
    console.log(`🚀 Сервер ферми запущено на порту ${config.port}`);
  });
}

start();
