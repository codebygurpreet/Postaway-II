// Friendship routes

// Import required packages :-
// Third-party packages
import express from 'express';

// Application modules
import FriendshipController from './friendship.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';

// Initialize router and controller
const router = express.Router();
const friendshipController = new FriendshipController();

// Routes :-
// Get a user's friends
// Purpose: Fetch the friends list of a specific user
// Middleware: jwtAuth → ensures user is authenticated
router.get('/get-friends/:userId',
    jwtAuth,
    friendshipController.getFriends
);

// Get pending friend requests
// Purpose: Fetch all friend requests pending for the authenticated user
// Middleware: jwtAuth → ensures user is authenticated
router.get('/get-pending-requests',
    jwtAuth,
    friendshipController.getPendingRequests
);

// Toggle friendship with another user
// Purpose: Send a friend request or remove an existing friend
// Middleware: jwtAuth → ensures user is authenticated
router.post('/toggle-friendship/:friendId',
    jwtAuth,
    friendshipController.toggleFriendship
);

// Accept or reject a friend request
// Purpose: Respond to a pending friend request (accept or reject)
// Middleware: jwtAuth → ensures user is authenticated
router.post('/response-to-request/:friendId',
    jwtAuth,
    friendshipController.responseToRequest
);

// Export router
export default router;
