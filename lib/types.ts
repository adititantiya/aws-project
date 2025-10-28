export interface Task {
  id: string
  title: string
  description: string
  priority: string
  dueDate: string
  completed: boolean
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

