"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { productApi, BACKEND_URL, type Product } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Trash2, Package } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    productApi
      .getById(Number(id))
      .then((res) => setProduct(res.data.data))
      .catch(() => toast.error("ບໍ່ພົບສິນຄ້າ"));
  }, [id]);

  const handleDelete = async () => {
    await productApi.delete(Number(id));
    toast.success("ລຶບສິນຄ້າສຳເລັດ");
    router.push("/products");
  };

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

      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="relative md:w-1/2 h-64 md:h-auto bg-muted">
            {product.image_url ? (
              <Image
                src={`${BACKEND_URL}${product.image_url}`}
                alt={product.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[16rem]">
                <Package className="h-16 w-16 text-muted-foreground/40" />
              </div>
            )}
          </div>
          <CardContent className="md:w-1/2 p-6">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <div className="flex gap-2 mb-4">
              <Badge variant="default" className="text-sm">
                ฿{Number(product.price).toLocaleString()}
              </Badge>
              <Badge
                variant={product.stock > 0 ? "secondary" : "destructive"}
                className="text-sm"
              >
                {product.stock > 0
                  ? `${product.stock} ໃນສະຕ໋ອກ`
                  : "ໝົດສະຕ໋ອກ"}
              </Badge>
            </div>
            <Separator className="my-4" />
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                ລາຍລະອຽດ
              </h3>
              <p className="text-sm leading-relaxed">
                {product.description || "ບໍ່ມີລາຍລະອຽດ."}
              </p>
            </div>
            <div className="text-xs text-muted-foreground mb-6">
              ສ້າງເມື່ອ: {new Date(product.created_at).toLocaleDateString("lo-LA")}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/products/${product.id}/edit`}
                className={buttonVariants()}
              >
                <Pencil className="mr-2 h-4 w-4" />
                ແກ້ໄຂ
              </Link>
              <Button
                variant="destructive"
                onClick={() => setShowDelete(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                ລຶບ
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ລຶບສິນຄ້າ</DialogTitle>
            <DialogDescription>
              ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບ &quot;{product.name}&quot;?
              ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              ຍົກເລີກ
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              ລຶບ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
