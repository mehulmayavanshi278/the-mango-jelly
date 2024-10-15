const { userServices } = require("../Services/services");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const { Otp } = require("../models/otp.model");


generateOtp = ()=> {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
}

class userController {
  getAllUsers = async(req , res)=>{
    try{
      let data = await userServices.find();
      return res.status(200).send(data);
    }catch(err){
      console.log(err);
    }
  }
  getUsers = async (req, res) => {
    const id = req.params.id || req.user._id;
    console.log(id);
    try {
      const data = await userServices.findById(id);
      return res.status(200).send(data);
    } catch (err) {
      console.log(err);
    }
  };
  






  create = async (req, res) => {
    try {
      const body = req?.body;
      console.log(req.body);
      console.log("above thedata")
      const { email, phoneNo,profession , firstName, lastName, password , role} = req.body;
      const checkUser = await userServices.findOne({
        $or: [{ email }, { phoneNo }],
      });
      if (checkUser) {
        console.log("checkuser" , checkUser);

        return res.status(400).send({message:"Already registered with this credentials"});
      }
      console.log(email, phoneNo, firstName, lastName, password )
      let user = await userServices.create({email, phoneNo, profession , firstName, lastName, password , role:role || 'User'});
      return res.status(200).send(user);
    } catch (err) {
      console.log(err);
    }
  };




  
   sendOtp = async (req, res) => {
    try {
      // Get email from request body
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      let otpData = await Otp.findOne({email});
      if(otpData) return res.status(200).send({message:`OTP Already Sent to the ${email}`});
      // Generate OTP
      const otp = generateOtp();
  
      // Configure nodemailer transport (use your email service credentials)
      let transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider, like 'gmail'
        auth: {
          user: process.env.EMAIL_USER, // Your email address
          pass: process.env.EMAIL_PASS, // Your email password or app-specific password
        },
      });
  
      // Email options
      let mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: email, // Receiver email
        subject: 'OTP from Educonnect', // Subject line
        text: `${otp} is the OTP to register in Educonnect`, // Plain text body
      };
  

      // Send email
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log(error);
          return res.status(400).json({ message: 'Error sending email' });
        } else {
          console.log("otp send");
          return;

        }
      });


      let newOtp = new Otp({
        email,
        otp,
        isgenerated:true
      });
      await newOtp.save();

      return res.send({message:`otp send successfully to the email ${email}`});
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'An error occurred' });
    }
  };


  verifyOtp = async(req , res)=>{
    try{
      const {email , otp} = req.body;
      console.log(email , otp);
      let otpData= await Otp.findOne({email});
      if(!otpData){
       return res.status(400).send({message:"OTP expired please send again"});
      }
      if(otp!==otpData.otp) return res.status(400).send({message:"Invalid OTP"});
      if(otp===otpData.otp) {
        await Otp.findByIdAndDelete(otpData._id);
        return res.status(200).send({verfied:true});
      }
      console.log(otpData);
      return res.send({isverified:true});
    }catch(err){
      console.log(err);
    }
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkUser = await userServices.findOne({ email });
      if (!checkUser) {
        return res.status(400).send({message:"user not registered with this Email!"});
      }
      const checkPw = await bcrypt.compare(password, checkUser.password);
      console.log("checkpw", checkPw);
      if (!checkPw) {
        return res.status(400).send({message:"Invalid Credentials"});
      }
      checkUser.lastLogin = Date.now();
      await checkUser.save();
      const token = await checkUser.generateAuthToken();
      return res.status(200).send({ token });
    } catch (err) {
      console.log(err);
    }
  };
  update = async (req, res) => {
    const body = req.body;
    const id =  req?.params?.id || req.user._id;
    console.log(id);
    try {
  
      await userServices.findByIdAndUpdate(id, body);
      return res.status(200).send({ message: "updated successfully" });
    } catch (err) {
      console.log(err);
    }
  };
  loginWithGoogle = async (req, res) => {
    
  };
  delete = async (req, res) => {};
}

module.exports.userController = new userController( );
