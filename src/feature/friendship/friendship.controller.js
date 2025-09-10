// imported modules
import FriendshipRepository from "./friendship.repository.js";
import ApplicationError from "../../../utils/applicationError.js";

import UserRepository from "../user/user.repository.js";

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
            // logic to toggle friendship
            const userId = req.userID;
            const { friendId } = req.params;
            if (userId === friendId) {
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
                message: 'Friendship status toggled successfully',
                data: result,
            })
        } catch (err) {
            next(err);
        }

    }

    responseToRequest = async (req, res, next) => {
        try {
            // logic to respond to a friend request

        } catch (err) {
            next(err);
        }
    }

}