const BlogSchema = require("../Schemas/BlogSchema");
const { LIMIT } = require("../privateConstants");

const createBlog = ({ title, textBody, userId }) => {
  return new Promise(async (resolve, reject) => {
    const blogObj = new BlogSchema({
      title: title,
      textBody: textBody,
      userId: userId,
      creationDateTime: Date.now(),
    });
    try {
      const blogDb = await blogObj.save();
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getAllBlogs = ({ SKIP }) => {
  return new Promise(async (resolve, reject) => {
    //skip, limit, sort
    console.log(SKIP, typeof SKIP);
    try {
      const blogDb = await BlogSchema.aggregate([
        {
          $sort: { creationDateTime: -1 }, //-1 for DESC, 1 ASCD
        },
        {
          $skip: SKIP,
        },
        {
          $limit: LIMIT,
        },
      ]);

      console.log(blogDb);
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getMyBlogs = ({ userId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    // sort, match, pagination

    try {
      const myBlogsDb = await BlogSchema.aggregate([
        {
          $match: { userId: userId },
        },
        {
          $sort: { creationDateTime: -1 },
        },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);

      console.log(myBlogsDb[0].data);
      resolve(myBlogsDb[0].data);
    } catch (error) {
      reject(error);
    }
  });
};

const findBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    if (!blogId) reject("missing blogId");
    try {
      const blogDb = await BlogSchema.findOne({ _id: blogId }); //new ObjectId(blogId), BSON error
      if (!blogDb) reject(`Blog not found with blogId : ${blogId}`);

      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const editBlogWithId = ({ blogId, title, textBody }) => {
  return new Promise(async (resolve, reject) => {
    const newBlogData = {};
    if (title) newBlogData.title = title;

    if (textBody) newBlogData.textBody = textBody;
    console.log(textBody);
    try {
      const prevBlogDb = await BlogSchema.findOneAndUpdate(
        { _id: blogId },
        newBlogData
      );

      resolve(prevBlogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prevBlogDb = await BlogSchema.findOneAndDelete({ _id: blogId });
      resolve(prevBlogDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  findBlogWithId,
  editBlogWithId,
  deleteBlogWithId,
};

// 1970 ------------------------->t0
// 1970 -------------------------------t1
