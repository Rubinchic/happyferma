# 🌻 Весела Ферма

Браузерна гра-ферма з Node.js/Redis бекендом.

---

## Структура проєкту

```
vesela-ferma/
├── client/                  
│   ├── src/
│   └── index.html
│
├── server/                  # Express API
│   ├── config/              # index.js (налаштування), redis.js (клієнт)
│   ├── middleware/          # errorHandler.js
│   ├── routes/              # auth.js, save.js
│   ├── index.js             # Точка входу
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Запуск у розробці

### Передумови
- Node.js 20+
- Redis (запущений локально або на сервері)

### Бекенд
```bash
cd server
npm install
# Налаштуйте пароль Redis у server/config/index.js або через змінні середовища
node index.js
```

### Фронтенд
```bash
cd client
npm install          
npm run dev                   # http://localhost:5173
```

---

## Деплой через Docker

```bash
cp .env.example .env          # заповніть REDIS_PASSWORD та CORS_ORIGIN
docker compose up -d --build
```

- Фронтенд: `http://your-server:80`
- API: `http://your-server:3000`

---

## API

| Метод | Шлях      | Опис                          |
|-------|-----------|-------------------------------|
| POST  | /auth     | Вхід або реєстрація (`mode: "login"` / `"register"`) |
| POST  | /save     | Збереження прогресу гравця    |
| GET   | /health   | Перевірка стану сервера        |

---

## Змінні середовища (server)

| Змінна           | За замовчуванням        | Опис                    |
|------------------|-------------------------|-------------------------|
| `PORT`           | `3000`                  | Порт сервера            |
| `REDIS_URL`      | `redis://172.17.0.1:6379` | URL Redis              |
| `REDIS_PASSWORD` | —                       | Пароль Redis            |
| `CORS_ORIGIN`    | `*`                     | Дозволений CORS origin  |
