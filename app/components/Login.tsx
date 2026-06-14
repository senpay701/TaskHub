import React from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (e: React.FormEvent) => Promise<void>;
  errorMsg?: string | null;
  loginData: { email: string; password: string };
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onLogin,
  errorMsg,
  loginData,
  handleLoginChange,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 backdrop-blur-sm bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Войти</h3>
        <form onSubmit={onLogin} className="space-y-4">
          {errorMsg && <div className="text-red-600">{errorMsg}</div>}
          <label className="block mb-2" htmlFor="loginEmail">
            Почта*
            <input
              id="loginEmail"
              type="email"
              placeholder="Введите почту..."
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="w-full border px-3 py-2 rounded"
              required
              minLength={8}
              maxLength={32}
            />
          </label>

          <label className="block mb-2" htmlFor="loginPassword">
            Пароль*
            <input
              id="loginPassword"
              type="password"
              placeholder="Введите пароль..."
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full border px-3 py-2 rounded"
              required
              minLength={8}
              maxLength={32}
            />
          </label>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Войти
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};