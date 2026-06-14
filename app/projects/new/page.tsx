"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from '../../lib/functions'
import { Modal } from '../../components/Modal';

export default function CreateProjectPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = getCookie('token');
    const id = getCookie('id'); 
		const userId = id !== null ? parseInt(id, 10) : null;

    fetch('/api/projects/', { 
			headers: { Authorization: `Bearer ${token}` }, 
			method: 'POST',
			body: JSON.stringify({
				name: name,
				description: description,
				userId: userId
			}), 
		})
    .then(res => res.json())
    .catch((error) => console.error('Ошибка:', error))
    .finally(() => {
			setLoading(false);
			router.replace('/projects');
		});
  };

  return (
		<div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
			<main className="flex-1 container mx-auto p-6">
				<Modal title="Создание нового проекта" onClose={() => router.replace('/projects')}>
					<div className="fixed inset-0 z-50 flex justify-center items-center p-4">
						<div className="bg-white rounded-lg p-6 max-w-xl w-full relative shadow-lg">
							<h3 className="text-xl font-semibold mb-4">Создание нового проекта</h3>
							<form onSubmit={handleCreate} className="space-y-4">
								<label className="block mb-2" htmlFor="projectName">
                  Название*
                  <input
                    id="projectName"
                    type="text"
                    placeholder="Введите название..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </label>

                <label className="block mb-2" htmlFor="projectDescription">
                  Описание*
                  <textarea
                    id="projectDescription"
                    placeholder="Введите описание..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    rows={4}
                  />
                </label>
								<div className="flex justify-end space-x-2 mt-4">
									<button
										type="button"
										onClick={() => router.replace('/projects')}
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
							<button
								onClick={() => router.replace(`/projects`)}
								className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
							>
								✕
							</button>
						</div>
					</div>
				</Modal>
			</main>
		</div>
  );
}