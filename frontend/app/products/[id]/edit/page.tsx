"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { productApi, type Product } from "@/lib/api";
import ProductForm from "@/components/ProductForm";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    productApi.getById(Number(id)).then((res) => setProduct(res.data.data));
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/products"
        className={buttonVariants({ variant: "ghost", size: "sm" }) + " mb-4"}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        ກັບໄປໜ້າສິນຄ້າ
      </Link>
      <ProductForm initialData={product} productId={product.id} />
    </div>
  );
}
