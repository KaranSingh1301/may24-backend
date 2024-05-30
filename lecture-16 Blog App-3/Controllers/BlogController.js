const User = require("../Models/UserModel");

const { createBlog } = require("../Models/BlogModel");
const { BlogDataValidation } = require("../Utils/BlogUtil");

const createBlogController = async (req, res) => {
  console.log(req.session);

  const { title, textBody } = req.body;
  const userId = req.session.user.userId;

  //data validation
  try {
    await BlogDataValidation({ title, textBody });
    await User.findUserWithKey({ key: userId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Blog data error",
      error: error,
    });
  }

  try {
    const blogDb = await createBlog({ title, textBody, userId });

    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = { createBlogController };
