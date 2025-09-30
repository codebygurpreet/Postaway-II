// Like routes

// Import required packages :-
// Third-party packages
import express from 'express';

// Application modules
import LikeController from './like.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';

// Initialize router and controller :-
const router = express.Router();
const likeController = new LikeController();

// Routes :-
// Toggle like on a post
// Purpose: Add or remove like for a specific post
// Middleware: jwtAuth → ensures user is authenticated
router.post('/toggle/:id',
    jwtAuth,
    likeController.togglePostLike
);

// Get all likes for a post
// Purpose: Fetch all users who liked a specific post
// Middleware: public route → no authentication required
router.get('/:id',
    likeController.getPostLikes
);

// (Optional) Delete all likes for a post
// Purpose: Remove all likes for a specific post
// Middleware: jwtAuth → ensures user is authenticated
// router.delete('/:id',
//     jwtAuth,
//     likeController.removeAllPostLikes
// );

// Export router :-
export default router;
