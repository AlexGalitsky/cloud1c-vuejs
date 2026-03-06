# Cloud-1S Client

Vue.js фронтенд для облачного сервиса управления базами 1С.

## 📋 Описание

Веб-приложение предоставляет интерфейс для:
- Аутентификации пользователей (вход/регистрация)
- Подтверждения учетной записи администратором
- Управления базами данных 1С (создание, редактирование, удаление, просмотр)
- Загрузки и применения файлов `.dt` с комментариями
- Мониторинга статуса обработки баз в реальном времени
- Просмотра логов выполнения операций
- Публикации баз на веб-сервер
- Управления пользователями (для администраторов)

## 🛠 Технологии

- **Фреймворк:** Vue.js 3.5.x
- **Сборщик:** Vite 7.x
- **UI библиотека:** Vuetify 4.x
- **State Management:** Pinia 3.x
- **Роутинг:** Vue Router 5.x
- **HTTP клиент:** Axios 1.x
- **Иконки:** Material Design Icons
- **Язык:** TypeScript 5.9.x

## 📁 Структура проекта

```
client/
├── src/
│   ├── api/                 # API клиенты
│   │   ├── index.ts        # Базовый axios с интерцепторами
│   │   ├── auth.ts         # API аутентификации
│   │   ├── bases.ts        # API управления базами
│   │   └── admin.ts        # API администрирования
│   │
│   ├── components/          # Vue компоненты
│   │   ├── base/           # Компоненты для работы с базами
│   │   │   ├── BaseCard.vue
│   │   │   ├── BaseLogsView.vue
│   │   │   ├── BaseStatusBadge.vue
│   │   │   ├── DtFilesList.vue
│   │   │   └── FileUploader.vue
│   │   ├── ui/             # UI компоненты
│   │   │   ├── AppInput.vue
│   │   │   ├── AppButton.vue
│   │   │   ├── AppCard.vue
│   │   │   ├── AppModal.vue
│   │   │   └── AppDivider.vue
│   │   └── ...
│   │
│   ├── views/              # Страницы
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── DashboardView.vue
│   │   ├── BaseCreateView.vue
│   │   ├── BaseEditView.vue
│   │   ├── BaseDetailsView.vue
│   │   ├── ProfileView.vue      # Профиль пользователя
│   │   └── AdminView.vue        # Админ-панель
│   │
│   ├── router/
│   │   └── index.ts        # Конфигурация маршрутов
│   │
│   ├── stores/             # Pinia store
│   │   ├── auth.ts         # Состояние аутентификации
│   │   ├── bases.ts        # Состояние баз данных
│   │   └── admin.ts        # Админ-панель
│   │
│   ├── plugins/
│   │   └── vuetify.ts      # Настройка Vuetify
│   │
│   ├── App.vue
│   ├── main.ts
│   └── style.css
│
├── public/
├── .env
├── .env.example
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## ⚙️ Установка

```bash
# Установка зависимостей
npm install
```

## 🔧 Настройка

Создайте файл `.env` на основе `.env.example`:

```bash
VITE_API_URL=http://localhost:3000/api
```

### Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `VITE_API_URL` | URL backend API | `http://localhost:3000/api` |
| `VITE_CLUSTER_ADDRESS` | Адрес кластера 1С | `192.168.1.104` |
| `VITE_CLUSTER_WEB_URL` | URL веб-сервера 1С | `http://192.168.1.104` |
| `VITE_IB_USER_PASS_REQUIRED` | Требовать логин/пароль ИБ | `false` |

## 🚀 Запуск

```bash
# Режим разработки (hot reload)
npm run dev

# Сборка для production
npm run build

# Предпросмотр production сборки
npm run preview

# Линтинг и форматирование
npm run lint
npm run format

# Проверка типов TypeScript
npm run type-check
```

## 🗺 Маршруты

| Путь | Страница | Описание | Требуется авторизация |
|------|----------|----------|----------------------|
| `/login` | LoginView | Вход | Нет |
| `/register` | RegisterView | Регистрация | Нет |
| `/dashboard` | DashboardView | Главная панель со списком баз | Да |
| `/bases/create` | BaseCreateView | Создание новой базы | Да (требуется active) |
| `/bases/:id/edit` | BaseEditView | Редактирование базы | Да (требуется active) |
| `/bases/:id` | BaseDetailsView | Детали базы, логи, файлы .dt | Да (требуется active) |
| `/profile` | ProfileView | Профиль пользователя, смена пароля | Да |
| `/admin` | AdminView | Управление пользователями | Да (требуется admin) |

**Статусы доступа:**
- `pending` — пользователь ожидает подтверждения, не может создавать базы
- `active` — пользователь подтвержден, полный доступ
- `blocked` — пользователь заблокирован, доступ запрещен

**Отображение баз:**
- Активные базы — обычные карточки с кнопками
- Базы на удалении — полупрозрачные карточки без кнопок, статус "На удалении..."

## 🏪 State Management (Pinia)

### Auth Store

```typescript
// Состояние
- token: string | null
- user: User | null
- isLoading: boolean
- error: string | null
- isAuthenticated: computed
- isAdmin: computed
- isPending: computed

// Действия
- login(data: LoginRequest)
- register(data: RegisterRequest)
- logout()
- loadUserFromStorage()
- fetchProfile()
- changePassword(currentPassword, newPassword)
```

### Bases Store

```typescript
// Состояние
- bases: Base1C[]
- currentBase: Base1C | null
- dtFiles: DtFile[]
- isLoading: boolean
- isPolling: boolean

// Computed
- totalCount, readyCount, processingCount, errorCount

// Действия
- fetchBases()
- fetchBaseById(id)
- createBase(data, dtFile)
- updateBase(id, data, dtFile)
- deleteBase(id)
- startPollingForBase(id) / stopPolling()
- fetchDtFiles(id)
- deleteDtFile(id)
- applyDtFile(id)
```

### Admin Store

```typescript
// Состояние
- users: User[]
- isLoading: boolean
- error: string | null

// Действия
- fetchUsers()
- confirmUser(id)
- blockUser(id)
- deleteUser(id)
- updateUser(id, data)
```

## 🎨 UI компоненты

### Базовые компоненты

- **AppInput** — поле ввода с валидацией
- **AppButton** — кнопка с вариантами (primary, secondary, etc.)
- **AppCard** — карточка-контейнер
- **AppModal** — модальное окно
- **AppDivider** — разделитель

### Компоненты баз 1С

- **BaseCard** — карточка базы с информацией и действиями
- **BaseStatusBadge** — бейдж статуса (ready/processing/error)
- **BaseLogsView** — консоль логов с live-обновлением
- **DtFilesList** — список файлов выгрузки с историей
- **FileUploader** — загрузчик файлов с drag & drop

## 🎯 Основные возможности

### 1. Аутентификация
- Вход по email/паролю
- Регистрация нового пользователя
- Сохранение токена в localStorage
- Автоматический logout при 401 ошибке
- **Подтверждение учетной записи** — новые пользователи регистрируются со статусом `pending` и требуют подтверждения администратором

### 2. Профиль пользователя
- Просмотр информации о пользователе (email, роль, статус)
- **Изменение пароля** — смена текущего пароля на новый
- Индикация статуса учетной записи

### 3. Управление базами 1С
- Просмотр списка всех баз с карточками
- Создание новой пустой базы (название + описание)
- Загрузка .dt файлов с комментариями
- Редактирование существующей базы
- Удаление базы (помечает на удаление, фактическое удаление через планировщик)
- Статусы: `ready`, `processing`, `error`
- **Доступно только пользователям со статусом `active`**

### 4. Публикация на веб-сервер
- Кнопка "Опубликовать" на странице деталей базы
- После публикации кнопка "Открыть базу" (активна только если `isPublished=true`)
- Ссылка открывается в новой вкладке: `http://<CLUSTER_WEB_URL>/<base_name>`

### 5. Файлы .dt с комментариями
- Загрузка файлов с комментарием
- Редактирование комментария
- Замена .dt файла с обновлением комментария
- Применение выбранной версии (с вводом логина/пароля если требуется)
- Отображение истории файлов с комментариями

### 6. Мониторинг в реальном времени
- Long polling для обновления статуса базы (интервал 1 сек)
- Консоль логов с live-обновлением
- Визуальные индикаторы статуса

### 7. Админ-панель (для роли `admin`)
- **Просмотр всех пользователей** с фильтрацией по статусу
- **Подтверждение пользователей** — активация учетных записей
- **Блокировка/разблокировка** пользователей
- **Удаление пользователей**
- **Смена роли** (пользователь/администратор)

## 🌐 API интеграция

### Базовая конфигурация

API клиент настроен в `src/api/index.ts`:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Интерцептор: добавляет Bearer токен
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор: обработка 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

## 🎨 Тема

Кастомная тема Vuetify настроена в `src/plugins/vuetify.ts`:

| Цвет | Значение |
|------|----------|
| primary | `#4F46E5` (индиго) |
| secondary | `#6B7280` (серый) |
| success | `#10B981` (зелёный) |
| warning | `#F59E0B` (янтарный) |
| error | `#EF4444` (красный) |
| background | `#F3F4F6` |
| surface | `#FFFFFF` |

## 📦 Зависимости

### Production
- `vue` — ^3.5.29
- `vuetify` — ^4.0.1
- `pinia` — ^3.0.4
- `vue-router` — ^5.0.3
- `axios` — ^1.13.6
- `@mdi/js` — ^7.4.47

### Development
- `vite` — ^7.3.1
- `typescript` — ~5.9.3
- `eslint` — ^10.0.2
- `prettier` — 3.8.1
- `@vitejs/plugin-vue` — ^6.0.4

**Требования к Node.js:** `^20.19.0 || >=22.12.0`

## 📝 Технические особенности

- **TypeScript** — полная типизация компонентов, API ответов и store
- **Composition API** — `<script setup>` синтаксис
- **Vuetify 4** — Material Design компоненты
- **Pinia** — современное управление состоянием
- **Long Polling** — обновление статуса баз (1 сек интервал)
- **FormData** — загрузка файлов через multipart/form-data
- **Drag & Drop** — загрузка файлов в FileUploader

## 🔗 Связь с backend

Backend должен быть запущен на `http://localhost:3000` (настраивается в `.env`).

См. документацию API в [server/README.md](../server/README.md).

## 📄 Лицензия

MIT
