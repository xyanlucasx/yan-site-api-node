const jwt = require("jsonwebtoken");
const { compareHash } = require("../utils/hashBcrypt");
const User = require("../models/User");


const authentication = async (body) => {
  try {
    const user = await User.find({name: body.name})

    if (!user[0]) throw new Error("User not found");

    const correctPass = await compareHash(body.password, user[0].password);

    if (!correctPass) throw new Error("Incorrect password");

    const oneHourInMs = Math.floor(Date.now() / 1000) + 60 * 60;

    const payload = {
      name: user[0].name,
      id: user[0]._id,
      exp: oneHourInMs * 100000
    };

    const jwtSecret = process.env.JWT_SECRET;

    const jwtToken = jwt.sign(payload, jwtSecret);

    return { token: jwtToken, payload };
  } catch (e) {
    console.log(e);
    throw new Error("Authentication error");
  }
};

module.exports = {
  authentication,
};