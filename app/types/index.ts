export type Task = {
    id: number;
    title: string;
    description: string | null;
    status: string;
    projectId: number;
    project?: Project;
    createdAt: Date;
    updatedAt: Date;
}

export type Project = {
    id: number;
    name: string;
    description: string | null;
    userId: number;
    user?: User;
    tasks?: Task[];
    createdAt: Date;
    updatedAt: Date;
}

export type User = {
    id: number;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    projects?: Project[];
}