// User routes 

// Import required packages :-
// Third-party packages
import express from 'express';

// Application modules 
import UserController from './user.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';
import upload from '../../middleware/multer.middleware.js';


// Initialize router and controller :-
const router = express.Router();
const userController = new UserController();


// Routes :-
// Get user details by ID
// Purpose: Fetch a specific user's details
// Middleware: jwtAuth → ensures user is authenticated
router.get('/get-details/:userId',
    jwtAuth,
    userController.getUser
);

// Get all user details
// Purpose: Fetch details of all users
// Middleware: jwtAuth → ensures user is authenticated
router.get('/get-all-details',
    jwtAuth,
    userController.getAllUsers
);

// Update user details
// Purpose: Update details of a specific user
// Middleware: jwtAuth → ensures user is authenticated
router.put('/update-details/:userId',
    upload.single("avatar"),
    jwtAuth,
    userController.updateById
);

// Export router
export default router
