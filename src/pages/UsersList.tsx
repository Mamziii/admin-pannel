import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { Loader2, Users, Shield, User as UserIcon } from "lucide-react";

type GenderFilter = "all" | "male" | "female";

export default function UsersList() {
  const { data: users, isLoading, isError, error } = useUsers();
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");

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
          <button
            onClick={() => setGenderFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              genderFilter === "all"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            همه
          </button>
          <button
            onClick={() => setGenderFilter("male")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              genderFilter === "male"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            مرد
          </button>
          <button
            onClick={() => setGenderFilter("female")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              genderFilter === "female"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            زن
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="text-right py-4 px-5 font-medium">#</th>
                <th className="text-right py-4 px-5 font-medium">نام کامل</th>
                <th className="text-right py-4 px-5 font-medium">نام کاربری</th>
                <th className="text-right py-4 px-5 font-medium">ایمیل</th>
                <th className="text-right py-4 px-5 font-medium">جنسیت</th>
                <th className="text-right py-4 px-5 font-medium">نقش</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-5 text-slate-400">{index + 1}</td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <span className="font-medium text-white">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-slate-300">@{user.username}</td>
                  <td className="py-4 px-5 text-slate-300">{user.email}</td>
                  <td className="py-4 px-5">
                    <span className="text-slate-300">
                      {user.gender === "male" ? "مرد" : "زن"}
                    </span>
                  </td>
                  <td className="py-4 px-5">
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
    </div>
  );
}