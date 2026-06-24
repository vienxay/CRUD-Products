"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { productApi, BACKEND_URL, type Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

interface Props {
  initialData?: Partial<Product>;
  productId?: number;
}

export default function ProductForm({ initialData, productId }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? 0,
    stock: initialData?.stock ?? 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url
      ? `${BACKEND_URL}${initialData.image_url}`
      : null,
  );
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", String(form.price));
      formData.append("stock", String(form.stock));
      if (imageFile) formData.append("image", imageFile);

      if (productId) {
        await productApi.update(productId, formData);
        toast.success("ແກ້ໄຂສິນຄ້າສຳເລັດ");
      } else {
        await productApi.create(formData);
        toast.success("ເພີ່ມສິນຄ້າສຳເລັດ");
      }
      router.push("/products");
      router.refresh();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "ເກີດຂໍ້ຜິດພາດ");
      } else {
        toast.error("ເກີດຂໍ້ຜິດພາດ");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>
          {productId ? "ແກ້ໄຂສິນຄ້າ" : "ເພີ່ມສິນຄ້າໃໝ່"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ອັບໂຫຼດຮູບ */}
          <div className="space-y-2">
            <Label>ຮູບພາບສິນຄ້າ</Label>
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <Image
                  src={imagePreview}
                  alt="ຕົວຢ່າງ"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  ກົດເພື່ອອັບໂຫຼດຮູບ
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, GIF, WebP (ສູງສຸດ 5MB)
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">ຊື່ສິນຄ້າ *</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="ປ້ອນຊື່ສິນຄ້າ"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">ລາຍລະອຽດ</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="ປ້ອນລາຍລະອຽດສິນຄ້າ"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">ລາຄາ *</Label>
              <Input
                id="price"
                type="number"
                required
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">ສະຕ໋ອກ</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading
                ? "ກຳລັງບັນທຶກ..."
                : productId
                  ? "ບັນທຶກການແກ້ໄຂ"
                  : "ເພີ່ມສິນຄ້າ"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              ຍົກເລີກ
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
