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
// Toggle like status for a specific post
// Purpose: Add or remove a like from a post
// Middleware: jwtAuth → ensures user is authenticated
router.post('/toggle/:id',
    jwtAuth,
    likeController.toggleLike
);

// Get all likes for a specific post
// Purpose: Retrieve all users who liked a post
// Middleware: none → public route
router.get('/:id',
    likeController.getAllLikesForPost
);

// (Optional) Delete all likes for a specific post
// Purpose: Remove all likes from a post
// Middleware: jwtAuth → ensures user is authenticated
// router.delete('/:id',
//     jwtAuth,
//     likeController.deleteLike
// );


// Export router :-
export default router;
