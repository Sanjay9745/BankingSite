const mongoose = require("mongoose");

const actionSchema = require("./actionSchema");
const Schema = mongoose.Schema;


// Define the user schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  amount:{
    type: Number,
    required: true,
    default:0
  },
  actions:[actionSchema]

});

const User = mongoose.model("User", userSchema);
module.exports = User;
