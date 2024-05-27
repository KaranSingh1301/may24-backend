const registerController = (req, res) => {
  console.log("here register");
  return res.send("all ok register");
};

const loginController = (req, res) => {
  console.log("here login");
  return res.send("all ok login");
};

module.exports = { registerController, loginController };
