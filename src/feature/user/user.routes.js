// Import required packages
import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';


// Initialize controller and router
const router = express.Router();
const userController = new UserController();


// Routes
// get - user details
router.get('/get-details/:userId', jwtAuth, (req, res, next) => userController.getUser(req, res, next));

// get - all user details
router.get('/get-all-details', jwtAuth, (req, res, next) => userController.getAllUsers(req, res, next));

// post - update user details
router.post('/update-details/:userId', jwtAuth, (req, res, next) => userController.updateById(req, res, next));

export default router
