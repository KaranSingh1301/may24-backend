const UserSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcryptjs");

const User = class {
  constructor({ name, email, username, password }) {
    this.email = email;
    this.name = name;
    this.username = username;
    this.password = password;
  }

  userRegistration() {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await bcrypt.hash(
        this.password,
        Number(process.env.SALT)
      );

      const user = new UserSchema({
        name: this.name,
        email: this.email,
        username: this.username,
        password: hashedPassword,
      });

      try {
        const userDb = await user.save();
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  emailAndUsernameExist() {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await UserSchema.findOne({
          $or: [{ email: this.email }, { username: this.username }],
        });

        if (userDb && userDb.email === this.email) reject("Email Exist");
        if (userDb && userDb.username === this.username)
          reject("Username Exist");

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserWithKey({ loginId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await UserSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        }).select("+password");

        if (!userDb) reject("User not found");

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;
