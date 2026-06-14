import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY: string | undefined = process.env.SECRET_KEY;

export function generateToken(userId: number) {
  if (!SECRET_KEY) {
    throw new Error('SECRET_KEY environment variable is not set');
  }

  const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });

  return token;
}

export async function authenticate(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const token = authHeader.substring(7);
  try {
    if (!SECRET_KEY) {
      throw new Error('SECRET_KEY environment variable is not set');
    }

    const payload = jwt.verify(token, SECRET_KEY);

    return null; 
  } catch {
    return Response.json({ error: 'Invalid token' }, { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
}

export function getId(request: Request): number {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header missing or invalid');
  }

  const token = authHeader.substring(7);
  if (!SECRET_KEY) {
    throw new Error('SECRET_KEY environment variable is not set');
  }

  const payload = jwt.verify(token, SECRET_KEY);
  if (typeof payload === 'object' && payload !== null && 'userId' in payload) {
    return (payload as { userId: number }).userId;
  } else {
    throw new Error('Invalid token payload');
  }
}