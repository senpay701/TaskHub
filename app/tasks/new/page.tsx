"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from '../../lib/functions';
import { Modal } from '../../components/Modal';
import { Project } from '../../types';

export default function CreateProjectPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
	const [projectId, setProjectId] = useState<null | number>(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = getCookie('token');

    fetch('/api/tasks/', { 
			headers: { Authorization: `Bearer ${token}` }, 
			method: 'POST',
			body: JSON.stringify({
				title: name,
				description: description,
				projectId: projectId,
				status: 'pending'
			}), 
		})
    .then(res => res.json())
    .catch((error) => console.error('Ошибка:', error))
    .finally(() => {
			setLoading(false);
			router.replace('/tasks');
		});
  };

	useEffect(() => {
		const fetchProjects = async () => {
			const token = getCookie('token');

			if (token) {
				try {
					const res = await fetch(`/api/projects/`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					const data = await res.json();
					setProjects(data.items);
				} catch {
					setProjects([]);
				}
			} else {
				router.push('/');
			}
		};

		fetchProjects();
	}, [router]);

  return (
		<div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
			<main className="flex-1 container mx-auto p-6">
				<Modal title="Создание новой задачи" onClose={() => router.replace('/tasks')}>
					<div className="fixed inset-0 z-50 flex justify-center items-center p-4">
						<div className="bg-white rounded-lg p-6 max-w-xl w-full relative shadow-lg">
							<h3 className="text-xl font-semibold mb-4">Создание новой задачи</h3>
							<form onSubmit={handleCreate} className="space-y-4">
								<label className="block mb-2" htmlFor="taskName">
									Название*
									<input
										id="taskName"
										type="text"
										placeholder="Введите название..."
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="w-full border px-3 py-2 rounded"
										required
									/>
								</label>

								<label className="block mb-2" htmlFor="taskDescription">
									Описание*
									<textarea
										id="taskDescription"
										placeholder="Введите описание..."
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										className="w-full border px-3 py-2 rounded"
										rows={4}
									/>
								</label>

								<label className="block mb-2" htmlFor="projectSelect">
									Проект*
									<select
										id="projectSelect"
										value={projectId ?? ''}
										onChange={(e) => setProjectId(parseInt(e.target.value))}
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
										onClick={() => router.replace('/tasks')}
										className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
									>
										Отмена
									</button>
									<button
										type="submit"
										className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
										disabled={loading}
									>
										{loading ? 'Создается...' : 'Создать'}
									</button>
								</div>
							</form>
						</div>
					</div>
				</Modal>
			</main>
		</div>
  );
}