"use client"
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { registerUser, loginUser, getCookie } from './lib/functions';
import { RegisterModal } from './components/Register';
import { LoginModal } from './components/Login';

const Home: React.FC = () => {
  const [user, setUser] = useState<{ name: string, id: number} | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
      const id = data.data.id;

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

  useEffect(() => {
    const fetchUser = async () => {
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
        } catch {
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUser();
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

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center text-gray-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Управляйте задачами и проектами легко с TaskHub
          </h2>
          <p className="text-lg md:text-xl mb-8">
            В одном проекте — много задач. Следите за прогрессом, организуйте работу и достигайте целей.
          </p>
        </div>
      </main>

      <section className="max-w-7xl mx-auto px-4 py-12 bg-gray-100">
        <h3 className="text-3xl font-semibold mb-8 text-center">Почему выбирают TaskHub</h3>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-4">Легко управлять</h4>
            <p>Интуитивный интерфейс для быстрого добавления и редактирования задач и проектов.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-4">Много задач в одном проекте</h4>
            <p>Организуйте работу по проектам и следите за прогрессом команды.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-4">Мобильная адаптация</h4>
            <p>Работайте в любом месте с любого устройства благодаря адаптивному дизайну.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-3xl font-semibold mb-4 text-center">Контакты</h3>
        <p className="text-center text-gray-600 mb-4">email: info@taskhub.com</p>
        <p className="text-center text-gray-600 mb-4">Телефон: +7 (123) 456-78-90</p>
        <p className="text-center text-gray-600">Адрес: Москва, ул. Примерная, д. 1</p>
      </section>

      <footer className="w-full bg-gray-800 text-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2026 TaskHub. Все права защищены.</p>
          <div className="mt-2 md:mt-0 space-x-4">
            <a href="#" className="hover:underline">Политика конфиденциальности</a>
            <a href="#" className="hover:underline">Условия использования</a>
          </div>
        </div>
      </footer>

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

export default Home;