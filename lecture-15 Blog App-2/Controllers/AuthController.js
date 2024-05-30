const bcrypt = require("bcryptjs");

const User = require("../Models/UserModel");
const { userDataValidation } = require("../Utils/AuthUtil");

const registerController = async (req, res) => {
  console.log(req.body);
  const { name, email, username, password } = req.body;

  //data validation
  try {
    await userDataValidation({ email, username, name, password });
  } catch (error) {
    return res.send({
      status: 400,
      message: "User data invalid",
      error: error,
    });
  }

  // username and email already exist

  // store data in DB
  const userObj = new User({ name, email, username, password });

  try {
    await userObj.emailAndUsernameExist();
  } catch (error) {
    return res.send({
      status: 400,
      message: "User already exist",
      error: error,
    });
  }

  try {
    const userDb = await userObj.userRegistration();
    console.log(userDb);
    return res.send({
      status: 201,
      message: "User register successfully",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const loginController = async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password)
    return res.send({
      status: 400,
      message: "user credentials are missing",
    });

  //find the user with loginId

  try {
    const userDb = await User.findUserWithKey({ loginId });
    console.log("line 64", userDb.password, password);

    const isMatch = await bcrypt.compare(password, userDb.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.send({
        status: 400,
        message: "Incorrect password",
      });
    }

    console.log(req.session);
    req.session.isAuth = true;
    req.session.user = {
      user_id: userDb._id,
      email: userDb.email,
      username: userDb.username,
    };

    return res.send({
      status: 200,
      message: "Login successfull",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const logoutController = (req, res) => {
  console.log(req.session.id);

  req.session.destroy((err) => {
    if (err) {
      return res.send({
        status: 500,
        message: "Logout unsuccessfull",
      });
    }
    return res.send({
      status: 200,
      message: "logout successfull",
    });
  });
};

module.exports = { registerController, loginController, logoutController };
