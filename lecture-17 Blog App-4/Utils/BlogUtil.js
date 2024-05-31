const BlogDataValidation = ({ title, textBody }) => {
  return new Promise((resolve, reject) => {
    if (!title) reject("Blog Title is missing");
    if (!textBody) reject("Blog Body is missing");

    if (typeof title !== "string") reject("title is not a text");
    if (typeof textBody !== "string") reject("textBody is not a text");

    resolve();
  });
};

module.exports = { BlogDataValidation };
