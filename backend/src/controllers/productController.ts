import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import pool from "../config/db";
import { ApiResponse, Product } from "../types/product";

export const getAllProducts = async (
  req: Request,
  res: Response<ApiResponse<Product[]>>,
): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const offset = (page - 1) * limit;
    const search = req.query.search as string | undefined;
    const minPrice = req.query.minPrice as string | undefined;
    const maxPrice = req.query.maxPrice as string | undefined;

    const conditions: string[] = [];
    const values: unknown[] = [];
    let paramIdx = 1;

    if (search) {
      conditions.push(`name ILIKE $${paramIdx++}`);
      values.push(`%${search}%`);
    }
    if (minPrice) {
      conditions.push(`price >= $${paramIdx++}`);
      values.push(Number(minPrice));
    }
    if (maxPrice) {
      conditions.push(`price <= $${paramIdx++}`);
      values.push(Number(maxPrice));
    }

    const whereClause = conditions.length
      ? "WHERE " + conditions.join(" AND ")
      : "";

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products ${whereClause}`,
      values,
    );
    const total = Number(countResult.rows[0]?.count ?? 0);

    const dataValues = [...values, limit, offset];
    const { rows } = await pool.query<Product>(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx}`,
      dataValues,
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Product>>,
): Promise<void> => {
  try {
    const { rows } = await pool.query<Product>(
      "SELECT * FROM products WHERE id = $1",
      [req.params.id],
    );
    if (!rows.length) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.json({ success: true, data: rows[0] as Product });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (
  req: Request,
  res: Response<ApiResponse<Product>>,
): Promise<void> => {
  const { name, description, price, stock } = req.body;
  if (!name || price == null) {
    res
      .status(400)
      .json({ success: false, message: "Name and price are required" });
    return;
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const { rows } = await pool.query<Product>(
      `INSERT INTO products (name, description, price, stock, image_url)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description ?? "", Number(price), Number(stock) || 0, imageUrl],
    );
    res.status(201).json({ success: true, data: rows[0] as Product });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Product>>,
): Promise<void> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  const allowedFields = ["name", "description", "price", "stock"];
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      fields.push(`${key}=$${idx++}`);
      values.push(
        key === "price" || key === "stock"
          ? Number(req.body[key])
          : req.body[key],
      );
    }
  }

  if (req.file) {
    fields.push(`image_url=$${idx++}`);
    values.push(`/uploads/${req.file.filename}`);
  }

  if (!fields.length) {
    res
      .status(400)
      .json({ success: false, message: "No fields to update" });
    return;
  }

  fields.push(`updated_at=NOW()`);
  values.push(req.params.id);

  try {
    const { rows } = await pool.query<Product>(
      `UPDATE products SET ${fields.join(", ")} WHERE id=$${idx} RETURNING *`,
      values,
    );
    if (!rows.length) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.json({ success: true, data: rows[0] as Product });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<null>>,
): Promise<void> => {
  try {
    const { rows } = await pool.query<Product>(
      "SELECT image_url FROM products WHERE id = $1",
      [req.params.id],
    );
    if (!rows.length) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const imageUrl = (rows[0] as Product).image_url;
    if (imageUrl) {
      const filePath = path.join(__dirname, "..", "..", imageUrl);
      fs.unlink(filePath, () => {});
    }

    await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ success: false, message: error.message });
  }
};
