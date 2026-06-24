"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
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

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/products");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("ເຂົ້າສູ່ລະບົບສຳເລັດ");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ");
      } else {
        toast.error("ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) return null;

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Package className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl">ຍິນດີຕ້ອນຮັບ</CardTitle>
          <CardDescription>ເຂົ້າສູ່ລະບົບບັນຊີຂອງທ່ານ</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
                placeholder="ປ້ອນລະຫັດຜ່ານ"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "ກຳລັງເຂົ້າສູ່ລະບົບ..." : "ເຂົ້າສູ່ລະບົບ"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              ຍັງບໍ່ມີບັນຊີ?{" "}
              <Link href="/register" className="text-primary hover:underline">
                ລົງທະບຽນ
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
