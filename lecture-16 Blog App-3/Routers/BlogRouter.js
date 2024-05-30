const express = require("express");
const { createBlogController } = require("../Controllers/BlogController");
const BlogRouter = express.Router();
const isAuth = require("../Middlewares/AuthMiddleware");

// blog/create-blog
BlogRouter.post("/create-blog", isAuth, createBlogController);

module.exports = BlogRouter;
