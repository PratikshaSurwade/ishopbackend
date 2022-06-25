const Product = require("../models/Product");
const Cart = require("../models/Cart");

const cloudinary = require('cloudinary').v2
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//cloudinary
cloudinary.config({
  cloud_name: 'dn9hxyxud',
  api_key: '288723588442291',
  api_secret: 'yRPWxzL6jCHBJPNfxPaAIF6Z2k4'
})
//CREATE

// router.post("/", verifyTokenAndAdmin, async (req, res) => {

//     const newProduct = new Product(req.body);

//     try {    
//       const savedProduct = await newProduct.save();
//     res.status(200).json(savedProduct);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// })


router.post("/", verifyTokenAndAdmin, (req, res) => {
  // const newProduct = new Product(req.body);
  const file = req.files.photo;
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    console.log(result)

    const newProduct = new Product({
      name: req.body.name,
      desc: req.body.desc,
      img: result.url,
      tab: req.body.tab,
      subtab: req.body.subtab,
      accesories: req.body.accesories,
      categories: req.body.categories,
      brand: req.body.brand,
      color: req.body.color,
      originalPrice: req.body.originalPrice,
      discountedPrice: req.body.discountedPrice,
      rating: req.body.rating,
    });
    
    const savedProduct = newProduct.save()
      .then(savedProduct => {
        console.log(savedProduct)
        res.status(200).json(savedProduct);
      })

      .catch(err => {
        console.log(err)
        res.status(500).json(err);
      })
  })
})


//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  const qCategory = req.query.categories;
  const qSubtab = req.query.subtab;
  const qAccesories = req.query.accesories;
  const qBrand = req.query.brand;
  const qColor = req.query.color;
  try {
    let products;

    if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } if (qSubtab) {
      products = await Product.find({
        subtab: {
          $in: [qSubtab],
        },
      });
    } if (qColor) {
      products = await Product.find({
        color: {
          $in: [qColor],
        },
      });
    } if (qBrand) {
      products = await Product.find({
        brand: {
          $in: [qBrand],
        },
      });
    } if (qAccesories) {
      products = await Product.find({
        accesories: {
          $in: [qAccesories],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

//select sub category 
router.get("/cat/:category/", async (req, res) => {

  try {
    const catfilter = await Product.find({ categories : req.params.category })
    res.status(200).json(catfilter);
  } 
  catch (error) {
    res.status(500).json(error);
  }

});

module.exports = router;
