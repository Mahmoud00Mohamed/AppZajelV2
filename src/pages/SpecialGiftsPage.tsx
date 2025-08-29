import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Flame,
  Crown,
  Sparkles,
  Tag,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSpecialGifts } from "../data";
import { ProductImage } from "../features/images";
import FavoriteButton from "../components/ui/FavoriteButton";
import AddToCartButton from "../components/ui/AddToCartButton";

// Interface for Product type, adapted from original SpecialGiftsPage
interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  price: number;
  imageUrl: string;
  isSpecialGift: boolean;
  isBestSeller?: boolean;
  categoryId?: string;
  occasionId?: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

interface FilterState {
  priceRange: [number, number];
  features: string[];
  sortBy: string;
}

const SpecialGiftsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading] = useState(false); // Can be hooked to actual data fetching
  const [expandedFilters, setExpandedFilters] = useState<string[]>([
    "price",
    "features",
  ]);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Memoize the data source and apply the Product type
  const specialGiftsData: Product[] = useMemo(() => getSpecialGifts(), []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, Infinity],
    features: [],
    sortBy: "featured",
  });

  const quickFilterOptions = [
    {
      id: "bestseller",
      label: isRtl ? "الأكثر مبيعاً" : "Best Sellers",
      icon: <Flame size={12} />,
      color: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      id: "premium",
      label: isRtl ? "فاخر" : "Premium",
      icon: <Crown size={12} />,
      color: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      id: "affordable",
      label: isRtl ? "بأسعار معقولة" : "Affordable",
      icon: <Tag size={12} />,
      color: "bg-green-50 text-green-700 border-green-100",
    },
  ];

  const priceRanges = useMemo(
    () => [
      {
        id: "under-350",
        label: isRtl ? "أقل من 350 ر.س" : "Under 350 SAR",
        range: [0, 349] as [number, number],
        count: specialGiftsData.filter((p) => p.price < 350).length,
      },
      {
        id: "350-700",
        label: isRtl ? "350 ر.س إلى 700 ر.س" : "350 SAR to 700 SAR",
        range: [350, 700] as [number, number],
        count: specialGiftsData.filter((p) => p.price >= 350 && p.price <= 700)
          .length,
      },
      {
        id: "700-1000",
        label: isRtl ? "700 ر.س إلى 1000 ر.س" : "700 SAR to 1000 SAR",
        range: [701, 1000] as [number, number],
        count: specialGiftsData.filter((p) => p.price > 700 && p.price <= 1000)
          .length,
      },
      {
        id: "over-1000",
        label: isRtl ? "أكثر من 1000 ر.س" : "Over 1000 SAR",
        range: [1001, Infinity] as [number, number],
        count: specialGiftsData.filter((p) => p.price > 1000).length,
      },
    ],
    [isRtl, specialGiftsData]
  );

  const filteredProducts = useMemo(() => {
    let products = specialGiftsData;

    if (searchTerm) {
      products = products.filter((product) =>
        (isRtl ? product.nameAr : product.nameEn)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== Infinity) {
      products = products.filter(
        (product) =>
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1]
      );
    }

    const allFeatures = [...filters.features, ...quickFilters];
    if (allFeatures.length > 0) {
      products = products.filter((product) => {
        return allFeatures.every((feature) => {
          switch (feature) {
            case "bestseller":
              return product.isBestSeller;
            case "premium":
              return product.price > 300;
            case "affordable":
              return product.price <= 200;
            default:
              return true;
          }
        });
      });
    }

    return products.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return isRtl
            ? a.nameAr.localeCompare(b.nameAr)
            : a.nameEn.localeCompare(b.nameEn);
        default: // 'featured'
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      }
    });
  }, [searchTerm, filters, quickFilters, isRtl, specialGiftsData]);

  const filterOptions = {
    features: [
      {
        id: "bestseller",
        nameKey: isRtl ? "الأكثر مبيعاً" : "Best Seller",
        icon: <Sparkles size={14} />,
        count: specialGiftsData.filter((p) => p.isBestSeller).length,
      },
      {
        id: "premium",
        nameKey: isRtl ? "فاخر" : "Premium",
        icon: <Crown size={14} />,
        count: specialGiftsData.filter((p) => p.price > 300).length,
      },
      {
        id: "affordable",
        nameKey: isRtl ? "بأسعار معقولة" : "Affordable",
        icon: <Tag size={14} />,
        count: specialGiftsData.filter((p) => p.price <= 200).length,
      },
    ],
    sortOptions: [
      {
        value: "featured",
        label: isRtl ? "مميز" : "Featured",
      },
      {
        value: "price-low",
        label: isRtl ? "السعر: منخفض إلى مرتفع" : "Price: Low to High",
      },
      {
        value: "price-high",
        label: isRtl ? "السعر: مرتفع إلى منخفض" : "Price: High to Low",
      },
      {
        value: "name",
        label: isRtl ? "الاسم" : "Name",
      },
    ],
  };

  const updateFilter = (
    key: keyof FilterState,
    value: FilterState[keyof FilterState]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: "features", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const handlePriceRangeSelect = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, priceRange: [min, max] }));
  };

  const toggleQuickFilter = (filterId: string) => {
    setQuickFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const toggleFilterExpansion = (filterKey: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filterKey)
        ? prev.filter((key) => key !== filterKey)
        : [...prev, filterKey]
    );
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, Infinity],
      features: [],
      sortBy: "featured",
    });
    setQuickFilters([]);
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.features.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== Infinity ||
    searchTerm.length > 0 ||
    quickFilters.length > 0;

  const activeFiltersCount =
    filters.features.length +
    quickFilters.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== Infinity
      ? 1
      : 0) +
    (searchTerm.length > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 px-4 sm:px-6 lg:px-8 font-serif text-neutral-800">
      <div className="max-w-7xl mx-auto py-8 flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100">
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-purple-800 mb-3">
                <Search size={16} />
                {isRtl ? "البحث" : "Search"}
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  placeholder={isRtl ? "ابحث عن الهدايا..." : "Search gifts..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-purple-400 text-sm transition-all duration-300 bg-neutral-50 placeholder-neutral-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 border-b border-neutral-200 pb-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-purple-800">
                <SlidersHorizontal size={16} />
                {isRtl ? "فلاتر التصفية" : "Filters"}
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 transition-colors font-medium"
                >
                  <X size={12} />
                  {isRtl ? "مسح الكل" : "Clear"}
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <div className="mb-6 p-3 bg-purple-50 rounded-lg text-xs text-purple-700 font-bold border border-purple-100">
                {activeFiltersCount} {isRtl ? "فلتر نشط" : "active filters"} •{" "}
                {filteredProducts.length} {isRtl ? "نتيجة" : "results"}
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
                <button
                  onClick={() => toggleFilterExpansion("price")}
                  className="w-full flex items-center justify-between text-sm font-bold text-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign size={16} className="text-purple-600" />
                    {isRtl ? "نطاق السعر" : "Price Range"}
                  </span>
                  {expandedFilters.includes("price") ? (
                    <ChevronUp size={16} className="text-neutral-500" />
                  ) : (
                    <ChevronDown size={16} className="text-neutral-500" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFilters.includes("price") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3 overflow-hidden"
                    >
                      {priceRanges.map((rangeOption) => (
                        <label
                          key={rangeOption.id}
                          className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer hover:text-purple-600 transition-colors"
                        >
                          <input
                            type="radio"
                            name="priceRange"
                            checked={
                              filters.priceRange[0] === rangeOption.range[0] &&
                              filters.priceRange[1] === rangeOption.range[1]
                            }
                            onChange={() =>
                              handlePriceRangeSelect(
                                rangeOption.range[0],
                                rangeOption.range[1]
                              )
                            }
                            className="rounded-full border-neutral-300 text-purple-500 focus:ring-purple-500 w-4 h-4"
                          />
                          <span className="font-medium">
                            {rangeOption.label}
                          </span>
                          <span className="text-xs text-neutral-400 font-normal">
                            ({rangeOption.count})
                          </span>
                        </label>
                      ))}
                      <div className="text-xs text-neutral-600 font-medium pt-2 border-t border-neutral-100">
                        {isRtl ? "النطاق المحدد: " : "Selected Range: "}{" "}
                        {filters.priceRange[0]} {isRtl ? "ر.س" : "SAR"}{" "}
                        {isRtl ? "إلى" : "to"}{" "}
                        {filters.priceRange[1] === Infinity
                          ? isRtl
                            ? "أقصى"
                            : "Max"
                          : filters.priceRange[1]}{" "}
                        {isRtl ? "ر.س" : "SAR"}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
                <button
                  onClick={() => toggleFilterExpansion("features")}
                  className="w-full flex items-center justify-between text-sm font-bold text-neutral-800"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-600" />
                    {isRtl ? "المميزات" : "Features"}
                  </span>
                  {expandedFilters.includes("features") ? (
                    <ChevronUp size={16} className="text-neutral-500" />
                  ) : (
                    <ChevronDown size={16} className="text-neutral-500" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFilters.includes("features") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3 overflow-hidden"
                    >
                      {filterOptions.features.map((feature) => (
                        <label
                          key={feature.id}
                          className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer hover:text-purple-600 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={filters.features.includes(feature.id)}
                            onChange={() =>
                              toggleArrayFilter("features", feature.id)
                            }
                            className="rounded border-neutral-300 text-purple-500 focus:ring-purple-500 w-4 h-4"
                          />
                          <span className="font-medium">{feature.nameKey}</span>
                          <span className="text-xs text-neutral-400 font-normal">
                            ({feature.count})
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-neutral-100 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
              <div className="relative flex-1 w-full lg:hidden">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  placeholder={t("header.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-purple-400 text-sm bg-neutral-50 placeholder-neutral-400"
                />
              </div>

              {isMobile && (
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition-colors shadow-md"
                >
                  <Filter size={14} />
                  {isRtl ? "فلتر" : "Filter"}
                  {hasActiveFilters && (
                    <span className="bg-white text-purple-600 rounded-full w-4 h-4 text-xs flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              )}

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-sm text-neutral-700 font-medium">
                  <span className="font-bold text-purple-600">
                    {filteredProducts.length}
                  </span>{" "}
                  {isRtl ? "هدية" : "gifts"}
                </div>
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter("sortBy", e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-purple-400 text-sm bg-neutral-50 cursor-pointer font-medium"
                  >
                    {filterOptions.sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>
                <div className="flex bg-neutral-100 rounded-lg p-1 shadow-inner">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white text-purple-600 shadow-sm"
                        : "text-neutral-500 hover:bg-neutral-200"
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white text-purple-600 shadow-sm"
                        : "text-neutral-500 hover:bg-neutral-200"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {!isMobile && (
              <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hidden">
                {quickFilterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleQuickFilter(option.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                      quickFilters.includes(option.id)
                        ? option.color
                        : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pb-8">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center py-16"
                >
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent"></div>
                </motion.div>
              ) : filteredProducts.length > 0 ? (
                viewMode === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  >
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md border border-neutral-100 overflow-hidden relative group transition-transform duration-300"
                      >
                        <Link to={`/product/${product.id}`} className="block">
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <ProductImage
                              src={product.imageUrl}
                              alt={isRtl ? product.nameAr : product.nameEn}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              width={240}
                              height={180}
                              aspectRatio="landscape"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              quality={100}
                              priority={index < 8}
                              showZoom={false}
                              placeholderSize={28}
                            />
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              {product.isBestSeller && (
                                <span className="bg-amber-100 text-amber-800 text-xs font-bold py-0.5 px-1.5 rounded-full flex items-center gap-1 shadow-sm">
                                  <Flame size={10} />
                                  {isRtl ? "الأكثر مبيعاً" : "Best Seller"}
                                </span>
                              )}
                              {product.isSpecialGift && (
                                <span className="bg-purple-100 text-purple-800 text-xs font-bold py-0.5 px-1.5 rounded-full flex items-center gap-1 shadow-sm">
                                  <Sparkles size={10} />
                                  {isRtl ? "مميز" : "Special"}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                        <div className="p-3 relative">
                          <div className="absolute top-0 right-3 transform -translate-y-1/2">
                            <FavoriteButton
                              product={product}
                              className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-rose-500 border border-neutral-100 transition-all duration-300 hover:scale-110"
                              size={16}
                            />
                          </div>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="text-sm font-bold text-neutral-800 hover:text-purple-600 transition-colors line-clamp-2 mb-1 min-h-[2.5rem]">
                              {isRtl ? product.nameAr : product.nameEn}
                            </h3>
                          </Link>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-base font-bold text-purple-700">
                              {product.price} {isRtl ? "ر.س" : "SAR"}
                            </p>
                            <AddToCartButton
                              product={product}
                              variant="primary"
                              size="sm"
                              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg shadow-md text-xs font-semibold hover:bg-purple-700 transition-colors"
                              showLabel={!isMobile}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md border border-neutral-100 p-4 flex flex-col sm:flex-row gap-4 items-start transition-transform duration-300"
                      >
                        <Link
                          to={`/product/${product.id}`}
                          className="flex-shrink-0 w-28 h-28"
                        >
                          <ProductImage
                            src={product.imageUrl}
                            alt={isRtl ? product.nameAr : product.nameEn}
                            className="w-full h-full object-cover rounded-lg shadow-sm"
                            width={112}
                            height={112}
                            aspectRatio="square"
                            sizes="112px"
                            quality={100}
                            priority={index < 4}
                            showZoom={false}
                          />
                        </Link>
                        <div className="flex-1 flex flex-col justify-between w-full">
                          <div>
                            <Link to={`/product/${product.id}`}>
                              <h3 className="text-base font-bold text-neutral-800 hover:text-purple-600 transition-colors mb-1">
                                {isRtl ? product.nameAr : product.nameEn}
                              </h3>
                            </Link>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {product.isBestSeller && (
                                <span className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded-full font-semibold">
                                  {isRtl ? "الأكثر مبيعاً" : "Best Seller"}
                                </span>
                              )}
                              {product.isSpecialGift && (
                                <span className="bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded-full font-semibold">
                                  {isRtl ? "مميز" : "Special"}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-neutral-600 line-clamp-2">
                              {isRtl
                                ? product.descriptionAr
                                : product.descriptionEn}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-lg font-bold text-purple-700">
                              {product.price} {isRtl ? "ر.س" : "SAR"}
                            </p>
                            <AddToCartButton
                              product={product}
                              variant="primary"
                              size="sm"
                              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg shadow-md text-xs font-semibold hover:bg-purple-700 transition-colors"
                              showLabel={true}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="no-products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white rounded-xl shadow-md border border-neutral-100"
                >
                  <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <Search size={32} className="text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800 mb-2">
                    {isRtl ? "لا توجد هدايا" : "No Gifts Found"}
                  </h3>
                  <p className="text-neutral-600 mb-6 text-sm max-w-sm mx-auto font-medium">
                    {isRtl
                      ? "لا توجد هدايا تطابق معايير البحث. جرب تعديل الفلاتر أو مسحها."
                      : "No gifts match your search criteria. Try adjusting or clearing filters."}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2 mx-auto text-sm font-bold shadow-md"
                  >
                    <X size={14} />
                    {isRtl ? "مسح الفلاتر" : "Clear Filters"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              className={`fixed inset-y-0 ${
                isRtl ? "right-0" : "left-0"
              } w-11/12 sm:w-80 bg-white shadow-2xl overflow-y-auto p-6 rounded-l-2xl lg:rounded-none transition-transform duration-300 ease-out`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 border-b border-neutral-200 pb-3">
                <h3 className="flex items-center gap-2 text-lg font-bold text-purple-800">
                  <Filter size={18} />
                  {isRtl ? "فلاتر البحث" : "Search Filters"}
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-800 mb-3">
                    <Sparkles size={16} className="text-purple-600" />
                    {isRtl ? "فلاتر سريعة" : "Quick Filters"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {quickFilterOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => toggleQuickFilter(option.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          quickFilters.includes(option.id)
                            ? option.color
                            : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                        }`}
                      >
                        {option.icon}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-800 mb-3">
                    <DollarSign size={16} className="text-purple-600" />
                    {isRtl ? "نطاق السعر" : "Price Range"}
                  </h4>
                  <div className="space-y-3">
                    {priceRanges.map((rangeOption) => (
                      <label
                        key={rangeOption.id}
                        className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer hover:text-purple-600 transition-colors"
                      >
                        <input
                          type="radio"
                          name="priceRange"
                          checked={
                            filters.priceRange[0] === rangeOption.range[0] &&
                            filters.priceRange[1] === rangeOption.range[1]
                          }
                          onChange={() =>
                            handlePriceRangeSelect(
                              rangeOption.range[0],
                              rangeOption.range[1]
                            )
                          }
                          className="rounded-full border-neutral-300 text-purple-500 focus:ring-purple-500 w-4 h-4"
                        />
                        <span className="font-medium">{rangeOption.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-800 mb-3">
                    <Sparkles size={16} className="text-purple-600" />
                    {isRtl ? "المميزات" : "Features"}
                  </h4>
                  <div className="space-y-3">
                    {filterOptions.features.map((feature) => (
                      <label
                        key={feature.id}
                        className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer hover:text-purple-600 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature.id)}
                          onChange={() =>
                            toggleArrayFilter("features", feature.id)
                          }
                          className="rounded border-neutral-300 text-purple-500 focus:ring-purple-500 w-4 h-4"
                        />
                        <span className="font-medium">{feature.nameKey}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-neutral-200 space-y-3">
                <div className="text-sm text-neutral-600 text-center font-medium">
                  {filteredProducts.length}{" "}
                  {isRtl ? "هدية موجودة" : "gifts found"}
                </div>
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-3 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
                >
                  <X size={16} />
                  {isRtl ? "مسح الفلاتر" : "Clear Filters"}
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-bold text-sm shadow-md"
                >
                  <CheckCircle size={16} />
                  {isRtl ? "تطبيق الفلاتر" : "Apply Filters"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialGiftsPage;
