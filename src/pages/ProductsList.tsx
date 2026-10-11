import { useState, useMemo } from "react";
import { useProducts, useDeleteProduct } from "../hooks/useProducts";
import { Loader2, Package, X, Eye, Star, Tag, Trash2 } from "lucide-react";
import type { Product } from "../types";
import toast from "react-hot-toast";

type CategoryFilter = "all" | string;

export default function ProductsList() {
  const { data: products, isLoading, isError, error } = useProducts();
  const deleteProductMutation = useDeleteProduct();

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const categories = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  const filteredProducts = products?.filter((product) => {
    if (categoryFilter === "all") return true;
    return product.category === categoryFilter;
  });

  const formatPrice = (price: number) =>
    price.toLocaleString("fa-IR") + " تومان";

  const handleDelete = () => {
    if (!productToDelete) return;

    deleteProductMutation.mutate(productToDelete.id, {
      onSuccess: () => {
        toast.success(`محصول "${productToDelete.title}" با موفقیت حذف شد`);
        setProductToDelete(null);
        if (selectedProduct?.id === productToDelete.id) {
          setSelectedProduct(null);
        }
      },
      onError: () => {
        toast.error("خطا در حذف محصول. لطفاً دوباره تلاش کنید.");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm">در حال دریافت محصولات...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl p-6 text-center">
        خطا در دریافت اطلاعات محصولات
        <p className="text-xs mt-2 text-red-400/70">
          {(error as any)?.message || "لطفاً اتصال به سرور را بررسی کنید"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">لیست محصولات</h2>
            <p className="text-sm text-slate-400">
              {filteredProducts?.length || 0} محصول
              {categoryFilter !== "all" && (
                <span className="text-slate-500">
                  {" "}
                  از {products?.length || 0} محصول
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-auto">
          {/* Mobile Select */}
          <div className="sm:hidden">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all" className="bg-slate-900">
                همه دسته‌بندی‌ها
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1 overflow-x-auto">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                categoryFilter === "all"
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              همه
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="text-right py-4 px-4 sm:px-5 font-medium hidden sm:table-cell">
                  #
                </th>
                <th className="text-right py-4 px-4 sm:px-5 font-medium">
                  محصول
                </th>
                <th className="text-right py-4 px-5 font-medium hidden md:table-cell">
                  دسته‌بندی
                </th>
                <th className="text-right py-4 px-5 font-medium hidden md:table-cell">
                  قیمت
                </th>
                <th className="text-right py-4 px-5 font-medium hidden lg:table-cell">
                  موجودی
                </th>
                <th className="text-right py-4 px-5 font-medium hidden lg:table-cell">
                  امتیاز
                </th>
                <th className="text-right py-4 px-4 sm:px-5 font-medium">
                  جزئیات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 sm:px-5 text-slate-400 hidden sm:table-cell">
                    {index + 1}
                  </td>

                  {/* محصول */}
                  <td className="py-4 px-4 sm:px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.mainImage}
                        alt={product.title}
                        className="w-12 h-12 rounded-xl object-cover bg-white/10 shrink-0 hidden sm:block"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate max-w-[200px] sm:max-w-[240px]">
                          {product.title}
                        </p>
                        <div className="sm:hidden mt-1 space-y-0.5">
                          <p className="text-xs text-slate-500">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* دسته‌بندی */}
                  <td className="py-4 px-5 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 text-xs">
                      <Tag className="w-3.5 h-3.5" />
                      {product.category}
                    </span>
                  </td>

                  {/* قیمت */}
                  <td className="py-4 px-5 text-white font-medium whitespace-nowrap hidden md:table-cell">
                    {formatPrice(product.price)}
                  </td>

                  {/* موجودی */}
                  <td className="py-4 px-5 hidden lg:table-cell">
                    <span
                      className={`text-sm ${
                        product.quantity > 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {product.quantity > 0
                        ? `${product.quantity} عدد`
                        : "ناموجود"}
                    </span>
                  </td>

                  {/* امتیاز */}
                  <td className="py-4 px-5 hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-sm text-white">{product.rate}</span>
                    </div>
                  </td>

                  {/* دکمه جزئیات */}
                  <td className="py-4 px-4 sm:px-5">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors text-xs font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">جزئیات</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts?.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            هیچ محصولی با این فیلتر یافت نشد
          </div>
        )}
      </div>

      {/* ========== Modal جزئیات محصول ========== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
              <h3 className="font-bold text-white">جزئیات محصول</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              <img
                src={selectedProduct.mainImage}
                alt={selectedProduct.title}
                className="w-full h-44 object-cover rounded-xl bg-white/10"
              />

              <div>
                <h4 className="font-bold text-white text-lg leading-relaxed">
                  {selectedProduct.title}
                </h4>
                <p className="text-indigo-400 font-semibold mt-1 text-lg">
                  {formatPrice(selectedProduct.price)}
                </p>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed">
                {selectedProduct.desc}
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400">دسته‌بندی</span>
                  <span className="text-white">{selectedProduct.category}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400">موجودی</span>
                  <span
                    className={
                      selectedProduct.quantity > 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {selectedProduct.quantity > 0
                      ? `${selectedProduct.quantity} عدد`
                      : "ناموجود"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400">امتیاز</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-white">{selectedProduct.rate}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400">تخفیف</span>
                  <span className="text-white">
                    {selectedProduct.discount > 0
                      ? `${selectedProduct.discount}%`
                      : "ندارد"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400">سایزها</span>
                  <div className="flex gap-1.5">
                    {selectedProduct.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-2 py-0.5 rounded bg-white/10 text-xs text-white"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">رنگ‌ها</span>
                  <div className="flex gap-2">
                    {selectedProduct.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* دکمه حذف داخل مودال */}
              <button
                onClick={() => setProductToDelete(selectedProduct)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                حذف این محصول
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Modal تأیید حذف ========== */}
      {productToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setProductToDelete(null)}
          />
          <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center space-y-5">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">حذف محصول</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  آیا از حذف محصول{" "}
                  <span className="text-white font-medium">
                    "{productToDelete.title}"
                  </span>{" "}
                  مطمئن هستید؟
                  <br />
                  این عمل قابل بازگشت نیست.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setProductToDelete(null)}
                  disabled={deleteProductMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  انصراف
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteProductMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  {deleteProductMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      در حال حذف...
                    </>
                  ) : (
                    "بله، حذف شود"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
