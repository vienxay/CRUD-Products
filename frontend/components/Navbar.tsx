"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Package, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold mr-8">
          <Package className="h-5 w-5" />
          <span>ProductHub</span>
        </Link>

        {user && (
          <nav className="flex items-center gap-1">
            <Link
              href="/products"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              ສິນຄ້າ
            </Link>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="relative h-8 w-8 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                }
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="flex items-center gap-2 p-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  ອອກຈາກລະບົບ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                ເຂົ້າສູ່ລະບົບ
              </Link>
              <Link
                href="/register"
                className={buttonVariants({ size: "sm" })}
              >
                ລົງທະບຽນ
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
