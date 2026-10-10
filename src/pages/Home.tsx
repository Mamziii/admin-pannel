import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4 sm:p-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 sm:-top-40 sm:-right-40 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 sm:-bottom-40 sm:-left-40 w-72 h-72 sm:w-96 sm:h-96 bg-violet-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md sm:max-w-lg">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 text-center">
          {/* Logo / Icon */}
          <div className="mx-auto mb-6 sm:mb-8 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.8} />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
            پنل مدیریت
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 sm:mb-10 px-1">
            به داشبورد مدیریت خوش آمدید.
            <br />
            برای ورود به پنل روی دکمه زیر کلیک کنید.
          </p>

          {/* CTA Button */}
          <Link
            to="/pannel"
            className="group relative inline-flex items-center justify-center gap-2 w-full py-3.5 sm:py-4 px-6 sm:px-8
                       bg-gradient-to-r from-indigo-500 to-violet-600
                       hover:from-indigo-400 hover:to-violet-500
                       text-white font-semibold text-sm sm:text-base rounded-xl sm:rounded-2xl
                       shadow-lg shadow-indigo-500/30
                       transition-all duration-300
                       hover:shadow-indigo-500/50 hover:scale-[1.02]
                       active:scale-[0.98]"
          >
            <span>ورود به پنل</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Footer text */}
          <p className="mt-6 sm:mt-8 text-xs text-slate-500 leading-relaxed">
            ساخته شده توسط محمدرضا کاویانی
            <br />
            گیتهاب :{" "}
            <a
              href="https://github.com/Mamziii"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
            >
              Mamziii
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}