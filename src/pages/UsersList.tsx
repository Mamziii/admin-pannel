import { useState } from "react";
import { useUsers, useDeleteUser } from "../hooks/useUsers";
import {
  Loader2,
  Users,
  Shield,
  User as UserIcon,
  X,
  Eye,
  Trash2,
} from "lucide-react";
import type { User } from "../types";
import toast from "react-hot-toast";

type GenderFilter = "all" | "male" | "female";

export default function UsersList() {
  const { data: users, isLoading, isError, error } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = users?.filter((user) => {
    if (genderFilter === "all") return true;
    return user.gender === genderFilter;
  });

  const handleDelete = () => {
    if (!userToDelete) return;

    deleteUserMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        toast.success(
          `کاربر ${userToDelete.firstName} ${userToDelete.lastName} با موفقیت حذف شد`
        );
        setUserToDelete(null);
        if (selectedUser?.id === userToDelete.id) {
          setSelectedUser(null);
        }
      },
      onError: () => {
        toast.error("خطا در حذف کاربر. لطفاً دوباره تلاش کنید.");
      },
    });
  };

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
                <th className="text-right py-4 px-4 font-medium">عملیات</th>
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

                  {/* ایمیل */}
                  <td className="py-4 px-5 text-slate-300 hidden md:table-cell">
                    {user.email}
                  </td>

                  {/* جنسیت */}
                  <td className="py-4 px-5 hidden md:table-cell">
                    <span className="text-slate-300">
                      {user.gender === "male" ? "مرد" : "زن"}
                    </span>
                  </td>

                  {/* نقش */}
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

                  {/* عملیات */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {/* جزئیات - فقط موبایل */}
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors md:hidden"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* حذف - فقط تبلت و دسکتاپ */}
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors hidden md:inline-flex"
                        title="حذف کاربر"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="font-bold text-white">جزئیات کاربر</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
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

              {/* دکمه حذف فقط داخل مودال (برای موبایل) */}
              <button
                onClick={() => setUserToDelete(selectedUser)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                حذف این کاربر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Modal تأیید حذف ========== */}
      {userToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setUserToDelete(null)}
          />
          <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center space-y-5">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">حذف کاربر</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  آیا از حذف کاربر{" "}
                  <span className="text-white font-medium">
                    {userToDelete.firstName} {userToDelete.lastName}
                  </span>{" "}
                  مطمئن هستید؟
                  <br />
                  این عمل قابل بازگشت نیست.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setUserToDelete(null)}
                  disabled={deleteUserMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  انصراف
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteUserMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  {deleteUserMutation.isPending ? (
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