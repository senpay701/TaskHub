"use client";

import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { registerUser, loginUser, getCookie } from '../lib/functions';
import { useRouter } from 'next/navigation';
import { RegisterModal } from '../components/Register';
import { LoginModal } from '../components/Login';

const ProfilePage = () => {
  const router = useRouter();

  const [user, setUser] = useState<{ name: string; id: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
	const [regData, setRegData] = useState({
    email: '',
    name: '',
    password: '',
    repeatPassword: '',
    agreeToPrivacy: false,
  });
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleOpenLogin = () => setLoginOpen(true);
  const handleOpenRegister = () => setRegisterOpen(true);
  const toggleProfileMenu = () => setShowProfileMenu(prev => !prev);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    setUser(null);
		router.push('/');
  };
	const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setRegData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};
	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMsg(null);
		if (
			!regData.email ||
			!regData.name ||
			!regData.password ||
			!regData.repeatPassword ||
			!regData.agreeToPrivacy
		) {
			setErrorMsg('Заполните все поля и подтвердите согласие.');
			return;
		}
		if (regData.password !== regData.repeatPassword) {
			setErrorMsg('Пароли не совпадают.');
			return;
		}
		try {
			const data = await registerUser(regData);

			setRegisterOpen(false);

			const token = data.token;
			const id = data.items.id;

			if (token && id) {
				fetch(`/api/users/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then(res => res.json())
				.then(data => {
					setUser({ name: data.items.name, id: data.items.id });
				})
				.catch(() => setUser(null))
				.finally(() => setIsLoading(false));
			} else {
				setIsLoading(false);
			}
		} catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Произошла неизвестная ошибка');
      }
    }
	};
	const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginData(prev => ({ ...prev, [name]: value }));
	};
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMsg(null);
		if (!loginData.email || !loginData.password) {
			setErrorMsg('Введите email и пароль.');
			return;
		}
		try {
			const data = await loginUser(loginData);

			setLoginOpen(false);

			const token = data.token;
			const id = data.id;

			if (token && id) {
				fetch(`/api/users/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then(res => res.json())
				.then(data => {
					setUser({ name: data.items.name, id: data.items.id });
				})
				.catch(() => setUser(null))
				.finally(() => setIsLoading(false));
			} else {
				setIsLoading(false);
			}
		} catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Произошла неизвестная ошибка');
      }
    }
	};
	const handleSaveChanges = () => {
    const token = getCookie('token');

    if (!token || !user) return;

    setIsUpdating(true);
    fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка при обновлении имени');
        return true;
      })
      .then(() => {
        setUser(prev => prev ? { ...prev, name } : prev);
      })
      .catch(() => setErrorMsg('Не удалось обновить имя.'))
      .finally(() => setIsUpdating(false));
  };
  const handleChangePassword = () => {
    const token = getCookie('token');

    if (!token || !user) return;

    if (newPassword !== confirmPassword) {
      setErrorMsg('Пароли не совпадают.');
      return;
    }

    setIsUpdating(true);
    fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password: newPassword }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка при смене пароля');
        return true;
      })
      .then(() => {
        setErrorMsg('Пароль успешно изменен.');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch(() => setErrorMsg('Не удалось изменить пароль.'))
      .finally(() => setIsUpdating(false));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getCookie('token');
      const id = getCookie('id');

      if (token && id) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();

          setUser({ name: data.items.name, id: data.items.id });
          setName(data.items.name);
        } catch {
          setErrorMsg('Не удалось загрузить данные пользователя.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
  	return (
			<>
				<div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
					<div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin"></div>
				</div>
			</>
		);
	}

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
      <Header
        user={user}
        onLogout={handleLogout}
        onProfileClick={toggleProfileMenu}
        showProfileMenu={showProfileMenu}
        toggleProfileMenu={toggleProfileMenu}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
      />

      <main className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow mt-8">
        <h2 className="text-2xl font-semibold mb-4">Профиль</h2>

        {errorMsg && <div className="mb-4 text-red-600">{errorMsg}</div>}

        <div className="mb-6">
          <label className="block mb-2 font-medium">Имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            onClick={handleSaveChanges}
            disabled={isUpdating}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isUpdating ? 'Сохраняется...' : 'Сохранить'}
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChangePassword();
          }}
          className="max-w-md mx-auto"
        >
          <h3 className="text-xl font-semibold mb-4">Сменить пароль</h3>
          
          <div className="mb-4">
            <label className="block mb-2" htmlFor="currentPassword">Текущий пароль</label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Введите текущий пароль..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              minLength={8}
              maxLength={32}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2" htmlFor="newPassword">Новый пароль</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Введите новый пароль..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              minLength={8}
              maxLength={32}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2" htmlFor="confirmPassword">Подтвердите новый пароль</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Повторите новый пароль..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              minLength={8}
              maxLength={32}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {isUpdating ? 'Обновляется...' : 'Обновить пароль'}
          </button>
        </form>
      </main>

			{isLoginOpen && (
       <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setLoginOpen(false)}
          onLogin={handleLogin}
          errorMsg={errorMsg}
          loginData={loginData}
          handleLoginChange={handleLoginChange}
        />
      )}
      {isRegisterOpen && (
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setRegisterOpen(false)}
          onRegister={handleRegister}
          errorMsg={errorMsg}
          regData={regData}
          handleRegChange={handleRegChange}
        />
      )}
    </div>
  );
};

export default ProfilePage;