// Friendship Controller

// Import required packages :-
// Application modules
import FriendshipRepository from "./friendship.repository.js";
import UserRepository from "../user/user.repository.js";
import ApplicationError from "../../../utils/applicationError.js";
import FriendshipModel from "./friendship.model.js";

// Friendship Controller class
export default class FriendshipController {

    constructor() {
        this.friendshipRepository = new FriendshipRepository();
        this.userRepository = new UserRepository();
    }

    // <<< Get all friends >>>
    getFriends = async (req, res, next) => {
        try {
            const userId = req.params.userId;

            const friends = await this.friendshipRepository.getFriends(userId);
            if (!friends || friends.length === 0) {
                throw new ApplicationError("No friends found", 404);
            }

            res.status(200).json({
                success: true,
                message: "Friends retrieved successfully",
                data: friends,
            });

        } catch (err) {
            next(err);
        }
    };

    // <<< Get pending friend requests >>>
    getPendingRequests = async (req, res, next) => {
        try {
            const userId = req.userID.toString();

            const requests = await this.friendshipRepository.getPendingRequests(userId);
            if (!requests || requests.length === 0) {
                throw new ApplicationError("No pending friend requests", 404);
            }

            res.status(200).json({
                success: true,
                message: "Pending friend requests retrieved successfully",
                data: requests,
            });

        } catch (err) {
            next(err);
        }
    };

    // <<< Toggle friendship (add / cancel / unfriend) >>>
    toggleFriendship = async (req, res, next) => {
        try {
            const userId = req.userID;
            const friendId = req.params.friendId;

            // Prevent self-friendship
            if (userId.toString() === friendId) {
                throw new ApplicationError("You cannot add yourself as a friend", 400);
            }

            // Check if friend user exists
            const friend = await this.userRepository.getUserById(friendId);
            if (!friend) {
                throw new ApplicationError("Friend user not found", 404);
            }

            // Create friendship object using model
            const friendship = new FriendshipModel(userId, friendId, "pending");

            // Toggle friendship logic (add/cancel/unfriend)
            const result = await this.friendshipRepository.toggleFriendship(friendship);
            if (!result) {
                throw new ApplicationError("Failed to process friendship request", 500);
            }

            res.status(200).json({
                success: true,
                message: result.message,
                data: result.data,
            });

        } catch (err) {
            next(err);
        }
    };

    // <<< Respond to friend request >>>
    responseToRequest = async (req, res, next) => {
        try {
            const userId = req.userID;
            const friendId = req.params.friendId;
            const action = req.body.action; // 'accept' or 'reject'

            if (!["accept", "reject"].includes(action)) {
                throw new ApplicationError('Invalid action. Use "accept" or "reject".', 400);
            }

            // Check if friend user exists
            const friend = await this.userRepository.getUserById(friendId);
            if (!friend) {
                throw new ApplicationError("Friend user not found", 404);
            }

            // Only the receiver (userId) can accept/reject a pending request sent by friendId
            const result = await this.friendshipRepository.responseToRequest(userId, friendId, action);
            if (!result) {
                throw new ApplicationError("No friendship request found", 404);
            }

            res.status(200).json({
                success: true,
                message: result.message,
                data: result.data,
            });

        } catch (err) {
            next(err);
        }
    };
}
