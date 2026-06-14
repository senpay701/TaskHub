import { getUserById, getTaskById, getProjectById, deleteUser, deleteProject, deleteTask, updateUser, updateTask, updateProject } from "../../../prisma-db";
import { User, Project, Task } from "../../../types";
import { validateUserData, validateProjectData, validateTaskData} from "../../../lib/validators";
import { authenticate, getId } from "../../../middlewares/jwt";

export async function GET(request: Request, context: { params: Promise<{ entity: string; id: string }> }) {
  try {
    const authResponse = await authenticate(request);
		if (authResponse) return authResponse;

    const userId = await getId(request);
    
    const { entity, id } = await context.params;

    const parsedId = parseInt(id, 10);
    let items: User | Project | Task | null = null;

    switch (entity) {
      case 'users':
        const user: User | null = await getUserById(parsedId);
        items = user;

        break;
    
      case 'projects':
        const project: Project | null = await getProjectById(parsedId, userId);
        items = project;

        break;

      case 'tasks':
        const task: Task | null = await getTaskById(parsedId, userId);
        items = task;

        break;
    }

    const responseData = {
      items,
    };

    return Response.json(responseData, { status: 200, headers: { 'Content-Type': 'application/json' }, });
  } catch {
    return Response.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ entity: string; id: string }> }) {
  const authResponse = await authenticate(request);
	if (authResponse) return authResponse;

  const userId = await getId(request);

  const { entity, id } = await context.params;

  const parsedId = parseInt(id, 10);

  switch (entity) {
    case 'users':
      const user: User | null = await getUserById(parsedId);

      if (!user) return Response.json({ error: 'Unknown user' }, { status: 404, headers: { 'Content-Type': 'application/json' } });

      await deleteUser(parsedId);

      break;

    case 'projects':
      const project: Project | null = await getProjectById(parsedId, userId);

      if (!project) return Response.json({ error: 'Unknown project' }, { status: 404, headers: { 'Content-Type': 'application/json' } });

      await deleteProject(parsedId);

      break;

    case 'tasks':
      const task: Task | null = await getTaskById(parsedId, userId);

      if (!task) return Response.json({ error: 'Unknown task' }, { status: 404, headers: { 'Content-Type': 'application/json' } });

      await deleteTask(parsedId);

      break;

    default:
      return Response.json({ error: 'Unknown entity' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(null, { status: 204 });
}

export async function PATCH(request: Request, context: { params: Promise<{ entity: string; id: string }> }) {
  const authResponse = await authenticate(request);
	if (authResponse) return authResponse;

  const userId = await getId(request);
    
  const { entity, id } = await context.params;
  const body = await request.json();

  const parsedId = parseInt(id, 10);
  let errors: string[] = [];

  switch (entity) {
    case 'users':
      const user: User | null = await getUserById(parsedId);

      if (!user) return Response.json({ error: 'Unknown user' }, { status: 404, headers: { 'Content-Type': 'application/json' } });

      errors = await validateUserData(body, true);
      
      if (errors.length) return Response.json({ errors }, { status: 422, headers: { 'Content-Type': 'application/json' } });

      await updateUser(parsedId, body);

      break;

    case 'projects':
      const project: Project | null = await getProjectById(parsedId, userId);

      if (!project) return Response.json({ error: 'Unknown project' }, { status: 404, headers: { 'Content-Type': 'application/json' } });

      errors = await validateProjectData(body, true);
      
      if (errors.length) return Response.json({ errors }, { status: 422, headers: { 'Content-Type': 'application/json' } });

      await updateProject(parsedId, body);

      break;

    case 'tasks':
      const task: Task | null = await getTaskById(parsedId, userId);

      if (!task) return Response.json({ error: 'Unknown task' }, { status: 404, headers: { 'Content-Type': 'application/json' } });

      errors = await validateTaskData(body, true);
      
      if (errors.length) return Response.json({ errors }, { status: 422, headers: { 'Content-Type': 'application/json' } });

      await updateTask(parsedId, body);

      break;

    default:
      return Response.json({ error: 'Unknown entity' }, { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(null, { status: 204 });
}