import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Crown } from "lucide-react";
import { getBestSellers } from "../../data";
import { ProductImage } from "../../features/images";
import { useImagePreloader } from "../../features/images";

const BestSellersSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const bestSellers = React.useMemo(() => getBestSellers(), []);

  const bestSellerImages = React.useMemo(
    () => bestSellers.slice(0, 8).map((product) => product.imageUrl),
    [bestSellers]
  );
  useImagePreloader(bestSellerImages, { priority: true });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = isMobile ? 160 + 12 : 192 + 8;
    scrollRef.current.scrollBy({
      left: isRtl
        ? direction === "left"
          ? cardWidth
          : -cardWidth
        : direction === "left"
        ? -cardWidth
        : cardWidth,
      behavior: "smooth",
    });
  };

  const prevDirection = isRtl ? "right" : "left";
  const nextDirection = isRtl ? "left" : "right";

  return (
    <section className="py-3 sm:py-12">
      <div className="container-custom px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-purple-800 leading-tight">
            {t("home.bestSellers.title")}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base max-w-xs sm:max-w-md md:max-w-lg mx-auto leading-relaxed">
            {isRtl
              ? "اكتشف أكثر منتجاتنا مبيعًا وشعبية."
              : "Discover our most popular and best-selling products."}
          </p>
        </div>

        <div className="relative">
          {!isMobile && (
            <>
              <button
                onClick={() => scroll(prevDirection)}
                className="hidden md:flex items-center justify-center absolute top-[40%] -translate-y-1/2 bg-white/90 text-stone-600 rounded-full w-9 h-9 shadow ring-1 ring-stone-200 z-10 -left-8"
                aria-label={t("common.scrollLeft")}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll(nextDirection)}
                className="hidden md:flex items-center justify-center absolute top-[40%] -translate-y-1/2 bg-white/90 text-stone-600 rounded-full w-9 h-9 shadow ring-1 ring-stone-200 z-10 -right-8"
                aria-label={t("common.scrollRight")}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-x-3 pb-4 snap-x snap-mandatory scroll-smooth touch-pan-x"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: isMobile ? "none" : "thin",
              scrollbarColor: isMobile ? "transparent" : "#8A2BE2 transparent",
            }}
          >
            {bestSellers.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-56 sm:w-56 md:w-60 snap-center touch-manipulation"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-md transition-all duration-300 overflow-hidden group w-56 h-56 sm:w-56 sm:h-56 md:w-60 md:h-60 flex flex-col">
                    <div className="relative aspect-square overflow-hidden rounded-t-3xl bg-gradient-to-br from-purple-50 to-gray-50">
                      <ProductImage
                        src={product.imageUrl}
                        alt={
                          i18n.language === "ar"
                            ? product.nameAr
                            : product.nameEn
                        }
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={224}
                        height={224}
                        aspectRatio="square"
                        sizes="(max-width: 767px) 224px, 240px"
                        quality={100}
                        priority={index < 3}
                        showZoom={false}
                        placeholderSize={28}
                        fallbackSrc="https://images.pexels.com/photos/1058775/pexels-photo-1058775.jpeg?auto=compress&cs=tinysrgb&w=400"
                      />

                      <div className="absolute top-2 left-2 rtl:right-2 rtl:left-auto z-10">
                        <div className="bg-blue-600 text-white text-xs font-semibold py-1 px-2 rounded-full flex items-center gap-1 shadow-sm">
                          <Crown size={12} />
                          {t("home.bestSellers.bestSeller")}
                        </div>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-between">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {i18n.language === "ar"
                          ? product.nameAr
                          : product.nameEn}
                      </h3>
                      <p className="text-base font-semibold text-purple-900">
                        {product.price} {isRtl ? "ر.س" : "SAR"}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(BestSellersSection);
