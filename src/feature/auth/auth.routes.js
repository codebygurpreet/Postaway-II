// Import required packages
import express from "express";
import AuthController from "./auth.controller.js";
import validateUser from "../../middleware/validator.middleware.js";
import jwtAuth from "../../middleware/jwt.middleware.js";

// Initialize controller and router
const router = express.Router();
const authController = new AuthController();

// Routes
// User registration
router.post("/signup", validateUser, (req, res, next) => authController.signUp(req, res, next));

// User login
router.post("/signin", (req, res, next) => authController.signIn(req, res, next));


// User for forgot password
router.post("/forget-password", (req, res, next) => authController.forgotPassword(req, res, next));

// User for reset password
router.post("/reset-password/:token", (req, res, next) => authController.ResetPasswordWithToken(req, res, next));

// user router for logout 
router.post("/logout", jwtAuth, (req, res, next) => authController.Logout(req, res, next));

// user router for logout 
router.post("/logout-all-devices", jwtAuth, (req, res, next) => authController.LogoutAll(req, res, next));


export default router;
