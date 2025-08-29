import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

interface CartItem {
  id: number;
  nameEn: string;
  nameAr: string;
  price: number;
  imageUrl: string;
  quantity: number;
  addedAt?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  syncCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_BASE_URL = "https://localhost:3002/api/cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { showSuccess, showError } = useToast();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Load cart from localStorage for non-authenticated users
  const loadLocalCart = () => {
    try {
      const savedCart = localStorage.getItem("zajil-cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error("خطأ في تحميل السلة من التخزين المحلي:", error);
    }
  };

  // Save cart to localStorage for non-authenticated users
  const saveLocalCart = (cartData: CartItem[]) => {
    try {
      localStorage.setItem("zajil-cart", JSON.stringify(cartData));
    } catch (error) {
      console.error("خطأ في حفظ السلة في التخزين المحلي:", error);
    }
  };

  // Load cart from server for authenticated users
  const refreshCart = async () => {
    if (!isAuthenticated) {
      loadLocalCart();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart.items || []);
        // Clear local storage when using server cart
        localStorage.removeItem("zajil-cart");
      } else {
        console.error("Failed to fetch cart");
        loadLocalCart(); // Fallback to local cart
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      loadLocalCart(); // Fallback to local cart
    } finally {
      setIsLoading(false);
    }
  };

  // Sync local cart with server when user logs in
  const syncCart = async () => {
    if (!isAuthenticated) return;

    try {
      const localCart = localStorage.getItem("zajil-cart");
      if (localCart) {
        const localCartItems = JSON.parse(localCart);
        
        if (localCartItems.length > 0) {
          const response = await fetch(`${API_BASE_URL}/sync`, {
            method: "POST",
            headers: getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify({ localCartItems }),
          });

          if (response.ok) {
            const data = await response.json();
            setCart(data.cart.items || []);
            localStorage.removeItem("zajil-cart");
            showSuccess(
              "تم دمج السلة",
              "تم دمج عناصر السلة المحلية مع حسابك بنجاح"
            );
          }
        }
      }
      
      // Refresh cart from server
      await refreshCart();
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  // Load cart when authentication status changes
  useEffect(() => {
    if (isAuthenticated && user) {
      syncCart();
    } else {
      loadLocalCart();
    }
  }, [isAuthenticated, user]);

  const addToCart = async (product: CartItem) => {
    if (!isAuthenticated) {
      showError(
        "تسجيل الدخول مطلوب",
        "يجب تسجيل الدخول لإضافة المنتجات إلى السلة"
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ productData: product }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart.items || []);
        showSuccess(
          "تم الإضافة للسلة",
          `تم إضافة ${product.nameAr} إلى السلة بنجاح`
        );
      } else {
        throw new Error(data.message || "فشل في إضافة المنتج");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError("خطأ", (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (id: number) => {
    if (!isAuthenticated) {
      showError("تسجيل الدخول مطلوب", "يجب تسجيل الدخول لإدارة السلة");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/remove/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart.items || []);
        showSuccess("تم الحذف", "تم حذف المنتج من السلة");
      } else {
        throw new Error(data.message || "فشل في حذف المنتج");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      showError("خطأ", (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (!isAuthenticated) {
      showError("تسجيل الدخول مطلوب", "يجب تسجيل الدخول لإدارة السلة");
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/update/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart.items || []);
      } else {
        throw new Error(data.message || "فشل في تحديث الكمية");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      showError("خطأ", (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      showError("تسجيل الدخول مطلوب", "يجب تسجيل الدخول لإدارة السلة");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clear`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setCart([]);
        showSuccess("تم المسح", "تم مسح جميع عناصر السلة");
      } else {
        throw new Error(data.message || "فشل في مسح السلة");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      showError("خطأ", (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
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
        isLoading,
        syncCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};