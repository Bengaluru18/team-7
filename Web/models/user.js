var mongoose = require("mongoose");
var userSchema = mongoose.Schema({
    name: String,
    password: String, 
    email: String, 
    phone: String,
    hobli: String,
    taluk: String, 
    district: String,
    aadhar: String,
    major_crops: String,
    survey_no: String,
    rating: String,
    role: String,
    survey_no_doc: String,
    status: String
});
module.exports = mongoose.model("user", userSchema, "user");
