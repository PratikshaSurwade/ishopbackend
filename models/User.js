const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    //   unique: true,
    },
    email: {
      type: String,
      required: true,
    //   unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default:false,
    },
  },
  { timestamps: true }
);

// UserSchema.methods.matchPassword = async function (enterPassword) {
//   return await bcryptjs.compare(enterPassword, this.password);
// };

// //middlware for password
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   const salt = await bcryptjs.genSalt(10);
//   this.password = await bcryptjs.hash(this.password, salt);
// });


module.exports = mongoose.model("User", UserSchema);