const express = require("express"); //ES5
const mongoose = require("mongoose");
const userModel = require("./userModel");

//contants
const app = express();
const PORT = 8000;
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/mayTestDb`;

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

//api's

app.get("/", (req, res) => {
  console.log("Hii");
  return res.send("Server is up and running");
});

app.get("/get-form", (req, res) => {
  return res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <h1>User form</h1>
    <form action='/form_submit' method='POST'>
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

app.post("/form_submit", async (req, res) => {
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
    return res.status(201).json(userDb);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});

//const users = await userModel.find()
