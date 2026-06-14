import { getUserByEmail } from "../../../prisma-db";
import { User } from "../../../types/index";
import { validateUserData} from "../../../lib/validators/index"
import { generateToken } from "../../../middlewares/jwt"

export async function POST(request: Request, context: { params: Promise<{ entity: string }> }) {
  try {
    const { entity } = await context.params;
    const body = await request.json();

    let errors: string[] = [];

    switch (entity) {
      case 'users':
        errors = await validateUserData(body, false, true);

        if (errors.length) return Response.json({ errors }, { status: 422, headers: { 'Content-Type': 'application/json' }, });
        
        const user: User | null = await getUserByEmail(body.email)

        if (!user) return Response.json({ error: 'Incorrect email or password' }, { status: 401, headers: { 'Content-Type': 'application/json' } });

        if (user.password == body.password) {
            const token: string = await generateToken(user.id)

            return Response.json({ token: token, id: user.id }, { status: 200, headers: { 'Content-Type': 'application/json' } });
        } else {
            return Response.json({ error: 'Incorrect email or password' }, { status: 401, headers: { 'Content-Type': 'application/json' }, });
        }

      default:
        return Response.json({ error: 'Unknown entity' }, { status: 400, headers: { 'Content-Type': 'application/json' }, });
    }
  } catch {
    return Response.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Content-Type': 'application/json' }, });
  }
}