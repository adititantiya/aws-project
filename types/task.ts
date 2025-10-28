export interface Task {
    id: number;
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    completed?: boolean;
    createdAt?: string;
}

export interface TaskDTO extends Omit<Task, 'id' | 'createdAt'> { }