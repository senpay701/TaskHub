# Проект: TaskHub

## Краткое описание проекта и предметной области

Проект **TaskHub** предназначен для эффективного управления задачами и проектами.  
В рамках этого проекта реализуются инструменты для организации работы, отслеживания прогресса и совместной работы команд.  

Основная идея — объединить множество задач и проектов в единую систему, которая поможет пользователям легко управлять своим временем и ресурсами.  

## Выбранный вариант архитектуры и обоснование

### Вариант Б: Fullstack Next.js

- **Frontend и Backend:** единое приложение Next.js (используя App Router) + TypeScript + Tailwind CSS.  
  Серверная логика реализуется через Route Handlers в директории `app/api/`.  
  Приложение запускается на одном порту (3000).

- **Хранилище данных:** массивы в памяти (in-memory), вынесенные в отдельный серверный модуль.  
  Подключение базы данных не требуется.

- **Взаимодействие:** клиентские компоненты обращаются к Route Handlers через `fetch` или данные загружаются в Server Components напрямую через серверные функции.

### Обоснование выбора

Данный вариант архитектуры выбран по причине его простоты и быстроты разработки.  
Использование Next.js с API Route Handlers позволяет создать полноценное полноценно интегрированное приложение с минимальными затратами и высокой производительностью благодаря серверной рендерингу и автоматической оптимизации Next.js.

## Используемый стек технологий

- **Next.js** (с использованием App Router) — фреймворк для разработки серверных и клиентских приложений на React.
- **TypeScript** — статическая типизация для повышения надежности и удобства разработки.
- **Tailwind CSS** — утилитарный CSS-фреймворк для быстрого и гибкого стилизации интерфейсов.
- **Prisma ORM** — современный ORM для работы с базой данных SQLite, обеспечивающий удобную и типобезопасную работу с данными.
- **SQLite** — легкая встроенная реляционная база данных для долговременного хранения данных.

## Инструкция по локальному запуску

### Установка зависимостей

1. Клонируйте репозиторий:

```bash
git clone <URL-вашего репозитория>
cd <имя папки с проектом>
```

2. Установите зависимости:

```
npm install
```

3. Сгенерируйте Prisma клиента и выполните миграции:

```
npx prisma generate
npx prisma migrate dev --name init
```

4. Запуск проекта:

```
npm run dev
```
          
**http://localhost:3000** — основной порт для доступа к приложению в браузере.         
            
# API Эндпоинты

## Общая информация
Все API используют JSON-формат для запросов и ответов.  
Для операций, требующих аутентификации, необходимо передавать JWT-токен в заголовке `Authorization: Bearer <токен>`.

---

## GET /api/[entity]/

**Описание:**  
Получение списка сущностей с пагинацией.

**Параметры запроса:**  
- `page` (опционально): номер страницы (по умолчанию 1)  
- `limit` (опционально): количество элементов на страницу (по умолчанию 10)

**Примеры запросов:**  
```bash
curl -H "Authorization: Bearer <ваш_токен>" "http://localhost:3000/api/[users, tasks, projects]?page=2&limit=5"
```

**Пример ответа:**
```json
{
  "items": [/* массив выбранных сущностей */],
  "total": 42,
  "page": 2,
  "pages": 9 
}
```

**Ошибки:**
- 400: "Invalid pagination parameters" — неправильные параметры пагинации.  
- 401: "Unauthorized"  
- 404: "Page out of range" — запрошенная страница превышает доступный диапазон.
- 500: "Internal Server Error"

---

## POST /api/[entity]/

**Описание:**  
Создание новой сущности.

**Тело запроса:**

- **Пользователь:**
```json
{
  "email": "example@example.com",
  "name": "John Doe",
  "password": "password123",
  "repeatPassword": "password123"
}
```

- **Проект:**
```json
{
  "name": "Проект 1",
  "description": "Описание проекта",
  "userId": 1
}
```

- **Задача:**
```json
{
  "title": "Задача 1",
  "description": "Описание задачи",
  "status": "pending",
  "projectId": 1
}
```

**Примеры запросов:**  

- **Пользователь:**
```bash
curl -X POST -H "Content-Type: application/json" \
-H "Authorization: Bearer <ваш_токен>" \
-d '{"email": "newuser@example.com", "name": "New User", "password": "pass", "repeatPassword": "pass"}' \
"http://localhost:3000/api/users"
```

- **Проект:**
```bash
curl -X POST -H "Content-Type: application/json" \
-H "Authorization: Bearer <ваш_токен>" \
-d '{"name": "Проект Новый", "description": "Описание", "userId": 1}' \
"http://localhost:3000/api/projects"
```

- **Задача:**
```bash
curl -X POST -H "Content-Type: application/json" \
-H "Authorization: Bearer <ваш_токен>" \
-d '{"title": "Новая задача", "description": "Описание", "status": "pending", "projectId": 1}' \
"http://localhost:3000/api/tasks"
```

**Пример ответа:**
```json
{
  "items": { /* созданный объект */ },
  "token": "jwt_token" // только при регистрации пользователя
}
```

**Ошибки:**
- 422: "Validation errors" — ошибки валидации данных  
- 401: "Unauthorized"  
- 400: "Unknown entity" — неизвестная сущность  
- 500: "Internal Server Error"

---

## GET /api/[entity]/[id]

**Описание:**  
Получение конкретной сущности по ID.

**Примеры запросов:**  

- **Пользователь:**
```bash
curl -H "Authorization: Bearer <ваш_токен>" "http://localhost:3000/api/users/1"
```

- **Проект:**
```bash
curl -H "Authorization: Bearer <ваш_токен>" "http://localhost:3000/api/projects/1"
```

- **Задача:**
```bash
curl -H "Authorization: Bearer <ваш_токен>" "http://localhost:3000/api/tasks/1"
```

**Пример ответа:**
```json
{
  "items": { /* объект сущности */ }
}
```

**Ошибки:**
- 404: "Unknown [entity]"  
- 401: "Unauthorized"  
- 500: "Internal Server Error"

---

## DELETE /api/[entity]/[id]

**Описание:**  
Удаление сущности по ID.

**Примеры запросов:**  

- **Пользователь:**
```bash
curl -X DELETE -H "Authorization: Bearer <ваш_токен>" "http://localhost:3000/api/users/1"
```

- **Проект:**
```bash
curl -X DELETE -H "Authorization: Bearer <ваш_токен>" "http://localhost:3000/api/projects/1"
```

- **Задача:**
```bash
curl -X DELETE -H "Authorization: Bearer <ваш_токен>" "http://localhost:3000/api/tasks/1"
```

**Пример ответа:**
-  204: при успешном удалении

**Ошибки:**
- 404: "Unknown [entity]"  
- 401: "Unauthorized"  
- 500: "Internal Server Error"

---

## PATCH /api/[entity]/[id]

**Описание:**  
Обновление сущности по ID.

**Тело запроса:**

- **Пользователь:**
```json
{
  "name": "John Doe",
  "password": "password123",
}
```

- **Проект:**
```json
{
  "name": "Проект 1",
  "description": "Описание проекта",
}
```

- **Задача:**
```json
{
  "title": "Задача 1",
  "description": "Описание задачи",
  "status": "success",
}
```

**Примеры запросов:**  

- **Пользователь:**
```bash
curl -X PATCH -H "Content-Type: application/json" \
-H "Authorization: Bearer <ваш_токен>" \
-d '{"name": "Обновленное имя", "password": "Обновленный пароль"}' \
"http://localhost:3000/api/users/1"
```

- **Проект:**
```bash
curl -X PATCH -H "Content-Type: application/json" \
-H "Authorization: Bearer <ваш_токен>" \
-d '{"name": "Обновленное имя", "description": "Обновленное описание"}' \
"http://localhost:3000/api/projects/1"
```

- **Задача:**
```bash
curl -X PATCH -H "Content-Type: application/json" \
-H "Authorization: Bearer <ваш_токен>" \
-d '{"title": "Обновленное название", "description": "Обновленное описание", "status": "success"}' \
"http://localhost:3000/api/tasks/1"
```

**Пример ответа:**
-  204: при успешном обновлении

**Ошибки:**
- 404: "Unknown [entity]"  
- 422: "Validation errors"  
- 401: "Unauthorized"  
- 500: "Internal Server Error"

---

## POST /api/users/login/

**Описание:**  
Авторизация пользователя.

**Тело запроса:**

- **Пользователь:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Примеры запросов:**  

- **Пользователь:**
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"email": "user@example.com", "password": "password123"}' \
"http://localhost:3000/api/users/login"
```

**Пример ответа:**

```json
{
  "token": "jwt_token",
  "id": 1
}
```

**Ошибки:**
- 401: "Incorrect email or password"  
- 422: "Validation errors"  
- 500: "Internal Server Error"

---

## GET /api/[entity]/search/

**Описание:**  
Поиск по сущностям с фильтрацией.

**Параметры запроса:**  
- `q` (обязательно): поисковая строка
- `page` (опционально): номер страницы (по умолчанию 1)  
- `limit` (опционально): количество элементов на страницу (по умолчанию 10)

**Примеры запросов:**  

- **Пользователь:**
```bash
curl -H "Authorization: Bearer <ваш_токен>" "http://localhost:3000/api/users/search?q=John&page=1&limit=10"          
```

- **Проект:**
```bash
curl -H "Authorization: Bearer <ваш_токен>" "http://localhost:3000/api/projects/search?q=Project&page=1&limit=10"          
```

- **Задача:**
```bash
curl -H "Authorization: Bearer <ваш_токен>" "http://localhost:3000/api/tasks/search?q=Task&page=1&limit=10"          
```

**Пример ответа:**

```json
{
  "items": [/* массив результатов */],
  "total": 5,
  "page": 1,
  "pages": 1
}
```

**Ошибки:**
- 400: "Invalid search parameters" или "Invalid pagination parameters"  
- 404: "Page out of range"  
- 500: "Internal Server Error"

---

# Примеры сущностей в ответах

## Пример пользователя (GET /api/users/1)
```json
{
  "items": {
    "id": 1,
    "email": "john.doe@example.com",
    "name": "John Doe",
    "createdAt": "2024-04-01T12:34:56.789Z",
    "updatedAt": "2024-04-10T08:21:45.123Z"
  }
}
```

## Пример проекта (GET /api/prpjects/1)
```json
{
  "items": {
    "id": 2,
    "name": "Проект А",
    "description": "Описание проекта А",
    "userId": 1,
    "createdAt": "2024-03-15T09:20:00.000Z",
    "updatedAt": "2024-04-05T14:55:30.000Z"
  }
}
```

## Пример задачи (GET /api/tasks/1)
```json
{
  "items": {
    "id": 3,
    "title": "Разработка интерфейса",
    "description": "Создать прототип интерфейса для проекта",
    "status": "success",
    "projectId": 2,
    "createdAt": "2024-04-02T10:00:00.000Z",
    "updatedAt": "2024-04-12T16:45:00.000Z"
  }
}
```

## Массив пользователей (GET /api/users)
```json
{
  "items": [
    {
      "id": 1,
      "email": "john.doe@example.com",
      "name": "John Doe",
      "createdAt": "2024-04-01T12:34:56.789Z",
      "updatedAt": "2024-04-10T08:21:45.123Z"
    },
    {
      "id": 2,
      "email": "jane.smith@example.com",
      "name": "Jane Smith",
      "createdAt": "2024-03-20T11:15:30.000Z",
      "updatedAt": "2024-04-09T09:30:20.000Z"
    }
  ],
  "total": 2,
  "page": 1,
  "pages": 1
}
```

## Массив проектов (GET /api/projects)
```json
{
  "items": [
    {
      "id": 1,
      "name": "Проект X",
      "description": "Описание проекта X",
      "userId": 1,
      "createdAt": "2024-03-10T10:00:00.000Z",
      "updatedAt": "2024-04-01T12:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Проект А",
      "description": "Описание проекта А",
      "userId": 2,
      "createdAt": "2024-03-15T09:20:00.000Z",
      "updatedAt": "2024-04-05T14:55:30.000Z"
    }
  ],
  "total": 2,
  "page": 1,
  "pages": 1
}
```

## Массив задач (GET /api/tasks)
```json
{
  "items": [
    {
      "id": 1,
      "title": "Создать дизайн",
      "description": "Разработать дизайн главной страницы",
      "status": "pending",
      "projectId": 1,
      "createdAt": "2024-04-05T08:00:00.000Z",
      "updatedAt": "2024-04-06T09:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Написать документацию",
      "description": "Подготовить документацию API",
      "status": "success",
      "projectId": 2,
      "createdAt": "2024-04-07T10:15:00.000Z",
      "updatedAt": "2024-04-08T11:45:00.000Z"
    }
  ],
  "total": 2,
  "page": 1,
  "pages": 1
}
```

# Структура данных

## Общие сведения
В системе реализованы три основные сущности: **User**, **Project** и **Task**.  
Связи между ними отражают типичные отношения в системе управления проектами и задачами.

---

## Сущности и их поля

### User (Пользователь)
```json
{
  "id": number,            // Уникальный идентификатор пользователя
  "email": string,         // Электронная почта (уникальна)
  "name": string,          // Имя пользователя
  "password": string,      // Хэшированный пароль
  "createdAt": Date,       // Дата создания записи
  "updatedAt": Date,       // Дата последнего обновления
  "projects": [            // Связь один-ко-многим с Project
    {
      "id": number,
      "name": string,
      ...
    }
  ]
}
```

### Project (Проект)
```json
{
  "id": number,            // Уникальный идентификатор проекта
  "name": string,          // Название проекта
  "description": string | null, // Описание проекта
  "userId": number,        // Внешний ключ, ссылка на User
  "createdAt": Date,       // Дата создания
  "updatedAt": Date,       // Дата последнего обновления
  "tasks": [               // Связь один-ко-многим с Task
    {
      "id": number,
      "title": string,
      ...
    }
  ]
}
```

### Task (Задача)
```json
{
  "id": number,            // Уникальный идентификатор задачи
  "title": string,         // Заголовок задачи
  "description": string | null, // Описание задачи
  "status": string,        // Статус задачи (например, pending, working, success)
  "projectId": number,     // Внешний ключ, ссылка на Project
  "createdAt": Date,       // Дата создания
  "updatedAt": Date        // Дата последнего обновления
}
```

## Итоговая схема
User (1) -----------< Project (Множество) -----------< Task (Множество)

