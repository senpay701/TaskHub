"use client"

import { useState, useEffect} from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import { getCookie } from '../../../lib/functions'
import { Modal } from '../../../components/Modal';
import { Task } from '../../../types'

export default function EditProjectPage() {
	const router = useRouter();
	const { id } = useParams();
	
	const taskId = typeof id === 'string' ? parseInt(id) : undefined;
	
	if (taskId === undefined || isNaN(taskId)) {
		notFound(); 
	}

	const [task, setTask] = useState<Task | null>(null);

	const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!task) return;

		const token = getCookie('token');

		fetch(`/api/tasks/${task.id}`, { 
			headers: { Authorization: `Bearer ${token}` }, 
			method: 'PATCH',
			body: JSON.stringify({
				title: task.title,
				description: task.description,
				status: task.status,
	  	}), 
		})
		.finally(() => router.replace(`/tasks`));
	};

	useEffect(() => {
		const token = getCookie('token');

		if (token) {
			fetch(`/api/tasks/${taskId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then(res => res.json())
			.then(data => {
				if (data.items) {
					setTask(data.items);
				} else {
					router.replace(`/tasks`);
				}
			})
			.catch(() => {
				router.replace(`/tasks`);
			})
		} else {
			router.replace(`/tasks`);
		}
	}, [taskId, router]);

	return (
		<>
			{task && (
				<div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
					<main className="flex-1 container mx-auto p-6">
						<Modal title="Редактирование задачи" onClose={() => router.replace(`/tasks`)}>
							<div className="fixed inset-0 z-50 flex justify-center items-center p-4">
								<div className="bg-white rounded-lg p-6 max-w-xl w-full relative shadow-lg">
									<h3 className="text-xl font-semibold mb-4">Редактирование задачи</h3>
									<form onSubmit={handleEdit} className="space-y-4">
										<label className="block mb-2" htmlFor="taskTitle">
											Название
											<input
												id="taskTitle"
												type="text"
												placeholder="Введите название..."
												value={task.title}
												onChange={(e) =>
													setTask({ ...task, title: e.target.value })
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
												value={task.description ?? ''}
												onChange={(e) =>
													setTask({ ...task, description: e.target.value })
												}
												className="w-full border px-3 py-2 rounded"
												rows={4}
											/>
										</label>

										<label className="block mb-2" htmlFor="taskStatus">
											Статус задачи
											<select
												id="taskStatus"
												value={task.status}
												onChange={(e) =>
													setTask({ ...task, status: e.target.value })
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
												onClick={() => router.replace(`/tasks`)}
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
					</main>
				</div>
			)}
		</>
	);
}