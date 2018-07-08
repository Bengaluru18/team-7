var mongoose = require("mongoose");
var rentSchema = mongoose.Schema({
    name: String,
    price: String, 
    email: String, 
    date_created: {type: Date, default: Date.now},
    phone: String,
    mname: String,
    mtype: String,
    payment_id: String,
    status: String,
    pending_payment: String,
    mode: String,
    days: Number
});
module.exports = mongoose.model("rent", rentSchema, "rent");
