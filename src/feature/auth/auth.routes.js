// Auth routes 

// Import required packages :-
// Third-party packages
import express from "express";

// Application modules 
import AuthController from "./auth.controller.js";
import validateUser from "../../middleware/validator.middleware.js";
import jwtAuth from "../../middleware/jwt.middleware.js";


// Initialize router and controller :-
const router = express.Router();
const authController = new AuthController();


// Routes :-
// User registration or signup
// Purpose: Register a new user
// Middleware: validateUser → ensures body has required fields
router.post("/signup",
    validateUser,
    authController.signUp
);

// User login or signin
// Purpose: Authenticate user and provide a token
router.post("/signin",
    authController.signIn
);

// user router for logout from current device
// Purpose: Logout user from current device
// Middleware: jwtAuth → ensures user is authenticated
router.post("/logout",
    jwtAuth,
    authController.logout
);

// user router for logout from all devices
// Purpose: Logout user from all devices
// Middleware: jwtAuth → ensures user is authenticated
router.post("/logout-all-devices",
    jwtAuth,
    authController.logoutAll
);

// Send OTP to user
// Purpose: Send OTP to user's email for password reset
router.post("/otp/send",
    authController.sendOtp
);

// Verify OTP
// Purpose: Verify the OTP sent to user's
router.post("/otp/verify",
    authController.verifyOtp
);

// Reset password using OTP
// Purpose: Reset user's password using the verified OTP
router.post("/otp/reset-password",
    authController.resetPasswordWithOtp
);

// Export router
export default router;
