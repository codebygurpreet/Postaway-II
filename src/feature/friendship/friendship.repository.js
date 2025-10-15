// Friendship Repository

// Import required packages :-
// Application modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

// Repository class
export default class FriendshipRepository {

    constructor() {
        this.collection = "friendships";
    }

    // <<< Get collection reference >>>
    getCollection = async () => {
        const db = getDB();
        return db.collection(this.collection);
    };

    // <<< Get friends of a user >>>
    getFriends = async (userId) => {
        const collection = await this.getCollection();

        const requests = await collection.find({
            status: "accepted",
            $or: [
                { userId: userId },
                { friendId: userId }
            ]
        }).toArray();

        return requests;
    };

    // <<< Get pending friend requests for a user >>>
    getPendingRequests = async (userId) => {
        const collection = await this.getCollection();

        const requests = await collection.find({
            friendId: userId,
            status: "pending",
        }).toArray();

        return requests;
    };

    // <<< Toggle friendship (send request / cancel request / unfriend) >>>
    toggleFriendship = async (friendship) => {
        const collection = await this.getCollection();

        const userId = friendship.userId;
        const friendId = friendship.friendId;

        // Check if friendship already exists
        const existing = await collection.findOne({
            $or: [
                { userId, friendId },
                { userId: friendId, friendId: userId }
            ]
        });

        // Case 1: No friendship → create request
        if (!existing) {
            const result = await collection.insertOne(friendship);
            return {
                message: "Friendship request sent",
                data: { ...friendship, _id: result.insertedId },
            };
        }

        // Case 2: Pending → cancel request
        if (existing.status === "pending") {
            await collection.deleteOne({ _id: existing._id });
            return {
                message: "Friendship request cancelled",
                data: existing,
            };
        }

        // Case 3: Accepted → unfriend
        if (existing.status === "accepted") {
            await collection.deleteOne({ _id: existing._id });
            return {
                message: "Friend removed",
                data: existing,
            };
        }

        // No condition met → return null
        return null;
    };

    // <<< Respond to friend request (accpet / reject) >>>
    responseToRequest = async (userId, friendId, action) => {
        const collection = await this.getCollection();

        const requesterId = friendId;
        const receiverId = userId;

        // Check if pending friendship exists
        const existing = await collection.findOne({
            userId: requesterId, friendId: receiverId, status: "pending"
        });

        if (!existing) return null;

        // Accept → update to accepted
        if (action === "accept") {
            await collection.updateOne(
                { _id: existing._id },
                { $set: { status: "accepted", updatedAt: new Date() } }
            );
            return {
                message: "Friend request accepted",
                data: { ...existing, status: "accepted" },
            };
        }

        // Reject → delete the friendship
        if (action === "reject") {
            await collection.deleteOne({ _id: existing._id });
            return {
                message: "Friend request rejected",
                data: existing,
            };
        }

        return null;
    };
}
