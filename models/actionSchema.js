const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the user schema
const actionSchema = new Schema({
  date: {
    type: String,

  },
  type: {
    type: String,
    default:"credit"
  },
  details: {
    type: String,
   
  },
  amount:{
    type: Number,
    default:0
  },
  balance:{
    type: Number,
    required: true,
    default:0
  },

});

module.exports= actionSchema;

