import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  Shield,
  Truck,
  RotateCcw,
  Award,
  CheckCircle,
  Clock,
  Package,
  Gift,
  Crown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Phone,
  Mail,
  ZoomIn,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { allProducts, getProductById } from "../data";
import { ProductImage } from "../features/images";
import {
  usePreloadCriticalImages,
  useImagePreloader,
} from "../features/images";
import FavoriteButton from "../components/ui/FavoriteButton";
import AddToCartButton from "../components/ui/AddToCartButton";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showImageZoomModal, setShowImageZoomModal] = useState(false);

  const product = getProductById(parseInt(id || "0"));

  const productImages = [
    product?.imageUrl || "",
    product?.imageUrl || "",
    product?.imageUrl || "",
    product?.imageUrl || "",
  ].filter(Boolean);

  usePreloadCriticalImages(productImages);

  const relatedProducts = React.useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.categoryId === product.categoryId ||
            p.occasionId === product.occasionId)
      )
      .slice(0, 8);
  }, [product]);

  const relatedImages = React.useMemo(
    () => relatedProducts.slice(0, 6).map((p) => p.imageUrl),
    [relatedProducts]
  );
  useImagePreloader(relatedImages, { priority: false });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const header = document.querySelector("header");
    const handleResize = () => {
      if (window.innerWidth < 768) {
        if (header) header.style.display = "none";
      } else {
        if (header) header.style.display = "block";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (header) header.style.display = "block";
    };
  }, []);

  // New useEffect for automatic image cycling on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && productImages.length > 1) {
      const interval = setInterval(() => {
        setSelectedImageIndex((prevIndex) =>
          prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change image every 5 seconds
      return () => clearInterval(interval);
    }
  }, [productImages.length]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 px-4 sm:px-6 lg:px-8 font-serif text-neutral-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-auto border border-neutral-100"
        >
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Gift size={32} className="text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-neutral-800">
            {t("product.notFound")}
          </h1>
          <p className="text-neutral-600 mb-6 text-sm font-medium">
            {isRtl
              ? "عذراً، المنتج المطلوب غير متوفر."
              : "Sorry, the requested product is not available."}
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto text-sm font-bold shadow-md"
          >
            {t("product.backToHome")}
          </Link>
        </motion.div>
      </div>
    );
  }

  const features = [
    {
      icon: <Truck size={20} className="text-purple-600" />,
      title: isRtl ? "توصيل سريع" : "Fast Delivery",
      description: isRtl ? "خلال 24-48 ساعة" : "Within 24-48 hours",
    },
    {
      icon: <Shield size={20} className="text-purple-600" />,
      title: isRtl ? "ضمان الجودة" : "Quality Guarantee",
      description: isRtl ? "منتجات أصلية 100%" : "100% Authentic Products",
    },
    {
      icon: <RotateCcw size={20} className="text-purple-600" />,
      title: isRtl ? "إرجاع مجاني" : "Free Returns",
      description: isRtl ? "خلال 7 أيام" : "Within 7 days",
    },
    {
      icon: <Award size={20} className="text-purple-600" />,
      title: isRtl ? "خدمة مميزة" : "Premium Service",
      description: isRtl ? "دعم على مدار الساعة" : "24/7 Support",
    },
  ];

  const tabs = [
    {
      id: "description",
      label: isRtl ? "الوصف" : "Description",
      icon: <MessageCircle size={16} className="text-purple-600" />,
    },
    {
      id: "shipping",
      label: isRtl ? "الشحن" : "Shipping",
      icon: <Truck size={16} className="text-purple-600" />,
    },
  ];

  const getCategoryName = (categoryId: string) => {
    const camelCaseId = categoryId.replace(/-([a-z])/g, (g) =>
      g[1].toUpperCase()
    );
    return t(`home.categories.items.${camelCaseId}`);
  };

  const shareProduct = () => setShowShareModal(true);
  const copyToClipboard = () =>
    navigator.clipboard.writeText(window.location.href);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 font-serif text-neutral-800">
      <div className="max-w-7xl mx-auto md:py-8">
        <div className="md:hidden fixed top-2 left-2 rtl:right-2 rtl:left-auto z-50">
          <Link
            to="/"
            className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-all"
          >
            {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Link>
        </div>
        <div className="hidden md:block px-4 sm:px-6 lg:px-8 mb-6">
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-neutral-600 bg-white rounded-lg p-3 shadow-sm border border-neutral-100"
          >
            <Link to="/" className="hover:text-purple-600 transition-colors">
              {isRtl ? "الرئيسية" : "Home"}
            </Link>
            <span>/</span>
            <Link
              to="/categories"
              className="hover:text-purple-600 transition-colors"
            >
              {isRtl ? "الفئات" : "Categories"}
            </Link>
            <span>/</span>
            <Link
              to={`/category/${product.categoryId}`}
              className="hover:text-purple-600 transition-colors"
            >
              {getCategoryName(product.categoryId)}
            </Link>
            <span>/</span>
            <span className="text-neutral-800 font-medium truncate">
              {isRtl ? product.nameAr : product.nameEn}
            </span>
          </motion.nav>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="md:sticky md:top-6 flex flex-col md:flex-row-reverse gap-4 px-0 md:px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-b-2xl md:rounded-2xl shadow-lg border-b border-l border-r border-neutral-100 md:border overflow-hidden flex-1">
                <div className="relative aspect-square w-full">
                  <ProductImage
                    src={productImages[selectedImageIndex]}
                    alt={isRtl ? product.nameAr : product.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={600}
                    height={600}
                    aspectRatio="square"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={100}
                    priority={true}
                    showZoom={false}
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isBestSeller && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold py-0.5 px-1.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Crown size={10} />
                        {t("home.bestSellers.bestSeller")}
                      </span>
                    )}
                    {product.isSpecialGift && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-bold py-0.5 px-1.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles size={10} />
                        {t("home.featuredCollections.specialGift")}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <FavoriteButton
                      product={product}
                      className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-rose-500 border border-neutral-100 transition-all duration-300 hover:scale-110"
                      size={16}
                    />
                    <button
                      onClick={shareProduct}
                      className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-neutral-700 hover:text-purple-600 border border-neutral-100 transition-all duration-300 hover:scale-110"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={() => setShowImageZoomModal(true)}
                      className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-neutral-700 hover:text-purple-600 border border-neutral-100 transition-all duration-300 hover:scale-110"
                      aria-label={isRtl ? "تكبير الصورة" : "Zoom Image"}
                    >
                      <ZoomIn size={16} />
                    </button>
                  </div>
                  {/* <div className="hidden md:block"> part, which is what we need to remove */}
                  {/* We just need to make sure the mobile buttons are not present */}
                  {productImages.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                      {productImages.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            selectedImageIndex === index
                              ? "bg-purple-600 w-5"
                              : "bg-neutral-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-3 bg-neutral-50 md:hidden">
                  <div className="flex gap-2 justify-center">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-purple-600 shadow-sm"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <ProductImage
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          width={56}
                          height={56}
                          aspectRatio="square"
                          sizes="56px"
                          quality={100}
                          priority={false}
                          showZoom={false}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex flex-col gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-purple-600 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <ProductImage
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={80}
                        height={80}
                        aspectRatio="square"
                        sizes="80px"
                        quality={100}
                        priority={false}
                        showZoom={false}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5 px-4 sm:px-6 lg:px-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-neutral-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-800 mb-1.5 leading-tight">
                    {isRtl ? product.nameAr : product.nameEn}
                  </h1>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                    <span>{isRtl ? "كود المنتج:" : "Product ID:"}</span>
                    <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded">
                      #{product.id}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 mb-5 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-purple-700 mb-1">
                      {product.price} {isRtl ? "ر.س" : "SAR"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-green-100 text-green-800 text-xs font-medium py-0.5 px-1.5 rounded-full">
                        {isRtl ? "شامل الضريبة" : "Tax Included"}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium py-0.5 px-1.5 rounded-full">
                        {isRtl ? "توصيل مجاني" : "Free Shipping"}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-neutral-600 mb-1">
                      {isRtl ? "توفير" : "Save"}
                    </div>
                    <div className="text-base font-bold text-green-600">
                      {Math.round(product.price * 0.15)} {isRtl ? "ر.س" : "SAR"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <div className="bg-neutral-50 rounded-lg p-2.5 text-center border border-neutral-100">
                  <CheckCircle
                    size={14}
                    className="text-purple-600 mx-auto mb-1"
                  />
                  <div className="text-xs font-medium text-neutral-700">
                    {isRtl ? "متوفر" : "In Stock"}
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-2.5 text-center border border-neutral-100">
                  <Clock size={14} className="text-purple-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-neutral-700">
                    {isRtl ? "توصيل سريع" : "Fast Delivery"}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-neutral-100 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-base font-bold text-neutral-800 mb-2.5">
                  <Package size={16} className="text-purple-600" />
                  {isRtl ? "الكمية" : "Quantity"}
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-neutral-100 rounded-lg border border-neutral-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-l-lg hover:bg-neutral-200 flex items-center justify-center transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-bold text-base bg-white h-9 flex items-center justify-center border-x border-neutral-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-r-lg hover:bg-neutral-200 flex items-center justify-center transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <AddToCartButton
                  product={product}
                  quantity={quantity}
                  size="md"
                  className="flex-1 h-10 bg-purple-600 text-white rounded-lg shadow-md text-sm font-bold hover:bg-purple-700 transition-colors"
                />
                <button className="h-10 px-5 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors flex items-center justify-center gap-1.5 text-sm font-bold shadow-md">
                  <ShoppingCart size={16} />
                  {isRtl ? "اشتري الآن" : "Buy Now"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-3 shadow-sm border border-neutral-100 transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div>
                      <div className="font-bold text-neutral-800 text-xs">
                        {feature.title}
                      </div>
                      <div className="text-xs text-neutral-600">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="mt-8 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden"
          >
            <div className="border-b border-neutral-200 bg-neutral-50">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-3 font-bold transition-all flex items-center justify-center gap-1.5 relative text-sm ${
                      activeTab === tab.id
                        ? "text-purple-600 bg-white"
                        : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layout
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-3"
                  >
                    <h3 className="text-lg font-bold text-neutral-800 mb-3">
                      {t("product.description")}
                    </h3>
                    <div className="prose max-w-none">
                      <p className="text-neutral-600 leading-relaxed text-sm">
                        {showFullDescription
                          ? isRtl
                            ? product.descriptionAr
                            : product.descriptionEn
                          : `${(isRtl
                              ? product.descriptionAr
                              : product.descriptionEn
                            )?.substring(0, 150)}...`}
                      </p>
                      <button
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                        className="text-purple-600 hover:text-purple-700 font-bold mt-1.5 text-xs flex items-center gap-1"
                      >
                        {showFullDescription
                          ? isRtl
                            ? "عرض أقل"
                            : "Show less"
                          : isRtl
                          ? "عرض المزيد"
                          : "Show more"}
                        {isRtl ? (
                          <ArrowLeft size={12} />
                        ) : (
                          <ArrowRight size={12} />
                        )}
                      </button>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 mt-5 border border-purple-100">
                      <h4 className="font-bold text-neutral-800 mb-2.5 flex items-center gap-1.5 text-sm">
                        <CheckCircle size={14} className="text-purple-600" />
                        {isRtl ? "المميزات الرئيسية" : "Key Features"}
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        {[
                          isRtl
                            ? "جودة عالية مضمونة"
                            : "Premium quality guaranteed",
                          isRtl
                            ? "تصميم أنيق وعصري"
                            : "Elegant and modern design",
                          isRtl
                            ? "مناسب لجميع المناسبات"
                            : "Perfect for all occasions",
                          isRtl ? "تغليف فاخر مجاني" : "Free luxury packaging",
                        ].map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-1.5 text-neutral-700 text-xs"
                          >
                            <CheckCircle
                              size={11}
                              className="text-purple-600 flex-shrink-0"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
                {activeTab === "shipping" && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-5"
                  >
                    <h3 className="text-lg font-bold text-neutral-800 mb-3">
                      {isRtl ? "معلومات الشحن والتوصيل" : "Shipping & Delivery"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2.5 p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <Truck size={18} className="text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-neutral-800 mb-0.5 text-sm">
                              {isRtl ? "التوصيل السريع" : "Express Delivery"}
                            </h4>
                            <p className="text-xs text-neutral-600">
                              {isRtl
                                ? "توصيل في نفس اليوم للطلبات قبل الساعة 2 ظهراً"
                                : "Same-day delivery for orders before 2 PM"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <Shield
                            size={18}
                            className="text-purple-600 mt-0.5"
                          />
                          <div>
                            <h4 className="font-bold text-neutral-800 mb-0.5 text-sm">
                              {isRtl ? "التغليف الآمن" : "Secure Packaging"}
                            </h4>
                            <p className="text-xs text-neutral-600">
                              {isRtl
                                ? "نضمن وصول منتجاتك بحالة مثالية"
                                : "We guarantee your products arrive in perfect condition"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2.5 p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <Clock size={18} className="text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-neutral-800 mb-0.5 text-sm">
                              {isRtl ? "أوقات التوصيل" : "Delivery Times"}
                            </h4>
                            <p className="text-xs text-neutral-600">
                              {isRtl
                                ? "الرياض وجدة: 24 ساعة، المدن الأخرى: 2-3 أيام"
                                : "Riyadh & Jeddah: 24 hours, Other cities: 2-3 days"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <RotateCcw
                            size={18}
                            className="text-purple-600 mt-0.5"
                          />
                          <div>
                            <h4 className="font-bold text-neutral-800 mb-0.5 text-sm">
                              {isRtl ? "سياسة الإرجاع" : "Return Policy"}
                            </h4>
                            <p className="text-xs text-neutral-600">
                              {isRtl
                                ? "إمكانية الإرجاع خلال 7 أيام"
                                : "Returns accepted within 7 days"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        {relatedProducts.length > 0 && (
          <div className="mt-8 px-4 sm:px-6 lg:px-8 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-neutral-800 mb-1.5">
                  {t("product.relatedProducts")}
                </h2>
                <p className="text-neutral-600 text-sm">
                  {isRtl
                    ? "منتجات أخرى قد تعجبك"
                    : "Other products you might like"}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 8).map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    className="bg-white rounded-xl shadow-md border border-neutral-100 overflow-hidden relative group"
                  >
                    <Link
                      to={`/product/${relatedProduct.id}`}
                      className="block"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <ProductImage
                          src={relatedProduct.imageUrl}
                          alt={
                            isRtl
                              ? relatedProduct.nameAr
                              : relatedProduct.nameEn
                          }
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          width={300}
                          height={300}
                          aspectRatio="square"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          quality={100}
                          priority={false}
                          showZoom={false}
                          placeholderSize={24}
                          fallbackSrc="https://images.pexels.com/photos/1058775/pexels-photo-1058775.jpeg?auto=compress&cs=tinysrgb&w=400"
                        />
                        {relatedProduct.isBestSeller && (
                          <span className="absolute top-1.5 right-1.5 bg-amber-100 text-amber-800 text-xs font-bold py-0.5 px-1.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Flame size={10} />
                            {isRtl ? "الأكثر مبيعاً" : "Best"}
                          </span>
                        )}
                        <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <FavoriteButton
                            product={relatedProduct}
                            className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-rose-500 border border-neutral-100 transition-all duration-300 hover:scale-110"
                            size={16}
                          />
                        </div>
                      </div>
                    </Link>
                    <div className="p-3 relative">
                      <Link to={`/product/${relatedProduct.id}`}>
                        <h3 className="text-sm font-bold text-neutral-800 hover:text-purple-600 transition-colors line-clamp-2 mb-1 min-h-[2.5rem]">
                          {isRtl
                            ? relatedProduct.nameAr
                            : relatedProduct.nameEn}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-base font-bold text-purple-700">
                          {relatedProduct.price} {isRtl ? "ر.س" : "SAR"}
                        </p>
                        <AddToCartButton
                          product={relatedProduct}
                          variant="primary"
                          size="sm"
                          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg shadow-md text-xs font-semibold hover:bg-purple-700 transition-colors"
                          showLabel={false}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowShareModal(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-lg border border-neutral-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-neutral-800">
                    {isRtl ? "مشاركة المنتج" : "Share Product"}
                  </h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <button className="flex items-center gap-2 p-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <Facebook size={16} className="text-blue-600" />
                    <span className="text-blue-600 font-medium text-sm">
                      Facebook
                    </span>
                  </button>
                  <button className="flex items-center gap-2 p-2.5 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors">
                    <Twitter size={16} className="text-sky-600" />
                    <span className="text-sky-600 font-medium text-sm">
                      Twitter
                    </span>
                  </button>
                  <button className="flex items-center gap-2 p-2.5 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors">
                    <Instagram size={16} className="text-pink-600" />
                    <span className="text-pink-600 font-medium text-sm">
                      Instagram
                    </span>
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <Copy size={16} className="text-neutral-600" />
                    <span className="text-neutral-600 font-medium text-sm">
                      {isRtl ? "نسخ الرابط" : "Copy Link"}
                    </span>
                  </button>
                </div>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex items-center gap-2.5 text-sm text-neutral-600">
                    <MessageCircle size={14} />
                    <span>
                      {isRtl
                        ? "أو تواصل معنا مباشرة:"
                        : "Or contact us directly:"}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-green-600 text-xs">
                      <Phone size={12} />
                      {isRtl ? "اتصال" : "Call"}
                    </button>
                    <button className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 text-xs">
                      <Mail size={12} />
                      {isRtl ? "إيميل" : "Email"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showImageZoomModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4"
              onClick={() => setShowImageZoomModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-full w-full h-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowImageZoomModal(false)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 text-neutral-800 hover:bg-neutral-100 transition-colors z-10 shadow-md"
                  aria-label={isRtl ? "إغلاق" : "Close"}
                >
                  <X size={20} />
                </button>
                <ProductImage
                  src={productImages[selectedImageIndex]}
                  alt={isRtl ? product.nameAr : product.nameEn}
                  className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl mx-auto"
                  width={1200}
                  height={1200}
                  aspectRatio="auto"
                  sizes="100vw"
                  quality={100}
                  priority={true}
                  showZoom={false}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductPage;
