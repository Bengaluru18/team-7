var mongoose = require("mongoose");


var examSchema = mongoose.Schema({
    name: String,
    price: String, 
    email: String, 
    phone: String,
    machine: String,
    payment_id: String,
    dateSlot: String,
    hobli: String,
    taluk: String, 
    district: String
});
module.exports = mongoose.model("rent", examSchema, "rent");
