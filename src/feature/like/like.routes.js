// import required packages
import express from 'express';
import LikeController from './like.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';


// Initialize controller and router
const router = express.Router();
const likeController = new LikeController()

// Routes
// Add Like
router.post('/toggle/:id', jwtAuth, (req, res, next) =>  likeController.addLike(req, res, next));

// Retrieve all likes for a specific post
router.get('/:id', (req, res, next) => likeController.getAllLikesForPost(req, res, next));

// delete all likes for a specific post
// router.delete('/toggle/:postid', jwtAuth, likeController.deleteLike)

// // Toggle like status for a specific post
// router.get('/toggle/:postid',)

export default router;
