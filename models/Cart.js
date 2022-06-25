const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: { type: String  },
        name: { type: String },
        imageUrl: { type: String },
        price: { type: Number },
        qty: { type: Number },
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
