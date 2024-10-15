const { BasicService } = require("./BasicService");
const User = require("../models/User.model");



class userServices extends BasicService {
  constructor() {
    super(User);
  }
}





module.exports.userServices = new userServices();


