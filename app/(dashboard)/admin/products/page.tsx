'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search, Trash2, Package, Plus, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '@/api/admin.api';
import { ProductFormModal } from '@/components/dashboard/ProductFormModal';
import { formatPrice } from '@/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<{ id: string; stock: number } | null>(null);
  const [modal, setModal] = useState<{ open: boolean; product?: Product }>({ open: false });
  const limit = 15;

  const fetchProducts = (p = page) => {
    setLoading(true);
    adminApi.listProducts({ page: p, limit, search: search || undefined })
      .then(({ data }) => { setProducts(data.data); setTotal(data.meta.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(1); setPage(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProducts(page); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
    setPage(1);
  };

  const openCreate = () => setModal({ open: true, product: undefined });
  const openEdit = (product: Product) => setModal({ open: true, product });
  const closeModal = () => setModal({ open: false });

  const handleSaved = (saved: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) return prev.map((p) => (p.id === saved.id ? saved : p));
      setTotal((t) => t + 1);
      return [saved, ...prev];
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTotal((t) => t - 1);
      toast.success('Product deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const handleStockSave = async () => {
    if (!editingStock) return;
    try {
      const { data } = await adminApi.updateProductStock(editingStock.id, editingStock.stock);
      setProducts((prev) => prev.map((p) => (p.id === data.data.id ? data.data : p)));
      toast.success('Stock updated');
    } catch {
      toast.error('Stock update failed');
    } finally {
      setEditingStock(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">Search</Button>
        </form>

        {loading ? <PageSpinner /> : (
          <>
            {!products.length ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-neutral-400 gap-3">
                <Package className="h-10 w-10" />
                <p className="text-sm">No products found</p>
                <Button variant="secondary" size="sm" onClick={openCreate}>
                  <Plus className="h-3.5 w-3.5" /> Add Product
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-neutral-100 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/80">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">Product</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-400">Price</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-400">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className={`hover:bg-neutral-50/60 transition-colors ${deleting === product.id ? 'opacity-40 pointer-events-none' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
                              {product.images[0]
                                ? <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                                : <Package className="m-auto h-4 w-4 text-neutral-300" />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-neutral-800 truncate">{product.name}</p>
                              <p className="text-xs text-neutral-400 font-mono">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{formatPrice(product.price)}</td>
                        <td className="px-4 py-3 text-center">
                          {editingStock?.id === product.id ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <input
                                type="number" min={0}
                                value={editingStock.stock}
                                onChange={(e) => setEditingStock({ id: product.id, stock: Number(e.target.value) })}
                                className="w-16 rounded-lg border border-neutral-200 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-gold/30"
                              />
                              <button onClick={handleStockSave} className="text-xs text-green-600 font-medium hover:underline">Save</button>
                              <button onClick={() => setEditingStock(null)} className="text-xs text-neutral-400 hover:underline">×</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingStock({ id: product.id, stock: product.stock })}
                              className={`font-medium hover:underline text-sm ${product.stock === 0 ? 'text-red-500' : product.stock < 5 ? 'text-amber-500' : 'text-neutral-700'}`}
                            >
                              {product.stock}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={product.stock === 0 ? 'danger' : product.is_featured ? 'info' : 'default'}>
                            {product.stock === 0 ? 'Out of stock' : product.is_featured ? 'Featured' : 'Active'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(product)}
                              className="rounded-lg p-1.5 text-neutral-300 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                              aria-label="Edit product"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="rounded-lg p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                              aria-label="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <span className="text-sm text-neutral-400">Page {page} of {totalPages}</span>
                <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </div>

      <ProductFormModal
        open={modal.open}
        onClose={closeModal}
        product={modal.product}
        onSaved={handleSaved}
      />
    </>
  );
}
