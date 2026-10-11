import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import {
  Loader2,
  ShoppingCart,
  X,
  Eye,
  Package,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";
import type { Order } from "../types";

export default function Orders() {
  const { data: orders, isLoading, isError, error } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatPrice = (price: number) =>
    price.toLocaleString("fa-IR") + " تومان";

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm">در حال دریافت سفارشات...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl p-6 text-center">
        خطا در دریافت سفارشات
        <p className="text-xs mt-2 text-red-400/70">
          {(error as any)?.message || "لطفاً اتصال به سرور را بررسی کنید"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">سفارشات</h2>
          <p className="text-sm text-slate-400">
            {orders?.length || 0} سفارش ثبت‌شده
          </p>
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
                  مشتری
                </th>
                <th className="text-right py-4 px-5 font-medium hidden md:table-cell">
                  تعداد آیتم
                </th>
                <th className="text-right py-4 px-5 font-medium hidden md:table-cell">
                  مبلغ کل
                </th>
                <th className="text-right py-4 px-5 font-medium hidden lg:table-cell">
                  تاریخ
                </th>
                <th className="text-right py-4 px-4 sm:px-5 font-medium">
                  جزئیات
                </th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order, index) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 sm:px-5 text-slate-400 hidden sm:table-cell">
                    {index + 1}
                  </td>

                  {/* مشتری */}
                  <td className="py-4 px-4 sm:px-5">
                    <div>
                      <p className="font-medium text-white">
                        {order.userFirstname} {order.userLastname}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        @{order.userName}
                      </p>
                      {/* موبایل: مبلغ و تعداد زیر اسم */}
                      <div className="md:hidden mt-1 text-xs text-slate-400">
                        {order.items.length} آیتم •{" "}
                        {formatPrice(order.allPrice)}
                      </div>
                    </div>
                  </td>

                  {/* تعداد آیتم */}
                  <td className="py-4 px-5 hidden md:table-cell text-slate-300">
                    {order.items.length} محصول
                  </td>

                  {/* مبلغ کل */}
                  <td className="py-4 px-5 hidden md:table-cell text-white font-medium whitespace-nowrap">
                    {formatPrice(order.allPrice)}
                  </td>

                  {/* تاریخ */}
                  <td className="py-4 px-5 hidden lg:table-cell text-slate-300 text-xs">
                    {formatDate(order.date)}
                  </td>

                  {/* دکمه جزئیات */}
                  <td className="py-4 px-4 sm:px-5">
                    <button
                      onClick={() => setSelectedOrder(order)}
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

        {orders?.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            هیچ سفارشی یافت نشد
          </div>
        )}
      </div>

      {/* ========== Modal جزئیات سفارش ========== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
              <h3 className="font-bold text-white">
                جزئیات سفارش #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6">
              {/* اطلاعات مشتری */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-400">
                  اطلاعات مشتری
                </h4>
                <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">نام</span>
                    <span className="text-white">
                      {selectedOrder.userFirstname} {selectedOrder.userLastname}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">نام کاربری</span>
                    <span className="text-white">
                      @{selectedOrder.userName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> تلفن
                    </span>
                    <span className="text-white" dir="ltr">
                      {selectedOrder.phone}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                      <MapPin className="w-3.5 h-3.5" /> آدرس
                    </span>
                    <span className="text-white text-left">
                      {selectedOrder.address}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> تاریخ
                    </span>
                    <span className="text-white text-xs">
                      {formatDate(selectedOrder.date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* لیست محصولات */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  محصولات سفارش ({selectedOrder.items.length})
                </h4>

                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 bg-white/5 rounded-xl p-3"
                    >
                      <img
                        src={item.mainImage}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover bg-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.category}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                          <span>سایز: {item.size}</span>
                          <span className="flex items-center gap-1">
                            رنگ:
                            <span
                              className="w-3 h-3 rounded-full border border-white/20 inline-block"
                              style={{ backgroundColor: item.color }}
                            />
                          </span>
                          <span>× {item.quantity}</span>
                        </div>
                        <p className="text-indigo-400 text-sm font-medium mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* مبلغ کل */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-slate-400 font-medium">
                  مبلغ کل سفارش
                </span>
                <span className="text-lg font-bold text-white">
                  {formatPrice(selectedOrder.allPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
