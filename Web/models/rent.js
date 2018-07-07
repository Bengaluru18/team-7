var mongoose = require("mongoose");
var rentSchema = mongoose.Schema({
    name: String,
    price: String, 
    email: String, 
    phone: String,
    mname: String,
    mtype: String,
    payment_id: String,
    endDate: String,
    startDate: String,
    hobli: String,
    taluk: String, 
    district: String,
    status: String,
    pending_payment: String,
    mode: String
});
module.exports = mongoose.model("rent", rentSchema, "rent");
