// Comment routes

// Import required packages :-
// Third-party packages
import express from 'express';

// Application modules
import CommentController from './comment.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';

// Initialize router and controller :-
const router = express.Router();
const commentController = new CommentController();

// Routes :-
// Get all comments for a specific post
// Purpose: Fetch all comments of a post
// Middleware: jwtAuth → ensures user is authenticated
router.get('/:id',
    jwtAuth,
    commentController.getAllComment
);

// Add a new comment to a specific post
// Purpose: Create a comment for a post
// Middleware: jwtAuth → ensures user is authenticated
router.post('/:id',
    jwtAuth,
    commentController.createComment
);

// Delete a specific comment by ID
// Purpose: Remove a comment
// Middleware: jwtAuth → ensures user is authenticated
router.delete('/:id',
    jwtAuth,
    commentController.deleteComment
);

// Update a specific comment by ID
// Purpose: Edit a comment
// Middleware: jwtAuth → ensures user is authenticated
router.put('/:commentId',
    jwtAuth,
    commentController.updateComment
);

// Export router
export default router;
