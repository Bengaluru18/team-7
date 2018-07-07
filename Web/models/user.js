var mongoose = require("mongoose");
var examSchema = mongoose.Schema({
    name: String,
    price: String, 
    email: String, 
    phone: String,
    hobli: String,
    taluk: String, 
    district: String,
    aadhar: String,
    major_crops: String,
    survey_no: String,
    rating: String,
    role: String
});
module.exports = mongoose.model("user", examSchema, "user");
