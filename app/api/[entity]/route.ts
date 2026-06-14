import { getUsers, getTasks, getProjectsByUser, createUser, createProject, createTask } from "../../prisma-db";
import { User, Project, Task } from "../../types/index";
import { validateUserData, validateProjectData, validateTaskData, validateEmail} from "../../lib/validators/index"
import { generateToken, authenticate, getId } from "../../middlewares/jwt"

export async function GET(request: Request, context: { params: Promise<{ entity: string }> }) {
  try {
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    const id = await getId(request);

    const params = await context.params;
    const { entity } = params;

    const url = new URL(request.url);
    const pageParam = url.searchParams.get('page') || '1';
    const limitParam = url.searchParams.get('limit') || '10';

    const page = parseInt(pageParam, 10);
    const limit = parseInt(limitParam, 10)

    const start = (page - 1) * limit;
    const end = start + limit;

    let total: number = 0;
    let items: User[] | Project[] | Task[] = [];

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return Response.json({ error: 'Invalid pagination parameters' }, { status: 400, headers: { 'Content-Type': 'application/json' }, });
    }

    switch (entity) {
      case 'users':
        const users: User[] = await getUsers();

        total = users.length;
        items = users.slice(start, end);

        break;

      case 'projects':
        const projects: Project[] = await getProjectsByUser(id);

        total = projects.length;
        items = projects.slice(start, end);

        break;

      case 'tasks':
        const tasks: Task[] = await getTasks();

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
    return Response.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Content-Type': 'application/json' }, });
  }
}

export async function POST(request: Request, context: { params: Promise<{ entity: string }> }) {
  try {
    const { entity } = await context.params;
    const body = await request.json();

    const authResponse = await authenticate(request);

    let errors: string[] = [];

    switch (entity) {
      case 'users':
        errors = await validateUserData(body);

        if (!body.email || !validateEmail(body.email)) errors.push("Incorrect email");
        if (body.password != body.repeatPassword) errors.push("Passwords do not match");

        if (errors.length) return Response.json({ errors }, { status: 422, headers: { 'Content-Type': 'application/json' }, });

        const { email, name, password } = body;
        const newUser: User = await createUser({ email, name, password });
        const token: string = await generateToken(newUser.id)

        const userData = {
          items: newUser,
          token: token,
        };

        return Response.json(userData, { status: 201, headers: { 'Content-Type': 'application/json' } });

      case 'projects':
		    if (authResponse) return authResponse;

        errors = await validateProjectData(body);

        if (errors.length) return Response.json({ errors }, { status: 422, headers: { 'Content-Type': 'application/json' }, });
        
        const newProject: Project = await createProject(body);

        const projectData = {
          items: newProject,
        };

        return Response.json(projectData, { status: 201, headers: { 'Content-Type': 'application/json' } });

      case 'tasks':
		    if (authResponse) return authResponse;

        errors = await validateTaskData(body);

        if (errors.length) return Response.json({ errors }, { status: 422, headers: { 'Content-Type': 'application/json' }, });
        
        const newTask: Task = await createTask(body);

        const taskData = {
          items: newTask,
        };

        return Response.json(taskData, { status: 201, headers: { 'Content-Type': 'application/json' } });

      default:
        return Response.json({ error: 'Unknown entity' }, { status: 400, headers: { 'Content-Type': 'application/json' }, });
    }
  } catch (error) {
    return Response.json({ error: error }, { status: 500, headers: { 'Content-Type': 'application/json' }, });
  }
}