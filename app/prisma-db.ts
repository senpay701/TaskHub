import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function createUser(data: { email: string; name: string; password: string }) {
  return await prisma.user.create({ data });
}

export async function getUsers() {
  return await prisma.user.findMany({
    include: {
      projects: {
        include: {
          tasks: true,
        },
      },
    },
  });
}

export async function getUserById(id: number) {
  return await prisma.user.findUnique({ 
    where: { id },
      include: {
        projects: {
          include: {
            tasks: true,
          },
        },
      },
    });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({ 
    where: { email },
      include: {
        projects: {
          include: {
            tasks: true,
          },
        },
      },
    });
}

export async function updateUser(id: number, data: Partial<{ email: string; nickname: string; password: string }>) {
  return await prisma.user.update({ where: { id }, data });
}

export async function deleteUser(id: number) {
  return await prisma.user.delete({ where: { id } });
}

export async function createProject(data: { name: string; description?: string; userId: number }) {
  return await prisma.project.create({ data });
}

export async function getProjectById(id: number, userId: number) {
  return await prisma.project.findUnique({ 
    where: { id, userId },
    include: {
      tasks: true,
    },
  });
}

export async function getProjectsByUser(userId: number) {
  return await prisma.project.findMany({ 
    where: { userId },
    include: {
      tasks: true,
    }, 
  });
}

export async function getProjects() {
  return await prisma.project.findMany({
    include: {
      tasks: true,
    },
  });
}

export async function updateProject(id: number, data: { name?: string; description?: string }) {
  return await prisma.project.update({ where: { id }, data });
}

export async function deleteProject(id: number) {
  return await prisma.project.delete({ where: { id } });
}

export async function createTask(data: { title: string; description?: string; status: string; projectId: number }) {
  return await prisma.task.create({ data });
}

export async function getTaskById(id: number, userId: number) {
  return await prisma.task.findFirst({
    where: {
      id,
      project: {
        userId: userId,
      },
    },
    include: {
      project: true,
    },
  });
}

export async function getTasksByProject(projectId: number) {
  return await prisma.task.findMany({ where: { projectId } });
}

export async function getTasks() {
  return await prisma.task.findMany({
    include: {
      project: true,
    },
  });
}

export async function updateTask(id: number, data: { title?: string; description?: string; status?: string }) {
  return await prisma.task.update({ where: { id }, data });
}

export async function deleteTask(id: number) {
  return await prisma.task.delete({ where: { id } });
}