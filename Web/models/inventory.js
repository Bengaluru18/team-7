var mongoose = require("mongoose");


var inventorySchema = mongoose.Schema({
    name: String,
    make: String,
    type: String,
    si_no: String,
    quantity: String,
    pph: Number
});
module.exports = mongoose.model("inventory", inventorySchema, "inventory");
