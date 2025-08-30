import AuthModel from "./auth.model.js";
import AuthRepository from "./auth.repository.js";
import ApplicationError from "../../../utils/applicationError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export default class AuthController {

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async signUp(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new ApplicationError("All fields are required", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new AuthModel(name, email, hashedPassword);
      // console.log(user);

      const existingUser = await this.authRepository.findByEmail(email);
      if (existingUser) {
        throw new ApplicationError("User already exists with this email", 409);
      }

      await this.authRepository.signUp(user)

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApplicationError("Email and password are required", 400);
      }

      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        throw new ApplicationError("User not Found", 404);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new ApplicationError("Invalid credentials", 401);
      }

      const token = jwt.sign(
        { userID: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        {
          userID: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      await this.authRepository.addRefreshToken(user._id, refreshToken);

      return res.status(200).json({
        message: "Login successful",
        token,
        refreshToken,
        expiresIn: "1h",
      });
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        throw new ApplicationError("user not found", 404)
      }
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

      // save token in mongodb
      await this.authRepository.setResetToken(user.email, resetToken, resetTokenExpiry);

      // create transportor
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
      })
      const resetLink = `http://localhost:3000/api/user/reset-password/${resetToken}`

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password reset Request",
        html: `<p>You requested a password reset</p>
        <p>Click here to reset: <a href="${resetLink}">${resetLink}</a></p>`
      })

      res.status(200).json({ message: "password reset link send to email" })
    } catch (err) {
      next(err);
    }
  }

  // Reset with token
  async ResetPasswordWithToken(req, res, next) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      // validate inputs
      if (!newPassword) {
        throw new ApplicationError("New password is required", 400);
      }

      // find user by token
      const user = await this.authRepository.findByResetToken(token);
      console.log(user);
      if (!user) {
        throw new ApplicationError("Token is invalid or expired", 400);
      }

      // hash password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await this.authRepository.updatePasswordWithToken(token, hashedPassword);

      return res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
      next(err);
    }
  }

  // logout
  async Logout(req, res, next) {
    try {
      const { refreshToken } = req.body;

      const user = await this.authRepository.findByRefreshToken(refreshToken);

      // user not found
      if (!user) {
        throw new ApplicationError("Invalid refresh token", 400);
      }

      await this.authRepository.removeRefreshToken(user._id, refreshToken);

      return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  }



  // logout all
  async LogoutAll(req, res, next) {
    try {
      const userId = req.userID;
      console.log(userId)

      // user not found
      if (!userId) {
        throw new ApplicationError("User ID required", 400);
      }
      await this.authRepository.removeAllRefreshToken(userId);

      return res.status(200).json({ message: "Logged out from all devices" });
    } catch (err) {
      next(err);
    }
  }

}
