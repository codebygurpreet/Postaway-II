// imported required packages
import jwt from "jsonwebtoken";
import AuthRepository from "../feature/auth/auth.repository.js";

const authRepository = new AuthRepository();

const jwtAuth = async (req, res, next) => {

  // 1. read the tokens either from coockies or from the authorization headers
  const token = req.cookies.accessToken;

  // 2. checking if token is provided
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") token = parts[1];
  }

  if (!token) return res.status(401).json({ error: "Unauthorized, token missing" });

  // 3. check if the token is valid
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authRepository.findById(payload.userID);
    
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ error: "Unauthorized, token invalidated" });
    }

    req.userID = user._id;
    req.user = user;
    next();


  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({ error: message });
  }
};

export default jwtAuth;