// Auth Controller

// Import required packages :-
// Third-party packages
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Application modules 
import AuthModel from "./auth.model.js";
import AuthRepository from "./auth.repository.js";
import ApplicationError from "../../../utils/applicationError.js";
import sendEmail from '../../../services/email.service.js';


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

      const existingUser = await this.authRepository.findByEmail(email);
      if (existingUser) {
        throw new ApplicationError("User already exists with this email", 409);
      }
      console.log("existingUser :", existingUser);

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user instance
      const user = new AuthModel(name, email, hashedPassword, gender);

      // Save user to database
      const result = await this.authRepository.signUp(user)
      console.log("result :", result);

      // Generate tokens
      const { accessToken, refreshToken, expiresIn } = await this.generateTokens(result);

      // Store refresh token in database
      await this.authRepository.addRefreshToken(result._id, refreshToken);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: result._id,
          name: result.name,
          gender: result.gender,
          email: result.email,
        },
        accessToken,
        refreshToken,
        expiresIn,

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

      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        throw new ApplicationError("User not Found", 404);
      }

      // compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new ApplicationError("Invalid credentials", 401);
      }

      // generate token
      const { accessToken, refreshToken, expiresIn } = await this.generateTokens(user);

      // store refresh token in db
      await this.authRepository.addRefreshToken(user._id, refreshToken);

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
        },
        accessToken,
        refreshToken,
        expiresIn,
      });
    } catch (err) {
      next(err);
    }
  }


  // <<< User logout from current device >>>
  logout = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      // validate inputs
      if (!refreshToken) {
        throw new ApplicationError("Refresh token is required", 400);
      }

      // find user by refresh token from db
      const user = await this.authRepository.findByRefreshToken(refreshToken);
      if (!user) {
        throw new ApplicationError("Invalid refresh token", 400);
      }

      // remove refresh token from db
      await this.authRepository.removeRefreshToken(user._id, refreshToken);

      return res.status(200).json({ message: "Logged out successfully" });
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

      // remove all refresh tokens from db
      await this.authRepository.removeAllRefreshToken(userId);

      return res.status(200).json({ message: "Logged out from all devices" });
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

      // Clear OTP from database after successful verification
      await this.authRepository.clearOtp(email);

      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
      next(err)
    }
  }


  // <<< Reset Password using OTP >>>
  resetPasswordWithOtp = async (req, res, next) => {
    try {
      const { email, newPassword } = req.body;
      if (!newPassword) {
        throw new ApplicationError("New password is required", 400);
      };

      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        throw new ApplicationError("User not Found", 404);
      };

      // Hash the new password before storing
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update the user's password in the database
      await this.authRepository.updatePassword(email, hashedPassword);

      return res.status(200).json({ message: "Password reset successful" });

    } catch (err) {
      next(err);
    }
  }




  // --- utility function ---
  // Generate JWT tokens
  generateTokens = async (user) => {
    const accessToken = jwt.sign(
      { userID: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userID: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken, expiresIn: "1h" };
  }

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






// async forgotPassword(req, res, next) {
//   try {
//     const { email } = req.body;
//     const user = await this.authRepository.findByEmail(email);
//     if (!user) {
//       throw new ApplicationError("user not found", 404)
//     }
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

//     // save token in mongodb
//     await this.authRepository.setResetToken(user.email, resetToken, resetTokenExpiry);

//     // create transportor
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       },
//     })
//     const resetLink = `http://localhost:3000/api/user/reset-password/${resetToken}`

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: "Password reset Request",
//       html: `<p>You requested a password reset</p>
//       <p>Click here to reset: <a href="${resetLink}">${resetLink}</a></p>`
//     })

//     res.status(200).json({ message: "password reset link send to email" })
//   } catch (err) {
//     next(err);
//   }
// }

// // Reset with token
// async ResetPasswordWithToken(req, res, next) {
//   try {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     // validate inputs
//     if (!newPassword) {
//       throw new ApplicationError("New password is required", 400);
//     }

//     // find user by token
//     const user = await this.authRepository.findByResetToken(token);
//     console.log(user);
//     if (!user) {
//       throw new ApplicationError("Token is invalid or expired", 400);
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(newPassword, 12);

//     await this.authRepository.updatePasswordWithToken(token, hashedPassword);

//     return res.status(200).json({ message: "Password reset successful" });
//   } catch (err) {
//     next(err);
//   }
// }


