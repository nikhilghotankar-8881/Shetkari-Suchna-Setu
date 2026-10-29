import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sprout, Bell, FileText, UserCheck, ShieldCheck } from "lucide-react";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: t("nav.home"), icon: Sprout },
    { to: "/farmer/dashboard", label: t("nav.alerts"), icon: Bell },
    { to: "/notices", label: t("nav.notices"), icon: FileText },
    { to: "/farmer/preferences", label: t("nav.profile"), icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-[4rem] sm:min-h-[4.5rem] py-2 flex items-center justify-between gap-3">
        {/* Logo / App Name */}
        <Link to="/" className="flex items-center gap-2.5 text-emerald-950 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-900 transition-colors">
            <Sprout size={22} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg tracking-tight leading-tight text-emerald-950">
              {t("app.name")}
            </span>
            <span className="text-[10px] sm:text-[11px] text-stone-500 hidden sm:inline-block leading-tight font-medium">
              {t("app.verifiedSubtitle")}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-stone-600">
          {navLinks.map((link) => {
            const isActive =
              link.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/60"
                    : "hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions: 3-Language Selector & Admin portal */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageSwitcher />

          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-900 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold transition-all shadow-2xs"
            title={t("nav.admin")}
            aria-label={t("nav.admin")}
          >
            <ShieldCheck size={15} className="text-emerald-700" />
            <span className="hidden md:inline">{t("nav.admin")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export const MobileBottomNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const links = [
    { to: "/", label: t("nav.home"), icon: Sprout },
    { to: "/farmer/dashboard", label: t("nav.alerts"), icon: Bell },
    { to: "/notices", label: t("nav.notices"), icon: FileText },
    { to: "/farmer/preferences", label: t("nav.profile"), icon: UserCheck },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-stone-200 shadow-lg">
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                isActive ? "text-emerald-900 font-bold" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Icon size={20} className={isActive ? "text-emerald-800" : "text-stone-400"} />
              <span className="truncate max-w-[76px] leading-none">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
