// imported modules
import FriendshipRepository from "./friendship.repository.js";
import ApplicationError from "../../../utils/applicationError.js";

// controller class
export default class FriendshipController {

    constructor() {
        this.friendshipRepository = new FriendshipRepository();
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