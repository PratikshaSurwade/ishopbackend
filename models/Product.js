const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    tab: { type: Array },
    subtab: { type: Array },
    accesories: { type: Array },
    categories: { type: Array },
    brand: { type: Array },
    color: { type: Array },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    rating: { type: Number },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
