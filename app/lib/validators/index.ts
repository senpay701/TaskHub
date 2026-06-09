import { getUserByEmail } from "../../prisma-db";
import { User } from "../../types/index";

export async function validateUserData(
  data: any,
  isUpdate = false,
  isLogin = false
) {
  const errors = [];

  if (isLogin) {
    if (!data.email || typeof data.email !== 'string') {
      errors.push('Email is required and must be a string.');
    }
    if (!data.password || typeof data.password !== 'string') {
      errors.push('Password is required and must be a string.');
    }
    return errors;
  }
  if (isUpdate && 'email' in data) {
    errors.push('Email cannot be changed.');
  }

  if (!isUpdate && 'email' in data) {
    if (!data.email || typeof data.email !== 'string') {
      errors.push('Email is required and must be a string.');
    } else {
      const existing: User | null = await getUserByEmail(data.email);
      if (existing) errors.push('Email must be unique.');
    }
  }

  if (!isUpdate || ('name' in data) || ('password' in data)) {
    if ('name' in data && (typeof data.name !== 'string' || !data.name.trim())) {
      errors.push('Name must be a non-empty string.');
    }
    if ('password' in data && (typeof data.password !== 'string' || !data.password.trim())) {
      errors.push('Password must be a non-empty string.');
    }
  }

  return errors;
}

export async function validateProjectData(data: any, isUpdate = false) {
  const errors = [];
  if (!isUpdate || ('name' in data)) {
    if (!data.name || typeof data.name !== 'string') {
      errors.push('Name is required and must be a string.');
    }
  }
  if ('description' in data && data.description !== undefined && typeof data.description !== 'string') {
    errors.push('Description must be a string.');
  }
  if (!isUpdate || ('userId' in data)) {
    if (typeof data.userId !== 'number') {
      errors.push('userId is required and must be a number.');
    }
  }
  return errors;
}

export async function validateTaskData(data: any, isUpdate = false) {
  const errors = [];
  if (!isUpdate || ('title' in data)) {
    if (!data.title || typeof data.title !== 'string') {
      errors.push('Title is required and must be a string.');
    }
  }
  if ('description' in data && data.description !== undefined && typeof data.description !== 'string') {
    errors.push('Description must be a string.');
  }
  if ('status' in data && data.status !== undefined && typeof data.status !== 'string') {
    errors.push('Status must be a string.');
  }
  if (!isUpdate || ('projectId' in data)) {
    if (typeof data.projectId !== 'number') {
      errors.push('projectId is required and must be a number.');
    }
  }
  return errors;
}