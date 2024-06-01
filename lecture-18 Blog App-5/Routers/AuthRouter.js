const express = require("express");
const {
  loginController,
  registerController,
  logoutController,
  logoutFromAllDevicesController,
} = require("../Controllers/AuthController");
const isAuth = require("../Middlewares/AuthMiddleware");
const AuthRouter = express.Router();

AuthRouter.post("/register", registerController);
AuthRouter.post("/login", loginController);
AuthRouter.post("/logout", isAuth, logoutController);
AuthRouter.post("/logout", isAuth, logoutFromAllDevicesController);

module.exports = AuthRouter;
