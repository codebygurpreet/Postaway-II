// import required packages
import express from 'express';
import CommentController from './comment.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';


// Initialize controller and router
const router = express.Router();
const commentController = new CommentController();

// Routes

// GET /:id - Retrieve all comments for a specific post
// router.get("/:id", jwtAuth, commentController.getAllComment)

// POST /:id - Add a new comment to a specific post
router.post('/:id', jwtAuth, (req,res,next)=> commentController.createComment(req,res,next));

// // DELETE /:id - Delete a specific comment by ID
// router.delete('/:id', jwtAuth, commentController.deleteComment)

// // PUT /:id - Update a specific comment by ID
// router.put('/:id', jwtAuth, commentController.updateComment)

export default router;
