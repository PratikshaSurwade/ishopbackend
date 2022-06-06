const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const cors = require("cors");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const paymentRoutes = require("./routes/payment");
//image to cloudinary
const fileUpload = require('express-fileupload');

dotenv.config();
app.use(fileUpload({
  useTempFiles:true
}))
app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

// app.use(cors());

// app.get("/", async (req, res) => {
//     try {
//       res.send("Hello this is eccommerce app iShop backend");
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });

app.use("/api/auth", authRoute);

app.use("/api/users", userRoute);
//Products in our app
app.use("/api/products", productRoute);
//Cart details
app.use("/api/carts", cartRoute);
//Order summary
app.use("/api/orders", orderRoute);
//
app.use("/api/payment", paymentRoutes);


app.listen(process.env.PORT || 7000, () => {
    console.log("Backend server is running at port 7000!");
  });