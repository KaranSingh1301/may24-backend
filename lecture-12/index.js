const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

//file-import
const {
  userDataValidation,
  isEmailValidator,
  genrateToken,
  sendVerificationMail,
} = require("./utils/authUtil");
const userModel = require("./models/userModel");
const isAuth = require("./middleware/isAuthMiddleware");
const todoModel = require("./models/todoModel");

//contants
const app = express();
const PORT = process.env.PORT || 8000;
const store = new mongodbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//middlwares
app.set("view engine", "ejs"); //setting the view engine  of express to ejs
app.use(express.urlencoded({ extended: true })); //encoded data form
app.use(express.json()); //json
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static("public"));

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
  const { name, email, username, password } = req.body;

  //data validation
  try {
    await userDataValidation({ name, email, username, password });
  } catch (error) {
    return res.status(400).json(error);
  }

  //find the user if exist with email and username

  const userEmailExist = await userModel.findOne({ email });
  if (userEmailExist) {
    return res.send({
      status: 400,
      message: "Email already exist",
    });
  }

  const userUsernameExist = await userModel.findOne({ username });
  if (userUsernameExist) {
    return res.send({
      status: 400,
      message: "Username already exist",
    });
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT)
  );

  console.log(hashedPassword);

  //store the data in DB

  const userObj = new userModel({
    name: name,
    email: email,
    username: username,
    password: hashedPassword,
  });

  try {
    const userDb = await userObj.save();

    //genrate the token

    const token = genrateToken(email);

    //send the mail
    sendVerificationMail(email, token);

    return res.redirect("/login");
  } catch (error) {
    console.log(error);
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

app.post("/login-user", async (req, res) => {
  console.log(req.body);

  const { loginId, password } = req.body;

  if (!loginId || !password)
    return res.status(400).json("Missing login credentials");

  try {
    //find the user with loginId
    let userDb;
    if (isEmailValidator({ str: loginId })) {
      userDb = await userModel.findOne({ email: loginId });
    } else {
      userDb = await userModel.findOne({ username: loginId });
    }

    if (!userDb)
      return res.status(400).json("User not found, please register first");

    console.log("here", userDb);
    //check is email is verified or not
    if (!userDb.isEmailVerified) {
      return res.status(400).json("Please verify your email before login");
    }

    //compare the password

    const isMatch = await bcrypt.compare(password, userDb.password);
    if (!isMatch) return res.status(400).json("Password does not matched");

    //session base auth
    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id, //userDb._id.toString(), new ObjectId(userDb._id)
      email: userDb.email,
      username: userDb.username,
    };

    return res.redirect("/dashboard");
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
});

app.get("/verifytoken/:token", async (req, res) => {
  console.log(req.params);
  const token = req.params.token;

  const userInfo = jwt.verify(token, process.env.SECRET_KEY);
  console.log(userInfo);

  try {
    await userModel.findOneAndUpdate(
      { email: userInfo },
      { isEmailVerified: true }
    );
    return res.redirect("/login");
  } catch (error) {
    return res.status(500).json(error);
  }
});

//protected api
app.get("/dashboard", isAuth, (req, res) => {
  return res.render("dashboardPage");
});

app.post("/logout", isAuth, (req, res) => {
  console.log("logout");

  req.session.destroy((err) => {
    if (err) return res.status(500).json(err);
    return res.redirect("/login");
  });
});

//todos api's

app.post("/create-item", isAuth, async (req, res) => {
  console.log(req.body);

  const todoText = req.body.todo;
  const username = req.session.user.username;

  //data validation
  if (!todoText) {
    return res.send({
      status: 400,
      message: "Missing todo text",
    });
  }

  if (typeof todoText !== "string") {
    return res.send({
      status: 400,
      message: "Todo is not a text",
    });
  }

  //create ann object
  //obj.save()

  const todoObj = todoModel({
    //schema : value
    todo: todoText,
    username: username,
  });

  try {
    const todoDb = await todoObj.save();

    return res.send({
      status: 201,
      message: "Todo created successfully",
      data: todoDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      messsage: "Internal server error",
      error: error,
    });
  }
});

// /read-item?skip=10
app.get("/read-item", isAuth, async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const LIMIT = 5;
  const username = req.session.user.username;

  try {
    // const todoDb = await todoModel.find({ username: username }); //return an array

    //mongodb aggregate
    //pagination, match
    const todoDb = await todoModel.aggregate([
      {
        $match: { username: username },
      },
      {
        $skip: SKIP,
      },
      {
        $limit: LIMIT,
      },
    ]);
    console.log(todoDb);
    if (todoDb.length === 0) {
      return res.send({
        status: 204,
        message: "No todos found",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: todoDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
});

app.post("/edit-item", isAuth, async (req, res) => {
  const newData = req.body.newData;
  const todoId = req.body.todoId;

  const usernameReq = req.session.user.username;

  console.log(newData, todoId);

  if (!todoId) {
    return res.send({
      status: 400,
      message: "Missing todo id",
    });
  }

  if (!newData) {
    return res.send({
      status: 400,
      message: "Missing todo text",
    });
  }

  if (typeof newData !== "string") {
    return res.send({
      status: 400,
      message: "Todo is not a text",
    });
  }

  try {
    //find the todo from db
    const todoDb = await todoModel.findOne({ _id: todoId });
    console.log(todoDb.username, usernameReq);

    //ownership check
    if (todoDb.username !== usernameReq) {
      return res.send({
        status: 403, //forbidden
        message: "Not allowed to edit the todo",
      });
    }

    const prevDataDb = await todoModel.findOneAndUpdate(
      { _id: todoId },
      { todo: newData }
    );

    return res.send({
      status: 200,
      message: "Todo updated successfully",
      data: prevDataDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
});

app.post("/delete-item", isAuth, async (req, res) => {
  const todoId = req.body.todoId;

  const usernameReq = req.session.user.username;

  if (!todoId) {
    return res.send({
      status: 400,
      message: "Missing todo id",
    });
  }

  try {
    //find the todo from db
    const todoDb = await todoModel.findOne({ _id: todoId });
    console.log(todoDb.username, usernameReq);

    //ownership check
    if (todoDb.username !== usernameReq) {
      return res.send({
        status: 403, //forbidden
        message: "Not allowed to delete the todo",
      });
    }

    const prevDataDb = await todoModel.findOneAndDelete({ _id: todoId }); //deleteOne()

    return res.send({
      status: 200,
      message: "Todo deleted successfully",
      data: prevDataDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at:`);
  console.log(`http://localhost:${PORT}`);
});
