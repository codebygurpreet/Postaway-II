// Import required packages
import express from "express";
import UserController from "./user.controller.js";
import validateUser from "../../middleware/validator.middleware.js";

// Initialize controller and router
const router = express.Router();
const userController = new UserController();

// Routes
// User registration
router.post("/signup", validateUser, (req, res, next) => userController.signUp(req, res, next));

// User login
router.post("/signin", (req, res, next) => userController.signIn(req, res, next));


// User for forgot password
router.post("/forget-password", (req, res, next) => userController.forgotPassword(req, res, next));

// User for reset password
router.post("/reset-password/:token", (req, res, next) => userController.ResetPasswordWithToken(req, res, next));

// User logout
router.post("/logout", (req, res, next) => userController.logout(req, res, next));


export default router;
