"use client";

import { useRouter } from 'next/navigation';

const ProfileMenu = (props: { onLogout: () => void; onClose: () => void }) => {
  const { onLogout, onClose } = props;
  const router = useRouter();

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
      <button
        className="block px-4 py-3 w-full text-left hover:bg-blue-100 transition-colors rounded-t-lg"
        onClick={() => {
          onClose();
          router.push('/');
        }}
      >
        Главная
      </button>
      <button
        className="block px-4 py-3 w-full text-left hover:bg-blue-100 transition-colors"
        onClick={() => {
          onClose();
          router.push('/projects');
        }}
      >
        Проекты
      </button>
      <button
        className="block px-4 py-3 w-full text-left hover:bg-blue-100 transition-colors"
        onClick={() => {
          onClose();
          router.replace('/projects/new');
        }}
      >
        Добавить проект
      </button>
      <button
        className="block px-4 py-3 w-full text-left hover:bg-blue-100 transition-colors"
        onClick={() => {
          onClose();
          router.push('/tasks');
        }}
      >
        Задачи
      </button>
      <button
        className="block px-4 py-3 w-full text-left hover:bg-blue-100 transition-colors"
        onClick={() => {
          onClose();
          router.push('/tasks/new');
        }}
      >
        Добавить задачу
      </button>
      <button
        className="block px-4 py-3 w-full text-left hover:bg-blue-100 transition-colors"
        onClick={() => {
          onClose();
          router.push('/profile');
        }}
      >
        Профиль
      </button>
      <button
        className="block px-4 py-3 w-full text-left hover:bg-red-400 transition-colors rounded-b-lg"
        onClick={() => {
          onClose();
          onLogout();
        }}
      >
        Выйти
      </button>
    </div>
  );
}

export { ProfileMenu };
