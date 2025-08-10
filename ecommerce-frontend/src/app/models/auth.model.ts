export interface User {
  id: number;
  name: string;
  email: string;
  role?: string; // Added role field for admin functionality
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
