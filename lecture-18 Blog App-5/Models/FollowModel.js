const FollowSchema = require("../Schemas/FollowSchema");
const UserSchema = require("../Schemas/UserSchema");
const { LIMIT } = require("../privateConstants");

const followUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    //check if already following
    try {
      const followExist = await FollowSchema.findOne({
        followerUserId,
        followingUserId,
      });
      if (followExist) return reject("Already following this users");
    } catch (error) {
      reject(error);
    }

    const followObj = new FollowSchema({
      followerUserId,
      followingUserId,
      creationDateTime: Date.now(),
    });

    //storing the data
    try {
      const followDb = await followObj.save();
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getFollowingUserList = ({ followerUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //populate method

      //   const followingUserList = await FollowSchema.find({
      //     followerUserId,
      //   }).populate("followingUserId");

      const followingList = await FollowSchema.aggregate([
        {
          $match: { followerUserId },
        },
        {
          $sort: { creationDateTime: -1 },
        },
        {
          $skip: SKIP,
        },
        {
          $limit: LIMIT,
        },
      ]);

      const followingUserIdsList = followingList.map(
        (follow) => follow.followingUserId
      );

      const followingUserInfo = await UserSchema.find({
        _id: { $in: followingUserIdsList },
      });

      console.log(followingList);
      console.log(followingUserIdsList);
      console.log(followingUserInfo);

      resolve(followingUserInfo.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

const getFollowerUserList = ({ followingUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followerUserList = await FollowSchema.aggregate([
        {
          $match: { followingUserId },
        },
        {
          $sort: { creationDateTime: -1 },
        },
        {
          $skip: SKIP,
        },
        {
          $limit: LIMIT,
        },
      ]);

      const followerUserIdsList = followerUserList.map(
        (follow) => follow.followerUserId
      );

      const followerUserInfo = await UserSchema.find({
        _id: { $in: followerUserIdsList },
      });

      console.log(followerUserInfo);
      resolve(followerUserInfo.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { followUser, getFollowingUserList, getFollowerUserList };
