import ProtectedRoute from "@/components/ProtectedRoute";
import { type ReactNode } from "react";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
