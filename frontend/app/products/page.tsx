"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  productApi,
  BACKEND_URL,
  type Product,
  type PaginationMeta,
} from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Package,
  Eye,
  Pencil,
  Trash2,
  SlidersHorizontal,
  X,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const debouncedMinPrice = useDebounce(minPrice, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 300);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 9 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (debouncedMinPrice) params.minPrice = Number(debouncedMinPrice);
      if (debouncedMaxPrice) params.maxPrice = Number(debouncedMaxPrice);

      const res = await productApi.getAll(params);
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error("ໂຫຼດສິນຄ້າບໍ່ສຳເລັດ");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, debouncedMinPrice, debouncedMaxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedMinPrice, debouncedMaxPrice]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await productApi.delete(deleteTarget.id);
      toast.success("ລຶບສິນຄ້າສຳເລັດ");
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      toast.error("ລຶບສິນຄ້າບໍ່ສຳເລັດ");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const hasFilters = search || minPrice || maxPrice;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">ສິນຄ້າ</h1>
          <p className="text-sm text-muted-foreground">
            {pagination
              ? `ທັງໝົດ ${pagination.total} ລາຍການ`
              : "ກຳລັງໂຫຼດ..."}
          </p>
        </div>
        <Link href="/products/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          ເພີ່ມສິນຄ້າ
        </Link>
      </div>

      {/* ຄົ້ນຫາ & ກັ່ນຕອງ */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ຄົ້ນຫາສິນຄ້າ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-accent" : ""}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          ກັ່ນຕອງ
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            ລ້າງ
          </Button>
        )}
      </div>

      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  ລາຄາຕ່ຳສຸດ
                </label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  ລາຄາສູງສຸດ
                </label>
                <Input
                  type="number"
                  min={0}
                  placeholder="ບໍ່ຈຳກັດ"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ຕາຕະລາງສິນຄ້າ */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <CardContent className="pt-4 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">ບໍ່ພົບສິນຄ້າ</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {hasFilters
                ? "ລອງປັບການກັ່ນຕອງ"
                : "ເລີ່ມຕົ້ນໂດຍການເພີ່ມສິນຄ້າທຳອິດ"}
            </p>
            {!hasFilters && (
              <Link href="/products/new" className={buttonVariants()}>
                <Plus className="mr-2 h-4 w-4" />
                ເພີ່ມສິນຄ້າ
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-muted">
                {product.image_url ? (
                  <Image
                    src={`${BACKEND_URL}${product.image_url}`}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold leading-tight line-clamp-1">
                    {product.name}
                  </h3>
                  <Badge variant="secondary" className="shrink-0">
                    ฿{Number(product.price).toLocaleString()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description || "ບໍ່ມີລາຍລະອຽດ"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    ສະຕ໋ອກ: {product.stock}
                  </span>
                  <div className="flex gap-1">
                    <Link
                      href={`/products/${product.id}`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon",
                      })}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/products/${product.id}/edit`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon",
                      })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p);
                    }}
                    isActive={p === page}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < pagination.totalPages) setPage(page + 1);
                  }}
                  className={
                    page >= pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Dialog ຢືນຢັນການລຶບ */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ລຶບສິນຄ້າ</DialogTitle>
            <DialogDescription>
              ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບ &quot;{deleteTarget?.name}&quot;?
              ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
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
