const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const session = require("express-session");
const mongoDbsession = require("connect-mongodb-session")(session);

//file-imports
const db = require("./db");
const AuthRouter = require("./Routers/AuthRouter");
const BlogRouter = require("./Routers/BlogRouter");
const isAuth = require("./Middlewares/AuthMiddleware");
const FollowRouter = require("./Routers/FollowRouter");

//constants
const app = express();
const PORT = process.env.PORT || 8001;
const store = new mongoDbsession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//middlewares
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

//routing
app.use("/auth", AuthRouter);
app.use("/blog", isAuth, BlogRouter);
app.use("/follow", isAuth, FollowRouter);

app.listen(PORT, () => {
  console.log(
    clc.yellowBright.underline.bold(`Server is running on PORT:${PORT}`)
  );
});

//server.js <----> routers <--->controllers ---->Models <--- Schema
