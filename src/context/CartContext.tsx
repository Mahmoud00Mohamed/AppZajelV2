// src/context/CartContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CartItem {
  id: number;
  nameEn: string;
  nameAr: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("zajil-cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        console.log("تم تحميل السلة من التخزين المحلي:", parsedCart);
      }
    } catch (error) {
      console.error("خطأ في تحميل السلة من التخزين المحلي:", error);
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("zajil-cart", JSON.stringify(cart));
      console.log("تم حفظ السلة في التخزين المحلي:", cart);
    } catch (error) {
      console.error("خطأ في حفظ السلة في التخزين المحلي:", error);
    }
  }, [cart]);

  const addToCart = (product: CartItem) => {
    try {
      setCart((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);

        if (existingItem) {
          // Update quantity if item already exists
          const updatedCart = prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          );
          console.log(`تم تحديث كمية المنتج ${product.id} في السلة`);
          return updatedCart;
        } else {
          // Add new item to cart
          const newItem = { ...product, quantity: product.quantity || 1 };
          const updatedCart = [...prev, newItem];
          console.log(`تم إضافة المنتج ${product.id} إلى السلة بنجاح`);
          return updatedCart;
        }
      });
    } catch (error) {
      console.error("خطأ في إضافة المنتج إلى عربة التسوق:", error);
      throw error;
    }
  };

  const removeFromCart = (id: number) => {
    try {
      setCart((prev) => {
        const updatedCart = prev.filter((item) => item.id !== id);
        console.log(`تم حذف المنتج ${id} من عربة التسوق`);
        return updatedCart;
      });
    } catch (error) {
      console.error("خطأ في حذف المنتج من عربة التسوق:", error);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }

      setCart((prev) => {
        const updatedCart = prev.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        console.log(`تم تحديث كمية المنتج ${id} إلى ${quantity}`);
        return updatedCart;
      });
    } catch (error) {
      console.error("خطأ في تحديث كمية المنتج:", error);
    }
  };

  const clearCart = () => {
    try {
      setCart([]);
      console.log("تم مسح عربة التسوق");
    } catch (error) {
      console.error("خطأ في مسح عربة التسوق:", error);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
