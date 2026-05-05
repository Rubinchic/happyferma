module.exports = {
  port: process.env.PORT || 3000,
  redis: {
    url: process.env.REDIS_URL || 'redis://172.17.0.1:6379',
    password: process.env.REDIS_PASSWORD || 'password',
  },
  bcrypt: {
    saltRounds: 10,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};
