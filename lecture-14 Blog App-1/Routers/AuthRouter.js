const express = require("express");
const {
  loginController,
  registerController,
} = require("../Controllers/AuthController");
const AuthRouter = express.Router();

AuthRouter.post("/register", registerController);
AuthRouter.post("/login", loginController);

module.exports = AuthRouter;
