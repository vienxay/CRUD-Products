export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export type CreateProductDto = Omit<Product, "id" | "created_at" | "updated_at">;
export type UpdateProductDto = Partial<CreateProductDto>;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationMeta;
}
