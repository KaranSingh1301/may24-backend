const {
  followUser,
  getFollowingUserList,
  getFollowerUserList,
} = require("../Models/FollowModel");
const User = require("../Models/UserModel");

const followUserController = async (req, res) => {
  //followerUserId, followingUserId
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  if (!followerUserId || !followingUserId) {
    return res.send({
      status: 400,
      message: "Missing user credentials",
    });
  }

  try {
    await User.findUserWithKey({ key: followerUserId });
    await User.findUserWithKey({ key: followingUserId });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Data base error",
      error: error,
    });
  }

  //create an entry within the DB
  try {
    const followDb = await followUser({ followerUserId, followingUserId });

    return res.send({
      status: 201,
      message: "follow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
};

const followingUserlistController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  try {
    const followingUserList = await getFollowingUserList({
      followerUserId,
      SKIP,
    });

    if (followingUserList.length === 0) {
      return res.send({
        status: 203,
        message: "No followering user found",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: followingUserList,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
};

const followerUserlistController = async (req, res) => {
  const followingUserId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  try {
    const followerUserList = await getFollowerUserList({
      followingUserId,
      SKIP,
    });

    if (followerUserList.length === 0) {
      return res.send({
        status: 203,
        message: "No follower user found",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: followerUserList,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
};

module.exports = {
  followUserController,
  followingUserlistController,
  followerUserlistController,
};

//test ---> test1
//test ---> test2
//test ---> test3
//test ---> test4
//test1 ---> test5
//test----->test5
//test2------>test5
