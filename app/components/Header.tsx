"use client";

import { ProfileMenu } from "./ProfileMenu";
import { useRouter } from 'next/navigation';

export function Header(props: {
  user: { name: string } | null;
  onLogout: () => void;
  onProfileClick: () => void;
  showProfileMenu: boolean;
  toggleProfileMenu: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}) {
  const {
    user,
    onLogout,
    onProfileClick,
    showProfileMenu,
    toggleProfileMenu,
    onOpenLogin,
    onOpenRegister,
  } = props;

  const router = useRouter();

  return (
    <header className="w-full bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-4">
        <h1 
            className="text-2xl font-bold text-blue-600"
            onClick={() => router.push('/')}
            style={{ cursor: 'pointer' }}
            >
            TaskHub
        </h1>

        {user ? (
          <div className="relative" style={{ flex: '0 0 auto' }}>
            <div
              className="flex items-center cursor-pointer"
              onClick={onProfileClick}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <span className="text-gray-700 font-medium">{user.name}</span>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center ml-2">
                👤
              </div>
            </div>
            {showProfileMenu && (
              <ProfileMenu onLogout={onLogout} onClose={toggleProfileMenu} />
            )}
          </div>
        ) : (
          <div className="space-x-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={onOpenLogin}
            >
              Войти
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={onOpenRegister}
            >
              Зарегистрироваться
            </button>
          </div>
        )}
      </div>
    </header>
  );
}