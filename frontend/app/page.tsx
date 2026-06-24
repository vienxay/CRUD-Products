"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ArrowRight, ShieldCheck, ImageIcon, Search } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-primary/10 p-4">
            <Package className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">ProductHub</h1>
        <p className="text-lg text-muted-foreground mb-8">
          ລະບົບຈັດການສິນຄ້າທີ່ທັນສະໄໝ. ສ້າງ, ຈັດລະບຽບ ແລະ ຕິດຕາມສິນຄ້າຂອງທ່ານໄດ້ຢ່າງງ່າຍດາຍ.
        </p>
        <div className="flex justify-center gap-3">
          {user ? (
            <Link href="/products" className={buttonVariants({ size: "lg" })}>
              ໄປໜ້າສິນຄ້າ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className={buttonVariants({ size: "lg" })}
              >
                ເລີ່ມຕົ້ນໃຊ້ງານ
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                ເຂົ້າສູ່ລະບົບ
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 max-w-3xl w-full">
        <Card>
          <CardContent className="pt-6 text-center">
            <ShieldCheck className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">ປອດໄພ</h3>
            <p className="text-sm text-muted-foreground">
              ລະບົບຢືນຢັນຕົວຕົນ JWT ເພື່ອຮັກສາຂໍ້ມູນຂອງທ່ານ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <ImageIcon className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">ອັບໂຫຼດຮູບ</h3>
            <p className="text-sm text-muted-foreground">
              ອັບໂຫຼດ ແລະ ຈັດການຮູບພາບສິນຄ້າໄດ້ງ່າຍ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Search className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">ຄົ້ນຫາ ແລະ ກັ່ນຕອງ</h3>
            <p className="text-sm text-muted-foreground">
              ຊອກຫາສິນຄ້າໄດ້ໄວດ້ວຍຕົວກັ່ນຕອງອັດສະລິຍະ
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
