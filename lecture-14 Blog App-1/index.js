const express = require("express");
require("dotenv").config();
const clc = require("cli-color");

//file-imports
const db = require("./db");
const AuthRouter = require("./Routers/AuthRouter");

const app = express();
const PORT = process.env.PORT || 8001;

//middlewares

// /auth/register
app.use("/auth", AuthRouter);

app.listen(PORT, () => {
  console.log(
    clc.yellowBright.underline.bold(`Server is running on PORT:${PORT}`)
  );
});
