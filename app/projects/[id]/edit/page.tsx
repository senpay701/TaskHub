"use client"

import { useState, useEffect } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import { getCookie } from '../../../lib/functions'
import { Modal } from '../../../components/Modal';
import { Project } from '../../../types'

export default function EditProjectPage() {
	const router = useRouter();
	const { id } = useParams();
	
	const projectId = typeof id === 'string' ? parseInt(id) : undefined;
	
	if (projectId === undefined || isNaN(projectId)) {
		notFound(); 
	}

	const [project, setProject] = useState<Project | null>(null);

	const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!project) return;

		const token = getCookie('token');

		fetch(`/api/projects/${project.id}`, { 
			headers: { Authorization: `Bearer ${token}` }, 
			method: 'PATCH',
			body: JSON.stringify({
				name: project.name,
				description: project.description,
	  	}), 
		})
		.finally(() => router.replace(`/projects/${projectId}`));
	};

	useEffect(() => {
		const token = getCookie('token');

		if (token) {
			fetch(`/api/projects/${projectId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then(res => res.json())
			.then(data => {
				if (data.items) {
					setProject(data.items);
				} else {
					notFound(); 
				}
			})
			.catch(() => {
				router.replace(`/projects/${projectId}`);
			})
		} else {
			router.replace(`/projects/${projectId}`);
		}
	}, [projectId, router]);

	return (
		<>
			{project && (
				<div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
					<main className="flex-1 container mx-auto p-6">
						<Modal title="Редактирование проекта" onClose={() => router.replace(`/projects/${projectId}`)}>
							<div className="fixed inset-0 z-50 flex justify-center items-center p-4">
								<div className="bg-white rounded-lg p-6 max-w-xl w-full relative shadow-lg">
									<h3 className="text-xl font-semibold mb-4">Редактирование проекта</h3>
									<form onSubmit={handleEdit} className="space-y-4">
										<label className="block mb-2" htmlFor="projectName">
											Название
											<input
												id="projectName"
												type="text"
												placeholder="Введите название..."
												value={project.name}
												onChange={(e) =>
													setProject({ ...project, name: e.target.value })
												}
												className="w-full border px-3 py-2 rounded"
												required
											/>
										</label>

										<label className="block mb-2" htmlFor="projectDescription">
											Описание
											<textarea
												id="projectDescription"
												placeholder="Введите описание..."
												value={project.description ?? ''}
												onChange={(e) =>
													setProject({ ...project, description: e.target.value })
												}
												className="w-full border px-3 py-2 rounded"
												rows={4}
											/>
										</label>
										<div className="flex justify-end space-x-2 mt-4">
											<button
												type="button"
												onClick={() => router.replace(`/projects/${projectId}`)}
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
									<button
										onClick={() => router.replace(`/projects/${projectId}`)}
										className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
									>
										✕
									</button>
								</div>
							</div>
						</Modal>
					</main>
				</div>
			)}
		</>
	);
}