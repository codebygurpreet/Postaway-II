// Import required packages
import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';


// Initialize controller and router
const router = express.Router();
const userController = new UserController();


// Routes
// get user
router.get('/get-details/:userId', jwtAuth, (req, res, next)=> userController.getUser(req, res, next));

export default router
