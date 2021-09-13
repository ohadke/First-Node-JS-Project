const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
  orderName: {
    type: String,
    required: true,
  },
  orderDate: {
    type: String,
    required: true,
  },

});

// Connects launchesSchema with the "launces" collection in db
module.exports = mongoose.model("Orders", ordersSchema);