import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "./CartContext";
import { ProductImage } from "../features/images";

const CartPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const isRtl = i18n.language === "ar";

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 200 ? 0 : 50; // Free shipping over 200 SAR
  const tax = subtotal * 0.14; // 14% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="container-custom py-8">
      <h1 className="section-title">{t("cart.title")}</h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
          <ShoppingCart size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-6">{t("cart.empty")}</p>
          <Link to="/" className="btn btn-primary">
            {t("cart.continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {t("cart.summary")} ({cart.length} {isRtl ? "منتج" : "items"})
              </h3>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                {t("cart.clearCart")}
              </button>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <ProductImage
                    src={item.imageUrl}
                    alt={isRtl ? item.nameAr : item.nameEn}
                    className="w-20 h-20 object-cover rounded-md mr-4 rtl:ml-4 rtl:mr-0"
                    width={80}
                    height={80}
                    aspectRatio="square"
                    sizes="80px"
                    quality={100}
                    showZoom={false}
                  />
                  <div className="flex-grow">
                    <Link
                      to={`/product/${item.id}`}
                      className="font-medium text-gray-800 hover:text-primary transition-colors block"
                    >
                      {isRtl ? item.nameAr : item.nameEn}
                    </Link>
                    <p className="text-primary font-bold mt-1">
                      {item.price} {isRtl ? "ر.س" : "SAR"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h3 className="text-lg font-bold mb-4">{t("cart.summary")}</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">{t("cart.subtotal")}</span>
                <span>
                  {subtotal.toFixed(2)} {isRtl ? "ر.س" : "SAR"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("cart.shipping")}</span>
                <span
                  className={shipping === 0 ? "text-green-600 font-medium" : ""}
                >
                  {shipping === 0
                    ? isRtl
                      ? "مجاني"
                      : "Free"
                    : `${shipping.toFixed(2)} ${isRtl ? "ر.س" : "SAR"}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("cart.tax")}</span>
                <span>
                  {tax.toFixed(2)} {isRtl ? "ر.س" : "SAR"}
                </span>
              </div>
              {shipping > 0 && subtotal < 200 && (
                <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                  {isRtl
                    ? `أضف ${(200 - subtotal).toFixed(
                        2
                      )} ر.س للحصول على توصيل مجاني`
                    : `Add ${(200 - subtotal).toFixed(
                        2
                      )} SAR for free shipping`}
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>{t("cart.total")}</span>
                <span>
                  {total.toFixed(2)} {isRtl ? "ر.س" : "SAR"}
                </span>
              </div>
            </div>
            <button className="btn btn-primary w-full mt-6">
              {t("cart.checkout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
