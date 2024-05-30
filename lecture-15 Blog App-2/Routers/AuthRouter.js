const express = require("express");
const {
  loginController,
  registerController,
  logoutController,
} = require("../Controllers/AuthController");
const isAuth = require("../Middlewares/AuthMiddleware");
const AuthRouter = express.Router();

AuthRouter.post("/register", registerController);
AuthRouter.post("/login", loginController);
AuthRouter.post("/logout", isAuth, logoutController);

module.exports = AuthRouter;
