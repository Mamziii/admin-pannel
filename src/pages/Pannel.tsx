import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  TrendingUp,
  ShoppingCart,
  PlusCircle,
  Menu,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export const menuItems = [
  { name: "لیست کاربران", route: "/pannel/users-list", icon: Users },
  { name: "لیست محصولات", route: "/pannel/products-list", icon: Package },
  { name: "میزان فروش", route: "/pannel/sales", icon: TrendingUp },
  { name: "سفارشات", route: "/pannel/orders", icon: ShoppingCart },
  { name: "افزودن محصول جدید", route: "/pannel/add-product", icon: PlusCircle },
];

export default function Pannel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex">
      {/* ========== Mobile Overlay ========== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ========== Sidebar ========== */}
      <aside
        className={`
          fixed lg:static inset-y-0 right-0 z-50
          w-72 bg-white/5 backdrop-blur-xl border-l border-white/10
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-bold text-lg">پنل مدیریت</h1>
            <p className="text-xs text-slate-400">Admin Dashboard</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.route}
              to={item.route}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout / Footer */}
        <div className="px-4 py-5 border-t border-white/10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>خروج از پنل</span>
          </button>
        </div>
      </aside>

      {/* ========== Main Content ========== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar (Mobile) */}
        <header className="lg:hidden sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">پنل مدیریت</span>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}