const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "India",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("user", userSchema);

// Normailzation in dbms 1nf, 2nf, 3nf bcnf
