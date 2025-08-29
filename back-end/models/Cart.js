import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
  nameAr: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: [CartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    timestamps: true,
    // Add indexes for better performance
    indexes: [
      { userId: 1 },
      { "items.productId": 1 },
    ]
  }
);

// Pre-save middleware to calculate totals
CartSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.lastUpdated = new Date();
  next();
});

// Instance methods
CartSchema.methods.addItem = function(productData) {
  const existingItemIndex = this.items.findIndex(
    item => item.productId === productData.id
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += productData.quantity || 1;
  } else {
    // Add new item
    this.items.push({
      productId: productData.id,
      nameEn: productData.nameEn,
      nameAr: productData.nameAr,
      price: productData.price,
      imageUrl: productData.imageUrl,
      quantity: productData.quantity || 1,
    });
  }

  return this.save();
};

CartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => item.productId !== productId);
  return this.save();
};

CartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(item => item.productId === productId);
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    item.quantity = quantity;
    return this.save();
  }
  throw new Error("Item not found in cart");
};

CartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;