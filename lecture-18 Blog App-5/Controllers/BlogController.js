const User = require("../Models/UserModel");

const {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  findBlogWithId,
  editBlogWithId,
  deleteBlogWithId,
} = require("../Models/BlogModel");
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

const readBlogsController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;

  //get all the blogs
  try {
    const blogDb = await getAllBlogs({ SKIP });

    if (blogDb.length === 0) {
      return res.send({
        status: 203,
        message: "No blogs found",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
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

const readMyBlogsController = async (req, res) => {
  const userId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  try {
    const myBlogsDb = await getMyBlogs({ userId, SKIP });

    if (myBlogsDb.length === 0) {
      return res.send({
        status: 203,
        message: "No blogs found",
      });
    }
    return res.send({
      status: 200,
      message: "Read success",
      data: myBlogsDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

// data : { title, textBody}
// blogId
// userId
const editBlogController = async (req, res) => {
  console.log(req.body);
  const { title, textBody } = req.body.data;
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    await BlogDataValidation({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid data",
      errro: error,
    });
  }

  //find the blog with blogId

  try {
    const blogDb = await findBlogWithId({ blogId });

    //compare the ownership

    // id1.equals(id2)
    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 403,
        message: "Not allow to edit the blog",
      });
    }

    //check for 30 mins
    console.log((Date.now() - blogDb.creationDateTime) / (1000 * 60));

    const diff = (Date.now() - blogDb.creationDateTime) / (1000 * 60);

    if (diff > 30) {
      return res.send({
        status: 400,
        message: "Not allow to edit the blog after 30 mins of creation",
      });
    }

    //edit the blog in db
    const blogPrevDb = await editBlogWithId({ blogId, title, textBody });

    return res.send({
      status: 200,
      message: "Blog Updated successfully",
      data: blogPrevDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
};

const deleteBlogController = async (req, res) => {
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  if (!userId)
    return res.send({
      status: 400,
      message: "missing userId",
    });

  try {
    const blogDb = await findBlogWithId({ blogId });

    //check owner
    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 403,
        message: "Not allow to delete a blog",
      });
    }

    const blogPrevDb = await deleteBlogWithId({ blogId });

    return res.send({
      status: 200,
      message: "Delete success",
      data: blogPrevDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  createBlogController,
  readBlogsController,
  readMyBlogsController,
  editBlogController,
  deleteBlogController,
};
