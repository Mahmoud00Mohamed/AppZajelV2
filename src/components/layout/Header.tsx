import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  ShoppingBasket,
  User,
  Menu,
  X,
  ChevronDown,
  Bell,
  Heart,
  Package,
  Star,
  ShieldCheck,
  Truck,
  Gift,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import i18n from "i18next";

import Logo from "../ui/Logo";

const Header = () => {
  const { t } = useTranslation();
  const { cartCount, syncCart } = useCart();
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const isRtl = i18n.language === "ar";

  // Sync cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      syncCart();
    }
  }, [isAuthenticated, syncCart]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-1.5">
        <div
          className={`container-custom flex items-center ${
            isRtl ? "justify-end flex-row-reverse" : "justify-start flex-row"
          } gap-6`}
        >
          <div className="flex items-center gap-6">
            {/* Fast Delivery */}
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-white" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                {i18n.language === "ar" ? "توصيل سريع" : "Fast Delivery"}
              </span>
            </div>

            {/* Luxury Gifts */}
            <div className="flex items-center gap-1.5">
              <Gift size={14} className="text-white" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                {i18n.language === "ar"
                  ? "ورود وهدايا فاخرة"
                  : "Luxury Flowers & Gifts"}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Main header */}
      <div className="container-custom py-3">
        <div className="flex items-center justify-between">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <Logo />
            </Link>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-grow max-w-xl mx-6 relative group">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t("header.search")}
                className="w-full bg-gray-50/80 border border-gray-200/60 py-3 px-5 pl-12 rounded-full text-gray-700 placeholder-gray-400 outline-none transition-all duration-500 focus:bg-white focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100/30 hover:bg-white/80 backdrop-blur-sm"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300">
                <Search size={18} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Language switcher */}
            <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 ml-2 shadow-sm">
              <button
                onClick={() => i18n.changeLanguage("ar")}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${
                  i18n.language === "ar"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => i18n.changeLanguage("en")}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${
                  i18n.language === "en"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                EN
              </button>
            </div>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="hidden md:flex items-center text-gray-600 hover:text-purple-600 transition-all relative group"
            >
              <div className="p-2 bg-gray-100 hover:bg-purple-100 rounded-full transition-colors">
                <Bell size={18} />
              </div>
              <span className="hidden lg:inline text-xs font-medium ml-1.5 rtl:mr-1.5 text-gray-700">
                {t("bottomNav.notifications")}
              </span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Link>

            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative hidden md:flex items-center text-gray-600 hover:text-purple-600 transition-all group"
            >
              <div className="p-2 bg-gray-100 hover:bg-pink-100 rounded-full transition-colors">
                <Heart size={18} />
              </div>
              <span className="hidden lg:inline text-xs font-medium ml-1.5 rtl:mr-1.5 text-gray-700">
                {t("bottomNav.favorites")}
              </span>
              {isAuthenticated && favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
              )}
            </Link>

            {/* Packages */}
            <Link
              to="/packages"
              className="hidden md:flex items-center text-gray-600 hover:text-purple-600 transition-all group"
            >
              <div className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors">
                <Package size={18} />
              </div>
              <span className="hidden lg:inline text-xs font-medium ml-1.5 rtl:mr-1.5 text-gray-700">
                {t("bottomNav.packages")}
              </span>
            </Link>

            {/* User / Login */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-gray-700 hover:text-purple-600 transition-all group"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold ml-2 rtl:mr-2 text-gray-800">
                    {user?.name}
                  </span>
                  {user && !user.isPhoneVerified && (
                    <ShieldCheck
                      size={14}
                      className="text-yellow-500 ml-1 rtl:mr-1"
                    />
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute top-full right-0 rtl:left-0 rtl:right-auto mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                    {user && !user.isPhoneVerified && (
                      <Link
                        to="/auth/phone-setup"
                        className="flex items-center px-4 py-2 text-sm text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors border-b border-yellow-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <ShieldCheck size={16} className="mr-2 rtl:ml-2" />
                        {isRtl ? "أكمل التحقق" : "Verify Phone"}
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} className="mr-2 rtl:ml-2" />
                      {t("header.profile")}
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Package size={16} className="mr-2 rtl:ml-2" />
                      {t("header.orders")}
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-2 rtl:ml-2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      {t("header.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="hidden sm:flex items-center text-gray-600 hover:text-purple-600 transition-all group"
              >
                <div className="p-2 bg-gray-100 hover:bg-purple-100 rounded-full transition-colors">
                  <User size={18} />
                </div>
                <span className="text-xs font-medium ml-1.5 rtl:mr-1.5 text-gray-700">
                  {t("header.login")}
                </span>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center text-gray-600 hover:text-purple-600 transition-all group"
            >
              <div className="p-2 bg-gray-100 hover:bg-purple-100 rounded-full transition-colors">
                <ShoppingBasket size={20} />
              </div>
              {isAuthenticated && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 rtl:-left-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold animate-bounce">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
              {!isAuthenticated && (
                <span className="absolute -top-1 -right-1 rtl:-left-1 w-3 h-3 bg-gray-400 rounded-full"></span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="mt-3 md:hidden relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t("header.search")}
              className="w-full bg-gray-50/80 border border-gray-200/60 py-3 px-5 pl-12 rounded-full text-gray-700 placeholder-gray-400 outline-none transition-all duration-500 focus:bg-white focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100/30 backdrop-blur-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-t border-gray-50">
        <div className="container-custom">
          <ul className="hidden md:flex items-center space-x-8 rtl:space-x-reverse py-3 text-gray-700">
            <li>
              <Link
                to="/categories"
                className={`flex items-center gap-1 text-sm font-semibold transition-colors group ${
                  location.pathname === "/categories"
                    ? "text-purple-600"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                {t("navigation.categories")}
                <ChevronDown
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            </li>
            <li>
              <Link
                to="/occasions"
                className={`flex items-center gap-1 text-sm font-semibold transition-colors group ${
                  location.pathname === "/occasions"
                    ? "text-purple-600"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                {t("navigation.occasions")}
                <ChevronDown
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            </li>
            <li>
              <Link
                to="/brands"
                className={`flex items-center gap-1 text-sm font-semibold transition-colors group ${
                  location.pathname === "/brands"
                    ? "text-purple-600"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                {t("navigation.brands")}
                <ChevronDown
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            </li>
            <li>
              <Link
                to="/special-gifts"
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === "/special-gifts"
                    ? "text-purple-600"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                {t("navigation.specialGifts")}
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === "/products"
                    ? "text-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                {i18n.language === "ar" ? "جميع المنتجات" : "All Products"}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 bg-black/20 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      >
        <div
          className={`fixed inset-y-0 ${
            isRtl ? "right-0" : "left-0"
          } w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen
              ? "translate-x-0"
              : isRtl
              ? "translate-x-full"
              : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <Logo small />
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-5">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/categories"
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl font-semibold text-sm transition-all"
                  onClick={toggleMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-purple-600"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  {t("navigation.categories")}
                </Link>
              </li>
              <li>
                <Link
                  to="/occasions"
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl font-semibold text-sm transition-all"
                  onClick={toggleMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-pink-600"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                  {t("navigation.occasions")}
                </Link>
              </li>
              <li>
                <Link
                  to="/brands"
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl font-semibold text-sm transition-all"
                  onClick={toggleMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-blue-600"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  {t("navigation.brands")}
                </Link>
              </li>
              <li>
                <Link
                  to="/special-gifts"
                  className="flex items-center gap-3 px-3 py-3 text-purple-600 bg-purple-50 rounded-xl font-bold text-sm transition-all"
                  onClick={toggleMenu}
                >
                  <Star size={20} className="text-purple-600 fill-current" />
                  {t("navigation.specialGifts")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all"
                  onClick={toggleMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-600"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  {i18n.language === "ar" ? "جميع المنتجات" : "All Products"}
                </Link>
              </li>

              <li className="pt-5 border-t border-gray-100">
                <Link
                  to="/notifications"
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all"
                  onClick={toggleMenu}
                >
                  <Bell size={18} />
                  {t("bottomNav.notifications")}
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold text-sm relative transition-all"
                  onClick={toggleMenu}
                >
                  <Heart size={18} />
                  {t("bottomNav.favorites")}
                  {isAuthenticated && favoritesCount > 0 && (
                    <span className="absolute right-3 rtl:left-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favoritesCount > 99 ? "99+" : favoritesCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all"
                  onClick={toggleMenu}
                >
                  <Package size={18} />
                  {t("bottomNav.packages")}
                </Link>
              </li>

              {!isAuthenticated ? (
                <li className="pt-5 border-t border-gray-100">
                  <Link
                    to="/auth/login"
                    className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all"
                    onClick={toggleMenu}
                  >
                    <User size={18} />
                    {t("header.login")}
                  </Link>
                </li>
              ) : (
                <>
                  <li className="pt-5 border-t border-gray-100">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all"
                      onClick={toggleMenu}
                    >
                      <User size={18} />
                      {user?.name || t("header.profile")}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full text-left px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-sm transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      {t("header.logout")}
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
