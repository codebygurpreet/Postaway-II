// Auth Repository

// Import required modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

export default class AuthRepository {
  constructor() {
    this.collection = "users";
  }

  getCollection = async () => {
    const db = getDB();
    return db.collection(this.collection);
  };

  // <<< Insert new user (Sign-Up) >>>
  signUp = async (newUser) => {
    try {
      const collection = await this.getCollection();
      newUser.tokenVersion = 0;
      await collection.insertOne(newUser);
      delete newUser.password;
      return newUser;
    } catch (err) {
      throw err;
    }
  };

  // <<< Find user by email >>>
  findByEmail = async (email) => {
    try {
      const collection = await this.getCollection();
      return await collection.findOne(
        { email },
        {
          projection: {
            password: 1,
            name: 1,
            email: 1,
            gender: 1,
            otp: 1,
            otpExpiry: 1,
            refreshTokens: 1,
            resetToken: 1,
            resetTokenExpiry: 1,
            tokenVersion: 1,
          },
        }
      );
    } catch (err) {
      throw err;
    }
  };

  // <<< Find user by ID >>>
  findById = async (userId) => {
    try {
      const collection = await this.getCollection();
      return await collection.findOne({ _id: new ObjectId(userId) });
    } catch (err) {
      throw err;
    }
  };

  // <<< Increment token version for logoutAll >>>
  incrementTokenVersion = async (userId) => {
    try {
      const collection = await this.getCollection();
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $inc: { tokenVersion: 1 } }
      );
      return true;
    } catch (err) {
      throw err;
    }
  };

  // <<< Add refresh token >>>
  addRefreshToken = async (userId, refreshToken) => {
    try {
      const collection = await this.getCollection();
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { refreshTokens: refreshToken } }
      );
    } catch (err) {
      throw err;
    }
  };

  // <<< Find user by refresh token >>>
  findByRefreshToken = async (refreshToken) => {
    try {
      const collection = await this.getCollection();
      return await collection.findOne({ refreshTokens: refreshToken });
    } catch (err) {
      throw err;
    }
  };

  // <<< Remove refresh token (Logout current device) >>>
  removeRefreshToken = async (userId, refreshToken) => {
    try {
      const collection = await this.getCollection();
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { refreshTokens: refreshToken } }
      );
    } catch (err) {
      throw err;
    }
  };

  // <<< Remove all refresh tokens (Logout all devices) >>>
  removeAllRefreshToken = async (userId) => {
    try {
      const collection = await this.getCollection();
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { refreshTokens: [] } }
      );
    } catch (err) {
      throw err;
    }
  };

  // <<< Set OTP and expiry for password reset >>>
  setOtp = async (email, otp, otpExpiry) => {
    try {
      const collection = await this.getCollection();
      return await collection.updateOne(
        { email },
        { $set: { otp, otpExpiry } }
      );
    } catch (err) {
      throw err;
    }
  };

  // <<< Clear OTP and expiry >>>
  clearOtp = async (email) => {
    try {
      const collection = await this.getCollection();
      return await collection.updateOne(
        { email },
        { $unset: { otp: 1, otpExpiry: 1 } }
      );
    } catch (err) {
      throw err;
    }
  };

  // <<< Set reset token and expiry >>>
  setResetToken = async (email, resetToken, resetTokenExpiry) => {
    try {
      const collection = await this.getCollection();
      return await collection.updateOne(
        { email },
        { $set: { resetToken, resetTokenExpiry } }
      );
    } catch (err) {
      throw err;
    }
  };

  // <<< Update password after OTP verification >>>
  updatePassword = async (email, newPassword) => {
    try {
      const collection = await this.getCollection();
      return await collection.updateOne(
        { email },
        {
          $set: { password: newPassword },
          $unset: {
            resetToken: 1,
            resetTokenExpiry: 1,
            otp: 1,
            otpExpiry: 1,
          },
        }
      );
    } catch (err) {
      throw err;
    }
  };
}
