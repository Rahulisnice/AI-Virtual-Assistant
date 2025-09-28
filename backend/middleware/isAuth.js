import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Token not found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(500).json({ message: "Is Auth Error" });
  }
};

export default isAuth;
