import User from "../Models/UserModel.js";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "Muhammad Tayyab super secret key", {
    expiresIn: maxAge,
  });
};
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  console.log(err);
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user: user._id, created: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    // Fix: Pass email and password as separate arguments
    const user = await User.login(email, password);

    console.log(user);

    const token = createToken(user._id);

    // Fix: Removed `withCredentials`
    res.cookie("jwt", token, {
      httpOnly: true, // Secure the cookie
      maxAge: maxAge * 1000,
    });

    res.status(200).json({ user: user._id, created: true });
  } catch (err) {
    // Fix: Ensure `handleError` function exists
    console.log(err);
    const errors = handleErrors(err);

    // Fix: Set HTTP status for failed login
    res.status(400).json({ errors, created: false });
  }
};

export { register, login };
