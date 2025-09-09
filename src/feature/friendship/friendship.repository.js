// imported modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

// repository class
export default class FriendshipRepository {

    constructor() {
        this.collection = 'friendships';
    }

    getCollection = async () => {
        const db = getDB();
        return db.collection(this.collection);
    }

    getFriends = async () => {
        try {
            // write you code down here
        } catch (err) {
            throw err;
        }
    };

    getPendingRequests = async () => {
        try {
            // write you code down here
        } catch (err) {
            throw err;
        }
    };

    toggleFriendship = async () => {
        try {
            // write you code down here
        } catch (err) {
            throw err;
        }
    };

    responseToRequest = async () => {
        try {
            // write you code down here
        } catch (err) {
            throw err;
        }
    };
}
