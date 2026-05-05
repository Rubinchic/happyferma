const redis = require('redis');
const config = require('../config');

const client = redis.createClient({
  url: config.redis.url,
  password: config.redis.password,
});

client.on('error', (err) => console.error('❌ Помилка Redis:', err));
client.on('connect', () => console.log('✅ Підключено до Redis'));

async function connect() {
  try {
    await client.connect();
  } catch (err) {
    console.error('❌ Не вдалося підключитись до Redis:', err.message);
    process.exit(1);
  }
}

module.exports = { client, connect };
