import { useState, useMemo, useEffect } from "react";
import {
  useProducts,
  useDeleteProduct,
  useUpdateProduct,
} from "../hooks/useProducts";
import {
  Loader2,
  Package,
  X,
  Eye,
  Star,
  Tag,
  Trash2,
  Save,
} from "lucide-react";
import type { Product } from "../types";
import toast from "react-hot-toast";

type CategoryFilter = "all" | string;

export default function ProductsList() {
  const { data: products, isLoading, isError, error } = useProducts();
  const deleteProductMutation = useDeleteProduct();
  const updateProductMutation = useUpdateProduct();

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editData, setEditData] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // وقتی محصول انتخاب شد، کپی برای ویرایش بساز
  useEffect(() => {
    if (selectedProduct) {
      setEditData({ ...selectedProduct });
    } else {
      setEditData(null);
    }
  }, [selectedProduct]);

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

  const handleSave = () => {
    if (!editData) return;

    updateProductMutation.mutate(editData, {
      onSuccess: () => {
        toast.success("محصول با موفقیت ویرایش شد");
        setSelectedProduct(null);
      },
      onError: () => {
        toast.error("خطا در ویرایش محصول. لطفاً دوباره تلاش کنید.");
      },
    });
  };

  const toggleSize = (size: string) => {
    if (!editData) return;
    const sizes = editData.sizes.includes(size)
      ? editData.sizes.filter((s) => s !== size)
      : [...editData.sizes, size];
    setEditData({ ...editData, sizes });
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 transition-colors";

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
        <div className="w-full sm:w-auto sm:min-w-[200px]">
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
                  عملیات
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
                        <div className="sm:hidden mt-1">
                          <p className="text-xs text-slate-500">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 text-xs">
                      <Tag className="w-3.5 h-3.5" />
                      {product.category}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-white font-medium whitespace-nowrap hidden md:table-cell">
                    {formatPrice(product.price)}
                  </td>

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

                  <td className="py-4 px-5 hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-sm text-white">{product.rate}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 sm:px-5">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors text-xs font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">جزئیات و ویرایش</span>
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

      {/* ========== Modal جزئیات و ویرایش ========== */}
{selectedProduct && editData && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => setSelectedProduct(null)}
    />

    <div className="relative w-full max-w-3xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <h3 className="font-bold text-white">جزئیات و ویرایش محصول</h3>
        <button
          onClick={() => setSelectedProduct(null)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 overflow-y-auto flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ستون عکس */}
          <div className="space-y-3">
            <div className="w-full aspect-square max-h-[320px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              <img
                src={editData.mainImage}
                alt={editData.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml," +
                    encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#1e293b" width="200" height="200"/><text x="50%" y="50%" fill="#64748b" text-anchor="middle" dy=".3em" font-size="14">بدون تصویر</text></svg>`
                    );
                }}
              />
            </div>
            <p className="text-xs text-slate-500 break-all dir-ltr text-left">
              {editData.mainImage}
            </p>
          </div>

          {/* ستون فرم */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">عنوان</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                دسته‌بندی
              </label>
              <input
                type="text"
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  قیمت (تومان)
                </label>
                <input
                  type="number"
                  value={editData.price}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      price: Number(e.target.value),
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  موجودی
                </label>
                <input
                  type="number"
                  value={editData.quantity}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      quantity: Number(e.target.value),
                    })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  امتیاز
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={editData.rate}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      rate: Number(e.target.value),
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  تخفیف (%)
                </label>
                <input
                  type="number"
                  value={editData.discount}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      discount: Number(e.target.value),
                    })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                توضیحات
              </label>
              <textarea
                rows={3}
                value={editData.desc}
                onChange={(e) =>
                  setEditData({ ...editData, desc: e.target.value })
                }
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* سایز و رنگ زیر دو ستون */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">سایزها</label>
            <div className="flex flex-wrap gap-2">
              {editData.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className="min-w-[44px] px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-500 text-white"
                >
                  {size}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="سایز جدید (مثلاً 42 یا XL) + Enter"
              className={`${inputClass} mt-3`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value && editData && !editData.sizes.includes(value)) {
                    setEditData({
                      ...editData,
                      sizes: [...editData.sizes, value],
                    });
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              برای حذف روی سایز کلیک کنید • برای اضافه کردن Enter بزنید
            </p>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">رنگ‌ها</label>
            <div className="flex flex-wrap gap-2">
              {editData.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border border-white/20"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex flex-col sm:flex-row gap-2 pt-5">
          <button
            onClick={handleSave}
            disabled={updateProductMutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-medium hover:from-indigo-400 hover:to-violet-500 transition-all disabled:opacity-60"
          >
            {updateProductMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                ذخیره تغییرات
              </>
            )}
          </button>

          <button
            onClick={() => setProductToDelete(selectedProduct)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            حذف این محصول
          </button>
        </div>
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
