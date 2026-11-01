# Notes Client - клієнтська частина менеджера нотаток

Веб-застосунок на React для роботи з REST API `notes-api` (частина 2): нотатки з категоріями, тегами, пошуком, фільтрами та пагінацією. Навчальна практика з програмування, частина 3 (тема 6).

## Технологічний стек
- React 18, React Router 6, Vite 5
- SCSS (Sass): змінні, міксини, вкладеність, теми, адаптивна верстка
- Fetch API, власний DI-контейнер, localStorage
- Тести: вбудований `node:test`

## Швидкий старт: запуск клієнта і сервера разом

Потрібен Node.js 20+. Репозиторії частини 2 (`notes-api`) і частини 3 (цей) клонуються окремо.

**1. Серверна частина** (перший термінал):
```bash
cd notes-api
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run migrate
npm start                   # http://localhost:3000 , Swagger: /api-docs
```

**2. Клієнтська частина** (другий термінал):
```bash
cd notes-client
npm install
npm run dev                 # http://localhost:5173
```
Клієнт звертається до `/api`, а Vite проксує ці запити на `http://localhost:3000` (див. `vite.config.js`). Якщо сервер працює на іншому порту, змініть `target` у цьому файлі. Для окремого хостингу задайте повну адресу API у `.env`: `VITE_API_URL=https://example.com/api` (приклад у `.env.example`).

Збірка для продакшену: `npm run build` (результат у `dist/`), перегляд: `npm run preview`.

## Тести
```bash
npm test
```
Перевіряються DI-контейнер, ApiClient (помилки, таймаут, 204), сервіси, StorageService та допоміжні функції.

## Функції
- Список нотаток з пошуком (із затримкою вводу), фільтрами за категорією й тегом, пагінацією
- Створення й редагування нотатки: категорія, теги, валідація (на клієнті й помилки сервера під полями)
- Керування категоріями та тегами (додавання, редагування, видалення)
- Стани завантаження, порожній список, помилки мережі з кнопкою «Спробувати знову»
- Світла/темна тема; адаптивний інтерфейс (мобільний, планшет, десктоп)
- Браузерний API: **localStorage** зберігає тему, вибрані фільтри та чернетку нової нотатки

## Архітектура
```
src/
  components/   повторно використовувані презентаційні компоненти (Button, TextField, NoteCard, ...)
  pages/        контейнерні компоненти сторінок (дані, стан, обробники)
  hooks/        useAsync, useDebounce, usePersistentState
  services/     ApiClient, ApiError, Notes/Categories/Tags/Storage сервіси
  di/           Container, container.js (композиційний корінь), ServicesContext (useService)
  context/      ThemeContext
  utils/        format, validation
  styles/       _variables, _mixins, _themes, _reset, _base, main.scss, components/*.scss
tests/          модульні тести
```
**DI.** Усі сервіси реєструються в `src/di/container.js`. Контейнер передається в React через `ServicesProvider`, компоненти отримують сервіси хуком `useService('notesService')` і не створюють їх самі. У тестах замість реальних сервісів підставляються заглушки.

**Маршрути:** `/` (список), `/notes/new`, `/notes/:id/edit`, `/categories`, `/tags`, решта - сторінка 404.

## Змінні середовища
| Змінна | За замовчуванням | Опис |
|--------|------------------|------|
| `VITE_API_URL` | `/api` | базова адреса REST API |
