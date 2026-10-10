import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import {
  Loader2,
  Users,
  Shield,
  User as UserIcon,
  X,
  Eye,
} from "lucide-react";
import type { User } from "../types";

type GenderFilter = "all" | "male" | "female";

export default function UsersList() {
  const { data: users, isLoading, isError, error } = useUsers();
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users?.filter((user) => {
    if (genderFilter === "all") return true;
    return user.gender === genderFilter;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm">در حال دریافت کاربران...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl p-6 text-center">
        خطا در دریافت اطلاعات کاربران
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
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">لیست کاربران</h2>
            <p className="text-sm text-slate-400">
              {filteredUsers?.length || 0} کاربر
              {genderFilter !== "all" && (
                <span className="text-slate-500">
                  {" "}
                  از {users?.length || 0} کاربر
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
          {(["all", "male", "female"] as GenderFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setGenderFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                genderFilter === filter
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {filter === "all" ? "همه" : filter === "male" ? "مرد" : "زن"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="text-right py-4 px-4 sm:px-5 font-medium">#</th>
                <th className="text-right py-4 px-4 sm:px-5 font-medium">نام کامل</th>
                <th className="text-right py-4 px-4 sm:px-5 font-medium">نام کاربری</th>
                <th className="text-right py-4 px-5 font-medium hidden md:table-cell">ایمیل</th>
                <th className="text-right py-4 px-5 font-medium hidden md:table-cell">جنسیت</th>
                <th className="text-right py-4 px-5 font-medium hidden md:table-cell">نقش</th>
                <th className="text-right py-4 px-4 font-medium md:hidden">جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 sm:px-5 text-slate-400">{index + 1}</td>

                  {/* نام کامل */}
                  <td className="py-4 px-4 sm:px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <span className="font-medium text-white">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>

                  {/* نام کاربری */}
                  <td className="py-4 px-4 sm:px-5 text-slate-300">
                    @{user.username}
                  </td>

                  {/* ایمیل - فقط دسکتاپ */}
                  <td className="py-4 px-5 text-slate-300 hidden md:table-cell">
                    {user.email}
                  </td>

                  {/* جنسیت - فقط دسکتاپ */}
                  <td className="py-4 px-5 hidden md:table-cell">
                    <span className="text-slate-300">
                      {user.gender === "male" ? "مرد" : "زن"}
                    </span>
                  </td>

                  {/* نقش - فقط دسکتاپ */}
                  <td className="py-4 px-5 hidden md:table-cell">
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-medium">
                        <Shield className="w-3.5 h-3.5" />
                        ادمین
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-500/20 text-slate-300 text-xs font-medium">
                        <UserIcon className="w-3.5 h-3.5" />
                        کاربر
                      </span>
                    )}
                  </td>

                  {/* دکمه جزئیات - فقط موبایل */}
                  <td className="py-4 px-4 md:hidden">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers?.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            هیچ کاربری با این فیلتر یافت نشد
          </div>
        )}
      </div>

      {/* ========== Modal جزئیات کاربر ========== */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="font-bold text-white">جزئیات کاربر</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              {/* Avatar + Name */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-bold">
                  {selectedUser.firstName[0]}
                  {selectedUser.lastName[0]}
                </div>
                <div className="text-center">
                  <p className="font-bold text-white text-lg">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-slate-400 text-sm">@{selectedUser.username}</p>
                </div>
              </div>

              {/* Info List */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400">ایمیل</span>
                  <span className="text-white">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400">جنسیت</span>
                  <span className="text-white">
                    {selectedUser.gender === "male" ? "مرد" : "زن"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">نقش</span>
                  {selectedUser.role === "admin" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-medium">
                      <Shield className="w-3.5 h-3.5" />
                      ادمین
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-500/20 text-slate-300 text-xs font-medium">
                      <UserIcon className="w-3.5 h-3.5" />
                      کاربر
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}