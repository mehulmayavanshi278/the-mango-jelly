const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  role:{
    type:String,
    default:"user"
  },
  email: {
    type: String,
  },
  country: {
    type: String,
  },
  state:{
    type:String
  },
  city: {
    type: String,
  },
  profession:{
   type:String
  },
  pincode: {
    type: String,
  },
  phoneNo: {
    type: Number,
  },
  OTP:{
    type:String
  },
  isGeneratedOTP:{
    type:Boolean
  },
  isLearning:{
    type:Boolean,
    default:false
  },

  password: {
    type: String,
  },
  lastLogin: { type: Date, default: Date.now },


});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  console.log(this.password);
  console.log(typeof this.password);
  if (!this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    console.log(salt);

    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { name: this.name, email: this.email, _id: this._id },
    process.env.JSONTOKEN_SECRET_KEY
  );
  await this.save();
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
