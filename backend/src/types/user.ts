export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
}

export type UserResponse = Omit<User, "password_hash">;

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface JwtPayload {
  userId: number;
  email: string;
}
