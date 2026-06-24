"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { Package } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register(email, password, name);
      toast.success("ສ້າງບັນຊີສຳເລັດ! ກະລຸນາເຂົ້າສູ່ລະບົບ.");
      router.push("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "ລົງທະບຽນບໍ່ສຳເລັດ");
      } else {
        toast.error("ລົງທະບຽນບໍ່ສຳເລັດ");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Package className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl">ສ້າງບັນຊີ</CardTitle>
          <CardDescription>ເລີ່ມຕົ້ນໃຊ້ ProductHub</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">ຊື່</Label>
              <Input
                id="name"
                type="text"
                placeholder="ຊື່ຂອງທ່ານ"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ອີເມວ</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">ລະຫັດຜ່ານ</Label>
              <Input
                id="password"
                type="password"
                placeholder="ສ້າງລະຫັດຜ່ານ"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "ກຳລັງສ້າງບັນຊີ..." : "ລົງທະບຽນ"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              ມີບັນຊີແລ້ວ?{" "}
              <Link href="/login" className="text-primary hover:underline">
                ເຂົ້າສູ່ລະບົບ
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
