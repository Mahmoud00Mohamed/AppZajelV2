import Cart from "../models/Cart.js";
import User from "../models/User.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      // Create new cart if doesn't exist
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    // Transform to match frontend format
    const formattedCart = {
      items: cart.items.map(item => ({
        id: item.productId,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        addedAt: item.addedAt,
      })),
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      lastUpdated: cart.lastUpdated,
    };

    res.status(200).json({
      cart: formattedCart,
      success: true,
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ 
      message: "خطأ في جلب السلة",
      success: false 
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productData } = req.body;

    // Validate required fields
    if (!productData || !productData.id) {
      return res.status(400).json({ 
        message: "بيانات المنتج مطلوبة",
        success: false 
      });
    }

    // Validate product data structure
    const requiredFields = ['nameEn', 'nameAr', 'price', 'imageUrl'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return res.status(400).json({ 
          message: `حقل ${field} مطلوب`,
          success: false 
        });
      }
    }

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    await cart.addItem(productData);

    // Return updated cart in frontend format
    const formattedCart = {
      items: cart.items.map(item => ({
        id: item.productId,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        addedAt: item.addedAt,
      })),
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
    };

    res.status(200).json({
      message: "تم إضافة المنتج إلى السلة بنجاح",
      cart: formattedCart,
      success: true,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "خطأ في إضافة المنتج",
        success: false 
      });
    }
    res.status(500).json({ 
      message: "خطأ في إضافة المنتج إلى السلة",
      success: false 
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ 
        message: "السلة غير موجودة",
        success: false 
      });
    }

    await cart.removeItem(parseInt(productId));

    const formattedCart = {
      items: cart.items.map(item => ({
        id: item.productId,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        addedAt: item.addedAt,
      })),
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
    };

    res.status(200).json({
      message: "تم حذف المنتج من السلة بنجاح",
      cart: formattedCart,
      success: true,
    });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ 
      message: "خطأ في حذف المنتج من السلة",
      success: false 
    });
  }
};

// Update item quantity
export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({ 
        message: "الكمية يجب أن تكون أكبر من صفر",
        success: false 
      });
    }

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ 
        message: "السلة غير موجودة",
        success: false 
      });
    }

    await cart.updateItemQuantity(parseInt(productId), quantity);

    const formattedCart = {
      items: cart.items.map(item => ({
        id: item.productId,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        addedAt: item.addedAt,
      })),
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
    };

    res.status(200).json({
      message: "تم تحديث كمية المنتج بنجاح",
      cart: formattedCart,
      success: true,
    });
  } catch (err) {
    console.error("Error updating cart item quantity:", err);
    res.status(500).json({ 
      message: "خطأ في تحديث كمية المنتج",
      success: false 
    });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ 
        message: "السلة غير موجودة",
        success: false 
      });
    }

    await cart.clearCart();

    res.status(200).json({
      message: "تم مسح السلة بنجاح",
      cart: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
      success: true,
    });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ 
      message: "خطأ في مسح السلة",
      success: false 
    });
  }
};

// Get cart count (for header badge)
export const getCartCount = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const cart = await Cart.findOne({ userId });
    const count = cart ? cart.totalItems : 0;

    res.status(200).json({ 
      count,
      success: true 
    });
  } catch (err) {
    console.error("Error getting cart count:", err);
    res.status(500).json({ 
      message: "خطأ في جلب عدد عناصر السلة",
      success: false 
    });
  }
};

// Sync local cart with server cart (for when user logs in)
export const syncCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { localCartItems } = req.body;

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Merge local cart items with server cart
    if (localCartItems && Array.isArray(localCartItems)) {
      for (const localItem of localCartItems) {
        if (localItem.id && localItem.quantity > 0) {
          await cart.addItem({
            id: localItem.id,
            nameEn: localItem.nameEn,
            nameAr: localItem.nameAr,
            price: localItem.price,
            imageUrl: localItem.imageUrl,
            quantity: localItem.quantity,
          });
        }
      }
    }

    const formattedCart = {
      items: cart.items.map(item => ({
        id: item.productId,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        addedAt: item.addedAt,
      })),
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
    };

    res.status(200).json({
      message: "تم مزامنة السلة بنجاح",
      cart: formattedCart,
      success: true,
    });
  } catch (err) {
    console.error("Error syncing cart:", err);
    res.status(500).json({ 
      message: "خطأ في مزامنة السلة",
      success: false 
    });
  }
};