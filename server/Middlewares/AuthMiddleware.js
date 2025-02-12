import User from "../Models/UserModel.js";
import jwt from "jsonwebtoken";

const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    return jwt.verify(
      token,
      "Muhammad Tayyab super secret key",
      async (err, decodedToken) => {
        if (err) {
          res.json({ status: false });
          next();
        }
        const user = await User.findById(decodedToken.id);
        if (user) {
          res.json({ status: true, user: user.email });
        } else {
          res.json({ status: false });
          next();
        }
      }
    );
  } else {
    res.json({ status: false });
    next();
  }
};

export { checkUser };
