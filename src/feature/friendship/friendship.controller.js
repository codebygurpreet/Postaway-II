// imported modules
import FriendshipRepository from "./friendship.repository.js";
import ApplicationError from "../../../utils/applicationError.js";

import UserRepository from "../user/user.repository.js";
import { ObjectId } from "mongodb";

// controller class
export default class FriendshipController {

    constructor() {
        this.friendshipRepository = new FriendshipRepository();
        this.userRepository = new UserRepository();
    }

    getFriends = async (req, res, next) => {
        try {
            // logic to get friends
        } catch (err) {
            next(err);
        }

    }

    getPendingRequests = async (req, res, next) => {
        try {
            // logic to get pending requests

        } catch (err) {
            next(err);
        }
    }

    toggleFriendship = async (req, res, next) => {
        try {
            const userId = new ObjectId(req.userID);
            const friendId = new ObjectId(req.params.friendId);

            // Prevent self-friendship
            if (userId.equals(friendId)) {
                throw new ApplicationError('You cannot add yourself as a friend', 400);
            }

            const friend = await this.userRepository.getUserById(friendId);
            if (!friend) {
                throw new ApplicationError('Friend user not found', 404);
            };

            // further logic to toggle friendship
            const result = await this.friendshipRepository.toggleFriendship(userId, friendId);

            res.status(200).json({
                success: true,
                message: result.message,
                data: result.data,
            });

        } catch (err) {
            next(err);
        }

    }

    responseToRequest = async (req, res, next) => {
        try {
            const userId = new ObjectId(req.userID);
            const friendId = new ObjectId(req.params.friendId);
            const action = req.body.action; // 'accept' or 'reject'
            
            if (!['accept', 'reject'].includes(action)) {
                throw new ApplicationError('Invalid action. use "accept" or "reject".', 400);
            }
            
            const friend = await this.userRepository.getUserById(friendId);
            if (!friend) {
                throw new ApplicationError('Friend user not found', 404);
            };

            // further logic to respond to friend request
            const result = await this.friendshipRepository.responseToRequest(userId, friendId, action);

            res.status(200).json({
                success: true,
                message: result.message,
                data: result,
            });

        } catch (err) {
            next(err);
        }
    }

}