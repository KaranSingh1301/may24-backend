const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

//file-import
const { userDataValidation } = require("./utils/authUtil");
const userModel = require("./models/userModel");

//contants
const app = express();
const PORT = process.env.PORT || 8000;

//middlwares
app.set("view engine", "ejs"); //setting the view engine  of express to ejs
app.use(express.urlencoded({ extended: true })); //encoded data form
app.use(express.json()); //json

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDb connected successfully");
  })
  .catch((err) => console.log(err));

//api
app.get("/", (req, res) => {
  return res.send("Server is running");
});

//register
app.get("/register", (req, res) => {
  return res.render("registerPage");
});

app.post("/register-user", async (req, res) => {
  console.log(req.body);
  const { name, email, username, password } = req.body;

  //data validation
  try {
    await userDataValidation({ name, email, username, password });
  } catch (error) {
    return res.status(400).json(error);

    // return res.send({
    //     status : 400,
    //     message : "Data invalid",
    //     error : error
    // })
  }

  //store the data in DB

  //   const userDb = await userModel.create({
  //     name: name,
  //     email: email,
  //     username: username,
  //     password: password,
  //   })

  const userObj = new userModel({
    name: name,
    email: email,
    username: username,
    password: password,
  });

  try {
    const userDb = await userObj.save();
    console.log(userDb);
    return res.send({
      status: 201,
      message: "Register successfull",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
});

//login
app.get("/login", (req, res) => {
  return res.render("loginPage");
});

app.listen(PORT, () => {
  console.log(`Server is running at:`);
  console.log(`http://localhost:${PORT}`);
});
