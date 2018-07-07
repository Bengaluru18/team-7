var mongoose = require("mongoose");


var inventorySchema = mongoose.Schema({
    name: String,
    make: String,
    type: String,
    model_name: String,
    si_no: String,
    quantity: String
});
module.exports = mongoose.model("inventory", inventorySchema, "inventory");
