"use client";

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaExternalLinkAlt} from 'react-icons/fa';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import { registerUser, loginUser } from '../lib/functions';
import { Task, Project } from '../types';
import { getCookie, getStatusBadge } from '../lib/functions'
import { useRouter } from 'next/navigation';
import { RegisterModal } from '../components/Register';
import { LoginModal } from '../components/Login';

const MyTasksPage = () => {
	const router = useRouter();

	const [tasks, setTasks] = useState<Task[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [user, setUser] = useState<{ name: string, id: number } | null>(null);
	const [isLoginOpen, setLoginOpen] = useState(false);
	const [isRegisterOpen, setRegisterOpen] = useState(false);
	const [isDeleteOpen, setDeleteOpen] = useState(false);
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [totalItems, setTotalItems] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [showNotification, setShowNotification] = useState(false);
	const [fade, setFade] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingPage, setIsLoadingPage] = useState(true);
	const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);
	const [newTaskName, setNewTaskName] = useState('');
	const [newTaskDescription, setNewTaskDescription] = useState('');
	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
	const [creating, setCreating] = useState(false);
	const [isEditTaskOpen, setEditTaskOpen] = useState(false);
	const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [loginData, setLoginData] = useState({ email: '', password: '' });
	const [regData, setRegData] = useState({
		email: '',
		name: '',
		password: '',
		repeatPassword: '',
		agreeToPrivacy: false,
	});

	const handleSuccess = () => {
		setShowNotification(true);
		setFade(false);
	};
	const handleOpenLogin = () => setLoginOpen(true);
	const handleOpenRegister = () => setRegisterOpen(true);
	const handleCloseDelete = () => setDeleteOpen(false);
	const toggleProfileMenu = () => setShowProfileMenu(prev => !prev);
	const handleOpenCreateTask = () => {
		setCreateTaskOpen(true);
		setNewTaskName('');
		setNewTaskDescription('');
	};
	const handleCloseCreateTask = () => {
		setCreateTaskOpen(false);
		setSelectedProjectId(null);
	};
	const handleOpenEditTask = (task: Task) => {
		setTaskToEdit(task);
		setEditTaskOpen(true);
	};
	const handleCloseEditTask = () => {
		setTaskToEdit(null);
		setEditTaskOpen(false);
	};
	const handleOpenDelete = (task: Task) => {
		setSelectedTask(task);
		setDeleteOpen(true);
	};
	const handleDeleteTask = (task: Task | null) => {
		setIsLoading(true);
		const token = getCookie('token');

		if (token) {
			if (task) {
				fetch(`/api/tasks/${task.id}`, { 
					headers: { Authorization: `Bearer ${token}` }, 
					method: 'DELETE' }
				)
				.then((response) => {
					if (response.ok) {
						fetch(`/api/tasks/?page=${currentPage}&limit=${itemsPerPage}`, {
							headers: { Authorization: `Bearer ${token}` },
						})
						.then(res => res.json())
						.then(data => {
							setTasks(data.items);
							setFilteredTasks(data.items);
							setTotalItems(data.total);
							setCurrentPage(data.page);
							setTotalPages(data.pages);
						})
						.catch(() => {
							setTasks([]);
							setFilteredTasks([]);
						})
					}
				})
				.finally(() => {
					setSelectedTask(null);
					handleSuccess();
					setIsLoading(false); 
					setDeleteOpen(false);
				});
			}
		}
	};
	const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
		setIsLoading(true);
		e.preventDefault();

		if (selectedProjectId === null) {
    	alert('Пожалуйста, выберите проект');
    	return;
  	}

		setCreating(true);

		const token = getCookie('token');

		fetch('/api/tasks/', { 
			headers: { Authorization: `Bearer ${token}` }, 
			method: 'POST',
			body: JSON.stringify({
				title: newTaskName,
				description: newTaskDescription,
				projectId: selectedProjectId,
				status: 'pending'
			}), }
		)
		.then(res => res.json())
		.then(data => {
			if (data.items.id) {
				fetch(`/api/tasks/?page=${currentPage}&limit=${itemsPerPage}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then(res => res.json())
				.then(data => {
					setTasks(data.items);
					setFilteredTasks(data.items);
					setTotalItems(data.total);
					setCurrentPage(data.page);
					setTotalPages(data.pages);
				})
				.catch(() => {
					setTasks([]);
					setFilteredTasks([]);
				})
			}
		})
		.catch((error) => console.error('Ошибка:', error))
		.finally(() => {
			handleSuccess();
			setIsLoading(false); 
			setCreating(false);
			handleCloseCreateTask();
		});
	};
	const handleEditTask = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!taskToEdit) return;

		setIsLoading(true);
		const token = getCookie('token');

		fetch(`/api/tasks/${taskToEdit.id}`, { 
			headers: { Authorization: `Bearer ${token}` }, 
			method: 'PATCH',
			body: JSON.stringify({
				title: taskToEdit.title,
				description: taskToEdit.description,
				status: taskToEdit.status
			}), }
		)
		.catch((error) => console.error('Ошибка:', error))
		.finally(() => {
			fetch(`/api/tasks/?page=${currentPage}&limit=${itemsPerPage}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then(res => res.json())
			.then(data => {
				setTasks(data.items);
				setFilteredTasks(data.items);
				setTotalItems(data.total);
				setCurrentPage(data.page);
				setTotalPages(data.pages);
			})
			.catch(() => {
				setTasks([]);
				setFilteredTasks([]);
			})

			handleSuccess();
			setIsLoading(false); 
			handleCloseEditTask();
		});
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
				.catch(() => setUser(null));

				fetch(`/api/tasks/?page=${currentPage}&limit=${itemsPerPage}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then(res => res.json())
				.then(data => {
					setTasks(data.items);
					setFilteredTasks(data.items);
					setTotalItems(data.total);
					setCurrentPage(data.page);
					setTotalPages(data.pages);
				})
				.catch(() => {
					setTasks([]);
					setFilteredTasks([]);
				})
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
	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};
	const handleLogout = () => {
		document.cookie = 'token=; Max-Age=0; path=/';
		setUser(null);
		router.push('/')
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
				.catch(() => setUser(null));

				fetch(`/api/tasks/?page=${currentPage}&limit=${itemsPerPage}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then(res => res.json())
				.then(data => {
					setTasks(data.items);
					setFilteredTasks(data.items);
					setTotalItems(data.total);
					setCurrentPage(data.page);
					setTotalPages(data.pages);
				})
				.catch((e) => {
					console.log(e);
					setTasks([]);
					setFilteredTasks([]);
				})
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
		if (showNotification) {
			const fadeTimer = setTimeout(() => {
				setFade(true);
			}, 2700); 
			const hideTimer = setTimeout(() => {
				setShowNotification(false);
				setFade(false);
			}, 3000);

			return () => {
				clearTimeout(fadeTimer);
				clearTimeout(hideTimer);
			};
		}
	}, [showNotification]);

	useEffect(() => {
		const fetchUser = async () => {
			const token = getCookie('token');
			const id = getCookie('id');

			if (token && id) {
				setIsLoadingPage(true);
				try {
					const res = await fetch(`/api/users/${id}`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					const data = await res.json();
					setUser({ name: data.items.name, id: data.items.id });
				} catch {
					setUser(null);
				} finally {
					setIsLoadingPage(false);
				}
			} else {
				setIsLoadingPage(false);
			}
		};

		fetchUser();
	}, []);

	useEffect(() => {
		const fetchFilteredTasks = async () => {
			const token = getCookie('token');

			if (token) {
				setIsLoading(true);
				let url = `/api/tasks/`;
				if (searchTerm && searchTerm !== '') {
					url += `search?q=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${itemsPerPage}`;
				} else {
					url += `?page=${currentPage}&limit=${itemsPerPage}`;
				}
				try {
					const res = await fetch(url, {
						headers: { Authorization: `Bearer ${token}` },
					});
					const data = await res.json();
					console.log(data);
					setTasks(data.items);
					setFilteredTasks(data.items);
					setTotalItems(data.total);
					setCurrentPage(data.page);
					setTotalPages(data.pages);
				} catch {
					setTasks([]);
					setFilteredTasks([]);
				} finally {
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		};

		fetchFilteredTasks();
	}, [searchTerm, currentPage, itemsPerPage]);

	useEffect(() => {
		const fetchProjects = async () => {
			const token = getCookie('token');

			if (token) {
				setIsLoading(true);
				try {
					const res = await fetch(`/api/projects/`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					const data = await res.json();
					setProjects(data.items);
				} catch {
					setProjects([]);
				} finally {
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		};

		fetchProjects();
	}, []);

	if (isLoadingPage) {
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

			<main className="flex-1 container mx-auto p-6">
				<h1 className="text-3xl font-bold mb-6 text-gray-800">Задачи</h1>

				<div className="mb-4 w-full flex flex-col md:flex-row md:justify-around md:items-center gap-5">
					<input
						type="text"
						placeholder="Поиск по задачам..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full p-3 rounded-lg shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 h-12"
					/>

					<button
						onClick={handleOpenCreateTask}
						className="px-6 py-1 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200 h-12 flex items-center"
					>
						Добавить
					</button>
				</div>

				<div className="overflow-x-auto rounded-lg shadow bg-white relative">
					{isLoading && (
						<div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
							<div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin"></div>
						</div>
					)}
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Название задачи</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Описание задачи</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Проект</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Статус задачи</th>
								<th className="px-4 py-3 text-center text-sm font-medium text-gray-700" style={{ width: '100px' }}>Действия</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{tasks && tasks.length > 0 ? (
								tasks.map((task) => (
									<tr key={task.id} className="hover:bg-gray-50">
										<td className="px-4 py-3 text-gray-900">{task.title}</td>
										<td className="px-4 py-3 text-gray-900">{(task.description ?? '').length > 20 ? `${(task.description ?? '').substring(0, 20)}...` : task.description ?? ''}</td>
										<td className="px-4 py-3 flex items-center space-x-2">
											<a href={`/projects/${task.project?.id}`} className="text-blue-600 hover:underline">
												{task.project?.name}
											</a>
											<a href={`/projects/${task.project?.id}`} className="text-gray-500 hover:text-gray-700" aria-label="Перейти к проекту">
												<FaExternalLinkAlt />
											</a>
										</td>
										<td className="px-4 py-3 text-gray-900">{getStatusBadge(task.status)}</td>
										<td className="px-4 py-3 flex justify-around items-center">
											<button className="text-blue-500 hover:text-blue-700" title="Редактировать" onClick={() => handleOpenEditTask(task)}>
												<FaEdit />
											</button>
											<button className="text-red-500 hover:text-red-700" title="Удалить" onClick={() => handleOpenDelete(task)}>
												<FaTrash />
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={4} className="px-4 py-3 text-center text-gray-500">
										Нет задач для отображения.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="mt-6 flex justify-center space-x-2">
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
						<button
							key={page}
							onClick={() => handlePageChange(page)}
							className={`px-4 py-2 rounded border ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
						>
							{page}
						</button>
					))}
				</div>
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
			{isDeleteOpen && (
				<Modal title="Удаление задачи" onClose={handleCloseDelete}>
					<div className="fixed inset-0 z-50 flex justify-center items-center p-4">
						<div className="bg-white rounded-lg p-6 max-w-xl w-full relative shadow-lg">
							<h3 className="text-xl font-semibold mb-4">Удаление задачи</h3>
							<form onSubmit={() => handleDeleteTask(selectedTask)} className="space-y-4">
								{selectedTask ? (
									<>
										<label className="flex items-center">
											Вы действительно хотите удалить задачу &quot;{selectedTask.title}&quot;?
										</label>

										<div className="flex justify-end space-x-2 mt-4">
											<button
												type="button"
												onClick={() => setDeleteOpen(false)}
												className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
											>
												Отмена
											</button>
											<button
												type="submit"
												className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
											>
												Удалить
											</button>
										</div>
									</>
								) : (
									<>
										<label className="flex items-center">
											Нет выбранной задачи.
										</label>

										<div className="flex justify-end space-x-2 mt-4">
											<button
												type="button"
												onClick={() => setDeleteOpen(false)}
												className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
											>
												Отмена
											</button>
										</div>
									</>
								)}
							</form>
						</div>
					</div>
				</Modal>
			)}
			{isCreateTaskOpen && (
				<Modal title="Создание новой задачи" onClose={handleCloseCreateTask}>
					<div className="fixed inset-0 z-50 flex justify-center items-center p-4">
						<div className="bg-white rounded-lg p-6 max-w-xl w-full relative shadow-lg">
							<h3 className="text-xl font-semibold mb-4">Создание новой задачи</h3>
							<form onSubmit={handleCreateTask} className="space-y-4">
								<label className="block mb-2" htmlFor="taskName">
									Название*
									<input
										id="taskName"
										type="text"
										placeholder="Введите название..."
										value={newTaskName}
										onChange={(e) => setNewTaskName(e.target.value)}
										className="w-full border px-3 py-2 rounded"
										required
									/>
								</label>

								<label className="block mb-2" htmlFor="taskDescription">
									Описание*
									<textarea
										id="taskDescription"
										placeholder="Введите описание..."
										value={newTaskDescription}
										onChange={(e) => setNewTaskDescription(e.target.value)}
										className="w-full border px-3 py-2 rounded"
										rows={4}
									/>
								</label>

								<label className="block mb-2" htmlFor="projectSelect">
									Проект*
									<select
										id="projectSelect"
										value={selectedProjectId ?? ''}
										onChange={(e) => setSelectedProjectId(parseInt(e.target.value))}
										className="w-full border px-3 py-2 rounded"
										required
									>
										<option value="" disabled>Выберите проект</option>
										{projects.map((project) => (
											<option key={project.id} value={project.id}>
												{project.name}
											</option>
										))}
									</select>
								</label>
								<div className="flex justify-end space-x-2 mt-4">
									<button
										type="button"
										onClick={handleCloseCreateTask}
										className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
									>
										Отмена
									</button>
									<button
										type="submit"
										className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
										disabled={creating}
									>
										{creating ? 'Создается...' : 'Создать'}
									</button>
								</div>
							</form>
						</div>
					</div>
				</Modal>
			)}
			{isEditTaskOpen && taskToEdit && (
				<Modal title="Редактирование задачи" onClose={handleCloseEditTask}>
					<div className="fixed inset-0 z-50 flex justify-center items-center p-4">
						<div className="bg-white rounded-lg p-6 max-w-xl w-full relative shadow-lg">
							<h3 className="text-xl font-semibold mb-4">Редактирование задачи</h3>
							<form onSubmit={handleEditTask} className="space-y-4">
								<label className="block mb-2" htmlFor="taskTitle">
									Название
									<input
										id="taskTitle"
										type="text"
										placeholder="Введите название..."
										value={taskToEdit.title}
										onChange={(e) =>
											setTaskToEdit({ ...taskToEdit, title: e.target.value })
										}
										className="w-full border px-3 py-2 rounded"
										required
									/>
								</label>

								<label className="block mb-2" htmlFor="taskDescription">
									Описание
									<textarea
										id="taskDescription"
										placeholder="Введите описание..."
										value={taskToEdit.description ?? ''}
										onChange={(e) =>
											setTaskToEdit({ ...taskToEdit, description: e.target.value })
										}
										className="w-full border px-3 py-2 rounded"
										rows={4}
									/>
								</label>

								<label className="block mb-2" htmlFor="taskStatus">
									Статус задачи
									<select
										id="taskStatus"
										value={taskToEdit.status}
										onChange={(e) =>
											setTaskToEdit({ ...taskToEdit, status: e.target.value })
										}
										className="w-full border px-3 py-2 rounded"
									>
										<option value="pending">В ожидании</option>
										<option value="processing">В работе</option>
										<option value="success">Выполнена</option>
									</select>
								</label>
								<div className="flex justify-end space-x-2 mt-4">
									<button
										type="button"
										onClick={handleCloseEditTask}
										className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
									>
										Отмена
									</button>
									<button
										type="submit"
										className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
									>
										Сохранить
									</button>
								</div>
							</form>
						</div>
					</div>
				</Modal>
			)}

			{showNotification && (
				<div className={`fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
					Операция прошла успешно!
				</div>
			)}
		</div>
	);
};

export default MyTasksPage;