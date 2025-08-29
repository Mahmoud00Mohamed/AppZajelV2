import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";

interface AddToCartButtonProps {
  product: {
    id: number;
    nameEn: string;
    nameAr: string;
    price: number;
    imageUrl: string;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "icon";
  showLabel?: boolean;
  quantity?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  className = "",
  size = "md",
  variant = "primary",
  showLabel = true,
  quantity = 1,
}) => {
  const { addToCart } = useCart();
  const { showSuccess } = useToast();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-white text-primary border border-primary hover:bg-primary/5",
    icon: "p-2 bg-primary text-white hover:bg-primary-dark rounded-full",
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || justAdded) return;

    setIsAdding(true);

    try {
      addToCart({
        id: product.id,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity,
      });

      setJustAdded(true);

      // تم حذف كائن الـ action من هنا
      showSuccess(
        isRtl ? "تم الإضافة للسلة" : "Added to Cart",
        isRtl
          ? `تم إضافة ${product.nameAr} إلى عربة التسوق`
          : `${product.nameEn} added to cart`,
        undefined, // <- تم حذف الزر
        "cart-success"
      );

      setTimeout(() => {
        setJustAdded(false);
        setIsAdding(false);
      }, 2000);
    } catch (error) {
      console.error("خطأ في إضافة المنتج إلى عربة التسوق:", error);
      setIsAdding(false);

      if (showSuccess) {
        showSuccess(
          isRtl ? "خطأ" : "Error",
          isRtl ? "حدث خطأ أثناء إضافة المنتج" : "Error adding product to cart"
        );
      }
    }
  };

  const getButtonContent = () => {
    if (justAdded) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2"
        >
          <Check size={variant === "icon" ? 18 : 16} />
          {showLabel && variant !== "icon" && (
            <span>{isRtl ? "تم الإضافة" : "Added!"}</span>
          )}
        </motion.div>
      );
    }

    if (isAdding) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-2"
        >
          <ShoppingCart size={variant === "icon" ? 18 : 16} />
          {showLabel && variant !== "icon" && (
            <span>{isRtl ? "جاري الإضافة..." : "Adding..."}</span>
          )}
        </motion.div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <ShoppingCart size={variant === "icon" ? 18 : 16} />
        {showLabel && variant !== "icon" && (
          <span>{t("product.addToCart")}</span>
        )}
      </div>
    );
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      disabled={isAdding || justAdded}
      className={`
    flex items-center justify-center font-medium rounded-xl transition-all duration-300
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${justAdded ? "bg-green-500 hover:bg-green-600" : ""}
    ${
      isAdding || justAdded
        ? "cursor-not-allowed opacity-90"
        : "hover:shadow-lg"
    }
    ${className}
  `}
      whileTap={!isAdding && !justAdded ? { scale: 0.95 } : {}}
      aria-label={
        isRtl
          ? `إضافة ${product.nameAr} إلى عربة التسوق`
          : `Add ${product.nameEn} to cart`
      }
    >
      {getButtonContent()}
    </motion.button>
  );
};

export default AddToCartButton;
