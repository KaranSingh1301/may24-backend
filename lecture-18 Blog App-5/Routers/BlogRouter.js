const express = require("express");
const {
  createBlogController,
  readBlogsController,
  readMyBlogsController,
  editBlogController,
  deleteBlogController,
} = require("../Controllers/BlogController");
const BlogRouter = express.Router();
const isAuth = require("../Middlewares/AuthMiddleware");

// blog/
BlogRouter.post("/create-blog", createBlogController);
BlogRouter.get("/get-blogs", readBlogsController);
BlogRouter.get("/get-myblogs", readMyBlogsController);
BlogRouter.post("/edit-blog", editBlogController);
BlogRouter.post("/delete-blog", deleteBlogController);

module.exports = BlogRouter;
