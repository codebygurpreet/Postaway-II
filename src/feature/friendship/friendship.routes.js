// imported modules
import express from 'express';
import jwtAuth from '../../middleware/jwt.middleware.js';
import FriendshipController from './friendship.controller.js';

// create  instance
const router = express.Router(); 
const friendshipController = new FriendshipController();

// routes
// Get a user's friends
router.get('/get-friends/:userId', jwtAuth, friendshipController.getFriends);

// Get pending friend requests
router.get('/get-pending-requests', jwtAuth, friendshipController.getPendingRequests);

// Toggle friendship with another user
router.post('/toggle-friendship/:friendId', jwtAuth, friendshipController.toggleFriendship);

//  Accept or reject a friend request
router.post('/response-to-request/:friendId', jwtAuth, friendshipController.responseToRequest);

export default router;


