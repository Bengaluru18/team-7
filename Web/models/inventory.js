var mongoose = require("mongoose");


var examSchema = mongoose.Schema({
    name: String,
    make: String,
    type: String,
    model_name: String,
    si_no: String
});
module.exports = mongoose.model("rent", examSchema, "rent");
