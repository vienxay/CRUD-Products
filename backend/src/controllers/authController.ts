import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db";
import { ApiResponse } from "../types/product";
import {
  AuthResponse,
  CreateUserDto,
  LoginDto,
  User,
  UserResponse,
} from "../types/user";

const generateToken = (userId: number, email: string): string => {
  const secret = process.env.JWT_SECRET || "fallback-secret";
  return jwt.sign({ userId, email }, secret, { expiresIn: "7d" });
};

const toUserResponse = (user: User): UserResponse => {
  const { password_hash: _, ...rest } = user;
  return rest;
};

export const register = async (
  req: Request<{}, {}, CreateUserDto>,
  res: Response<ApiResponse<AuthResponse>>,
): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res
      .status(400)
      .json({ success: false, message: "Email, password, and name are required" });
    return;
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length) {
      res.status(409).json({ success: false, message: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query<User>(
      `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *`,
      [email, passwordHash, name],
    );

    const user = rows[0] as User;
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      success: true,
      data: { token, user: toUserResponse(user) },
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (
  req: Request<{}, {}, LoginDto>,
  res: Response<ApiResponse<AuthResponse>>,
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
    return;
  }

  try {
    const { rows } = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (!rows.length) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const user = rows[0] as User;
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user.id, user.email);

    res.json({
      success: true,
      data: { token, user: toUserResponse(user) },
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ success: false, message: error.message });
  }
};
