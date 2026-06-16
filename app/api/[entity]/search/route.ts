import { getUsers, getTasksByUser, getProjectsByUser, getTaskById } from "../../../prisma-db";
import { User, Project, Task } from "../../../types/index";
import { authenticate, getId } from "../../../middlewares/jwt";

export async function GET(request: Request, context: { params: Promise<{ entity: string }> }) {
	try {
		const authResponse = await authenticate(request);
		if (authResponse) return authResponse;

		const id = await getId(request);

		const params = await context.params;
		const { entity } = params;

		const url = new URL(request.url);
		const search = url.searchParams.get('q') || '';
		const pageParam = url.searchParams.get('page') || '1';
		const limitParam = url.searchParams.get('limit') || '10';
		const searchIdParam = url.searchParams.get('searchId') || undefined;

		const page = parseInt(pageParam, 10);
		const limit = parseInt(limitParam, 10);
		const searchId = (searchIdParam !== undefined ? parseInt(searchIdParam, 10) : undefined);

		if (search == '') {
			return Response.json({ error: 'Invalid search parameters' }, { status: 400, headers: { 'Content-Type': 'application/json' }, });
		}

		if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
			return Response.json({ error: 'Invalid pagination parameters' }, { status: 400, headers: { 'Content-Type': 'application/json' }, });
		}

		const start = (page - 1) * limit;
		const end = start + limit;

		let total: number = 0;
		let items: User[] | Project[] | Task[] = [];

		switch (entity) {
			case 'users': 
				let users: User[] = await getUsers();

				if (search) {
					const s = search.toLowerCase();
					users = users.filter(u =>
					(u.name && u.name.toLowerCase().includes(s)) ||
					(u.email && u.email.toLowerCase().includes(s))
					);
				}

				total = users.length;
				items = users.slice(start, end);

				break;
				
			case 'projects':
				let projects: Project[] = await getProjectsByUser(id);

				if (search) {
					const s = search.toLowerCase();
					projects = projects.filter(p =>
					(p.name && p.name.toLowerCase().includes(s)) ||
					(p.description && p.description.toLowerCase().includes(s))
					);
				}

				total = projects.length;
				items = projects.slice(start, end);

				break;
				
			case 'tasks':
				let tasks: Task[] = await getTasksByUser(id);

				if (search) {
					const s = search.toLowerCase();
					tasks = tasks.filter(t =>
					((searchId !== undefined && searchId == t.projectId) &&
					((t.title && t.title.toLowerCase().includes(s)) ||
					(t.description && t.description.toLowerCase().includes(s)))) || 
					((searchId == undefined) &&
					((t.title && t.title.toLowerCase().includes(s)) ||
					(t.description && t.description.toLowerCase().includes(s))))
					);
				}

				total = tasks.length;
				items = tasks.slice(start, end);

				break;

			default:
				return Response.json({ error: 'Unknown entity' }, { status: 400, headers: { 'Content-Type': 'application/json' }, });
		}

		const pages = Math.ceil(total / limit);

		if (page > pages && total > 0) {
			return Response.json({ error: 'Page out of range' }, { status: 404, headers: { 'Content-Type': 'application/json' }, });
		}

		const responseData = {
			items,
			total,
			page,
			pages,
		};
		
		return Response.json(responseData, { status: 200, headers: { 'Content-Type': 'application/json' }, });
	} catch {
		return Response.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
}