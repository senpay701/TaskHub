"use client";

export function translateErrorMessage(message: string): string {
  const mapping: Record<string, string> = {
    'Email is required and must be a string.': 'Обязательно укажите email, и он должен быть строкой.',
    'Password is required and must be a string.': 'Обязательно укажите пароль, и он должен быть строкой.',
    'Email cannot be changed.': 'Изменение email запрещено.',
    'Email must be a unique.': 'Этот email уже используется.',
    'Name must be a non-empty string.': 'Имя должно быть непустой строкой.',
    'Password must be a non-empty string.': 'Пароль должен быть непустой строкой.',
    'Name is required and must be a string.': 'Название обязательно и должно быть строкой.',
    'Description must be a string.': 'Описание должно быть строкой.',
    'userId is required and must be a number.': 'userId обязателен и должен быть числом.',
    'Title is required and must be a string.': 'Заголовок обязателен и должен быть строкой.',
    'Status must be a string.': 'Статус должен быть строкой.',
    'projectId is required and must be a number.': 'projectId обязателен и должен быть числом.',
    'Passwords do not match': 'Пароли не совпадают.',
    'Unknown user': 'Пользователь не найден.',
    'Incorrect email or password': 'Неверный email или пароль.',
    'Incorrect email': 'Некорректный формат email.'
  };

  return mapping[message] || message;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function registerUser(userData: {
  email: string;
  name: string;
  password: string;
  repeatPassword: string;
  agreeToPrivacy: boolean;
}) {
  if (userData.password !== userData.repeatPassword) {
    throw new Error('Пароли не совпадают.');
  }

  if (!userData.email || !validateEmail(userData.email)) {
    throw new Error('Некорректный формат email.');
  }

  const response = await fetch('/api/users/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.errors ? data.errors.map(translateErrorMessage).join(', ') :
                    data.error ? translateErrorMessage(data.error) :
                    'Ошибка';

    throw new Error(errorMsg);
  }
  if (data.token) {
    document.cookie = `token=${data.token}; path=/; max-age=604800`;
    document.cookie = `id=${data.items.id}; path=/; max-age=604800`;
  }
  return data;
}

export async function loginUser(credentials: { email: string; password: string }) {
  if (!credentials.email || !validateEmail(credentials.email)) {
    throw new Error('Некорректный формат email.');
  }
  const response = await fetch('/api/users/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.errors ? data.errors.map(translateErrorMessage).join(', ') :
                    data.error ? translateErrorMessage(data.error) :
                    'Ошибка';

    throw new Error(errorMsg);
  }
  if (data.token) {
    document.cookie = `token=${data.token}; path=/; max-age=604800`;
    document.cookie = `id=${data.id}; path=/; max-age=604800`;
  }
  return data;
}

export function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return (
        <span className="px-3 py-1 rounded-full bg-blue-300 text-sm font-medium text-blue-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
          В ожидании
        </span>
      );
    case 'processing':
      return (
        <span className="px-3 py-1 rounded-full bg-yellow-300 text-sm font-medium text-yellow-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
          В работе
        </span>
      );
    case 'success':
      return (
        <span className="px-3 py-1 rounded-full bg-green-300 text-sm font-medium text-green-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
          Выполнена
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full bg-gray-200 text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
          Неизвестно
        </span>
      );
  }
}