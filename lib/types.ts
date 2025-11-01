export interface Task {
  status: string
  id: string
  title: string
  description: string
  priority: string
  dueDate: string
  completed: boolean
  category?: {
    id: string|null
    name?: string
  } | null
}


// lib/types.ts
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success?: boolean;
  error?: string;
}

