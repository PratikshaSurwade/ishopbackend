const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcryptjs = require('bcrypt');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const cloudinary = require('cloudinary').v2


//cloudinary
cloudinary.config({
  cloud_name: 'dn9hxyxud',
  api_key: '288723588442291',
  api_secret: 'yRPWxzL6jCHBJPNfxPaAIF6Z2k4'
})

//Register

// router.post("/register", async (req,res) => {
//     try {
//         const salt = await bcryptjs.genSalt(10);
//         const hashedPass = await bcryptjs.hash(req.body.password, salt);

//         const newUser = new User({
//             username : req.body.username,
//             email : req.body.email,
//             password : hashedPass
//         });
//         console.log(newUser)
//         const user= await newUser.save();
//         res.status(200).json(user);
//     } catch(err) {
//       res.status(500).json(err);
//     }
// })
// /using crypto paste pass_sec from .env it can be anything u want say PASS_SEC=pratiksha


router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    profilePic:req.body.profilePic,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});


// router.post("/register", async (req, res) => {
//   console.log(req.body);
//   console.log(req.body.file)
//   console.log(req.files);
//   console.log(req.File);

//   const file = req.files.photo;
//   console.log(file);

//   cloudinary.uploader.upload(file.tempFilePath, (err, result) => {     
//     console.log(result);

//     const newUser = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: CryptoJS.AES.encrypt(
//           req.body.password,
//           process.env.PASS_SEC
//         ).toString(),
//         profilePic: result.url,
//     });
    
//     const savedUser = newUser.save()
//       .then(savedUser => {
//         console.log(savedUser)
//         res.status(200).json(savedUser);
//       })

//       .catch(err => {
//         console.log(err)
//         res.status(500).json(err);
//       })
//   })


  // try {
  //   const savedUser = await newUser.save();
  //   res.status(201).json(savedUser);
  // } catch (err) {
  //   res.status(500).json(err);
  // }
// });

//Login

// router.get("/login", async (req, res) => {
//     try {
//       const user = await User.findOne({ username: req.body.username });
//       !user && res.status(400).json("Wrong credentials!");

//       const validated = await bcryptjs.compare(req.body.password , user.password);
//       !validated && res.status(400).json("Wrong credentials!");

//       //to hide password in login check
//       const { password, ...others } = user._doc;

//       res.status(200).json(others);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });
//Login using crypto 

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json("Wrong credentials!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    OriginalPassword !== req.body.password &&
      res.status(401).json("Wrong credentials!");
    console.log(OriginalPassword)
    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;