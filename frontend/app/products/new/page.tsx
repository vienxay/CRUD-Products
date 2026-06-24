import Link from "next/link";
import ProductForm from "@/components/ProductForm";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/products"
        className={buttonVariants({ variant: "ghost", size: "sm" }) + " mb-4"}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        ກັບໄປໜ້າສິນຄ້າ
      </Link>
      <ProductForm />
    </div>
  );
}
