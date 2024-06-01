const express = require("express");
const {
  followUserController,
  followingUserlistController,
  followerUserlistController,
} = require("../Controllers/FollowController");
const FollowRouter = express.Router();

FollowRouter.post("/follow-user", followUserController);
FollowRouter.get("/following-list", followingUserlistController);
FollowRouter.get("/follower-list", followerUserlistController);

module.exports = FollowRouter;
