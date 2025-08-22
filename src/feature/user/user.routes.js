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

export default router;
