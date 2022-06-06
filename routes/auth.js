const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcryptjs = require('bcrypt');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

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
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

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
//Login usinf g crypto 
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