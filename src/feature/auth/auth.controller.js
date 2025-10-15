// Auth Controller

// Import required packages :-
// Third-party packages
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Application modules 
import AuthModel from "./auth.model.js";
import AuthRepository from "./auth.repository.js";
import ApplicationError from "../../../utils/applicationError.js";
import sendEmail from '../../../services/email.service.js';
import { setAuthCookies, clearAuthCookies } from '../../../utils/cookies.js';


// Auth Controller class
export default class AuthController {
  // Initialize repository
  constructor() {
    this.authRepository = new AuthRepository();
  }


  // <<< User registration or signup >>>
  signUp = async (req, res, next) => {
    try {
      const { name, email, password, gender } = req.body;

      if (!name || !email || !password || !gender) {
        throw new ApplicationError("All fields are required", 400);
      }

      if (!req.file) throw new ApplicationError("Avatar Image is required", 400);


      // Validate gender input
      let allowedGenders = ["male", "female", "other"];
      if (!allowedGenders.includes(gender.toLowerCase())) {
        throw new ApplicationError("Invalid gender", 400);
      }


      // check if user already exists in db
      const existingUser = await this.authRepository.findByEmail(email.toLowerCase());
      if (existingUser) {
        throw new ApplicationError("User already exists with this email", 409);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user instance
      const user = new AuthModel(name, email.toLowerCase(), hashedPassword, gender.toLowerCase(), req.file.filename);

      // Save user to database
      const result = await this.authRepository.signUp(user)
      console.log("result :", result);

      // Generate tokens
      const { accessToken, expiresIn } = await generateAccessToken(result);
      const refreshToken = await generateRefreshToken(result, this.authRepository);
      console.log("accessToken, refreshToken :", accessToken, refreshToken);

      // Store refresh token in database
      // await this.authRepository.addRefreshToken(result._id, refreshToken);

      setAuthCookies(res, accessToken, expiresIn, refreshToken);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: result._id,
          name: result.name,
          gender: result.gender,
          email: result.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }


  // <<< User login or signin >>>
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApplicationError("Email and password are required", 400);
      }

      // find user by email from db
      const user = await this.authRepository.findByEmail(email.toLowerCase());
      if (!user) {
        throw new ApplicationError("User not Found", 404);
      }

      // compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new ApplicationError("Invalid credentials", 401);
      }

      // generate tokens
      const { accessToken, expiresIn } = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user, this.authRepository);

      // store refresh token in db
      // await this.authRepository.addRefreshToken(user._id, refreshToken);

      setAuthCookies(res, accessToken, expiresIn, refreshToken);

      return res.status(200).json({
        message: "Login successful",
        user: {
          success: true,
          message: "Login successful",
          id: user._id,
          name: user.name,
        },
      });
    } catch (err) {
      next(err);
    }
  }


  // <<< User logout from current device >>>
  logout = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      // if no refresh token in cookies
      if (!refreshToken) {
        throw new ApplicationError("Refresh token missing", 400);
      }

      // remove refresh token
      if (refreshToken) {
        await this.authRepository.removeRefreshToken(req.userID, refreshToken);
        clearAuthCookies(res);
      };

      // send response
      return res.status(200).json({
        success: true,
        message: "Logged out successfully"
      });
    } catch (err) {
      next(err);
    }
  }


  // <<< User logout from all devices >>>
  logoutAll = async (req, res, next) => {
    try {
      const userId = req.userID;
      if (!userId) {
        throw new ApplicationError("User ID required", 400);
      };

      await this.authRepository.removeAllRefreshToken(userId);
      await this.authRepository.incrementTokenVersion(userId);

      clearAuthCookies(res);

      return res.status(200).json({
        success: true,
        message: "Logged out from all devices"
      });
    } catch (err) {
      next(err);
    }
  }


  // <<< Send OTP to user email for password reset >>>
  sendOtp = async (req, res, next) => {
    try {
      const { email } = req.body;

      // checking first whether user is exist in the db or not
      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        throw new ApplicationError("User not Found", 404);
      };

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // Set OTP expiry time (10 minutes from now)
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      // Store OTP and expiry in the database
      await this.authRepository.setOtp(email, otp, otpExpiry);

      // Send OTP to user's email
      await this.sendOtpEmail(email, otp);

      return res.status(200).json({ message: "OTP sent to email" })
    } catch (err) {
      next(err);
    }
  }


  // <<< Verify OTP for password reset >>>
  verifyOtp = async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      const user = await this.authRepository.findByEmail(email);
      // Check if OTP matches and is not expired
      if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
        throw new ApplicationError("Invalid or expired OTP", 404);
      };

      const resetToken = crypto.randomBytes(32).toString("hex");

      const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

      await this.authRepository.setResetToken(email, resetToken, resetTokenExpiry);
      await this.authRepository.clearOtp(email);


      return res.status(200).json({
        message: "OTP verified successfully",
        resetToken
      });

    } catch (err) {
      next(err)
    }
  }


  // <<< Reset Password using OTP >>>
  resetPasswordWithOtp = async (req, res, next) => {
    try {
      const { email, newPassword, resetToken } = req.body;
      if (!newPassword || !resetToken) {
        throw new ApplicationError("Reset token and new password are required", 400);
      };

      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        throw new ApplicationError("User not Found", 404);
      };

      if (!user.resetToken || user.resetToken !== resetToken || Date.now() > user.resetTokenExpiry) {
        throw new ApplicationError("Invalid or expired reset token", 400);
      };

      // Hash the new password before storing
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update the user's password in the database
      await this.authRepository.updatePassword(email, hashedPassword);

      res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
      res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });

      return res.status(200).json({ message: "Password reset successful. Please sign in again to continue." });
    } catch (err) {
      next(err);
    }
  }




  // --- utility function ---
  refreshToken = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

      let payload;
      try { payload = jwt.verify(refreshToken, process.env.JWT_SECRET); }
      catch { return res.status(401).json({ error: "Invalid or expired refresh token" }); }

      const user = await this.authRepository.findById(payload.userID);
      if (!user || !user.refreshTokens.includes(refreshToken)) return res.status(401).json({ error: "Refresh token revoked" });

      const { accessToken, expiresIn } = generateAccessToken(user);

      setAuthCookies(res, accessToken, expiresIn); // no need to set refresh token again
      res.status(200).json({ success: true, message: "Access token refreshed" });
    } catch (err) {
      next(err);
    }
  };


  // Send Otp to Email using application sendEmail module
  sendOtpEmail = async (email, otp) => {
    try {
      await sendEmail(
        email,
        otp,
        `Your OTP code is: ${otp}. It is valid for 10 minutes.`
      );
    } catch (err) {
      console.error("Error sending OTP email:", err);
      throw new ApplicationError("Failed to send OTP email", 400);
    }
  }


}


export const generateAccessToken = async (user) => {
  const accessToken = jwt.sign(
    { userID: user._id, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // short-lived
  );
  return { accessToken, expiresIn: 60 * 60 * 1000 };
};

export const generateRefreshToken = async (user, authRepository) => {
  const refreshToken = jwt.sign(
    { userID: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  await authRepository.addRefreshToken(user._id, refreshToken);
  return refreshToken;
};


