import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

// الخطوة 1: استيراد أيقونات Heroicons الحديثة والبسيطة
import {
  HiOutlineHome,
  HiHome,
  HiOutlineSquares2X2,
  HiSquares2X2,
  HiOutlineBell,
  HiBell,
  HiOutlineHeart,
  HiHeart,
  HiOutlineArchiveBox,
  HiArchiveBox,
} from "react-icons/hi2";

const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { favoritesCount } = useFavorites();
  const { isAuthenticated } = useAuth();

  // الخطوة 2: تحديث مصفوفة الأيقونات لاستخدام أيقونات Heroicons
  const navItems = React.useMemo(
    () => [
      {
        id: "home",
        path: "/",
        icon: { outline: HiOutlineHome, filled: HiHome },
        labelKey: "bottomNav.home",
      },
      {
        id: "categories",
        path: "/categories",
        icon: { outline: HiOutlineSquares2X2, filled: HiSquares2X2 },
        labelKey: "bottomNav.categories",
      },
      {
        id: "notifications",
        path: "/notifications",
        icon: { outline: HiOutlineBell, filled: HiBell },
        labelKey: "bottomNav.notifications",
      },
      {
        id: "favorites",
        path: "/favorites",
        icon: { outline: HiOutlineHeart, filled: HiHeart },
        labelKey: "bottomNav.favorites",
        badge: favoritesCount,
      },
      {
        id: "packages",
        path: "/packages",
        icon: { outline: HiOutlineArchiveBox, filled: HiArchiveBox },
        labelKey: "bottomNav.packages",
      },
    ],
    [favoritesCount]
  );

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.04)] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-[65px] justify-around">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = active ? item.icon.filled : item.icon.outline;

          return (
            <Link
              key={item.id}
              to={item.path}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 pt-1 text-center"
            >
              {active && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute top-0 h-1 w-8 rounded-full bg-purple-800"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <motion.div className="relative" whileTap={{ scale: 0.9 }}>
                <Icon
                  // تم تعديل الحجم ليتناسب مع تصميم Heroicons
                  size={25}
                  className={`transition-colors ${
                    active ? "text-purple-800" : "text-gray-500"
                  }`}
                />

                {item.id === "notifications" && (
                  <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
                {item.id === "favorites" &&
                  typeof item.badge === "number" &&
                  isAuthenticated &&
                  item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
              </motion.div>

              <span
                className={`text-[11px] font-medium transition-colors ${
                  active ? "text-purple-800" : "text-gray-600"
                }`}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
