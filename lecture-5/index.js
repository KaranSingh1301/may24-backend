const express = require("express"); //ES5
const mongoose = require("mongoose");
const userModel = require("./userModel");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//contants
const app = express();
const PORT = 8000;
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/mayTestDb`;
const store = new mongodbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

//db connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

//middlewares
app.use(express.urlencoded({ extended: true })); //data from form
app.use(express.json()); //data comes from axios fetch or postman

//session
app.use(
  session({
    secret: "This is may backend module",
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

//api's

app.get("/", (req, res) => {
  console.log("Hii");
  return res.send("Server is up and running");
});

app.get("/register", (req, res) => {
  return res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <h1>Registeration form</h1>
    <form action='/register-user' method='POST'>
      <label for="name">Name</label>
      <input type="text" name="name">
      <br/>
      <label for="email">Email</label>
      <input type="text" name="email">
      <br/>
      <label for="password">Password</label>
      <input type="text" name="password">
        <br/>
      <button type="submit">Submit</button>
    </form>
  </body>
  </html>
  `);
});

app.post("/register-user", async (req, res) => {
  console.log(req.body);

  const nameC = req.body.name;
  const emailC = req.body.email;
  const passwordC = req.body.password;

  //intialize the schema ---> obj
  const userObj = new userModel({
    //schema (keys) : values (client)
    name: nameC,
    email: emailC,
    password: passwordC,
  });

  console.log(userObj);

  //obj ---> save()

  try {
    const userDb = await userObj.save(); //I/O bound opt
    console.log(userDb);
    return res
      .status(201)
      .json({ message: "Register successfull", data: userDb });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get("/login", (req, res) => {
  return res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <h1>Login form</h1>
    <form action='/login-user' method='POST'>
      <label for="email">Email</label>
      <input type="text" name="email">
      <br/>
      <label for="password">Password</label>
      <input type="text" name="password">
        <br/>
      <button type="submit">Submit</button>
    </form>
  </body>
  </html>
  `);
});

app.post("/login-user", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  //find the user from db with emailId

  try {
    const userDb = await userModel.findOne({ email: email });

    if (!userDb) {
      return res.status(400).json("User not found");
    }

    //compare the password
    console.log(password, userDb.password);

    if (password !== userDb.password) {
      return res.status(400).json("Incorrect password");
    }

    //session base auth
    console.log(req.session);
    req.session.isAuth = true; //storing the session in db and sending the sid to client

    return res.status(200).json("Login success");
  } catch (error) {
    return res.status(500).json(error);
  }
});

//private api
app.get("/check", (req, res) => {
  console.log(req.session.isAuth);
  if (req.session.isAuth) {
    return res.send("Private data send!!!!!");
  } else {
    return res.send("Session expire, please login again");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});

//const users = await userModel.find()
