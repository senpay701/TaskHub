import React from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (e: React.FormEvent) => Promise<void>;
  errorMsg?: string | null;
  regData: {
    email: string;
    name: string;
    password: string;
    repeatPassword: string;
    agreeToPrivacy: boolean;
  };
  handleRegChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  errorMsg,
  regData,
  handleRegChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 backdrop-blur-sm bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full relative shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Регистрация</h3>
        <form onSubmit={onRegister} className="space-y-4">
          {errorMsg && <div className="text-red-600">{errorMsg}</div>}
          <label className="block mb-2" htmlFor="regEmail">
            Почта*
            <input
              id="regEmail"
              type="email"
              placeholder="Введите почту..."
              name="email"
              value={regData.email}
              onChange={handleRegChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </label>

          <label className="block mb-2" htmlFor="regName">
            Имя*
            <input
              id="regName"
              type="text"
              placeholder="Введите имя..."
              name="name"
              value={regData.name}
              onChange={handleRegChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </label>

          <label className="block mb-2" htmlFor="regPassword">
            Пароль*
            <input
              id="regPassword"
              type="password"
              placeholder="Введите пароль..."
              name="password"
              value={regData.password}
              onChange={handleRegChange}
              className="w-full border px-3 py-2 rounded"
              required
              minLength={8}
              maxLength={32}
            />
          </label>

          <label className="block mb-2" htmlFor="regRepeatPassword">
            Повторите пароль*
            <input
              id="regRepeatPassword"
              type="password"
              placeholder="Повторите пароль..."
              name="repeatPassword"
              value={regData.repeatPassword}
              onChange={handleRegChange}
              className="w-full border px-3 py-2 rounded"
              required
              minLength={8}
              maxLength={32}
            />
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="agreeToPrivacy"
              checked={regData.agreeToPrivacy}
              onChange={handleRegChange}
              className="mr-2"
            />
            Я согласен с политикой конфиденциальности*
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
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Регистрация
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