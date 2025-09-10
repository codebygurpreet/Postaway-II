// imported modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

import UserRepository from "../user/user.repository.js";
import FriendshipModel from "./friendship.model.js";

// repository class
export default class FriendshipRepository {

    constructor() {
        this.collection = 'friendships';
        this.userRepository = new UserRepository();
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

    toggleFriendship = async (userId, friendId) => {
        try {
            // write you code down here
            const collection = await this.getCollection();

            const existingFriendship = await collection.findOne({
                $or: [
                    { userId: new ObjectId(userId), friendId: new ObjectId(friendId) },
                    {
                        userId: new ObjectId(friendId),
                        friendId: new ObjectId(userId),
                    }
                ]
            });

            if (!existingFriendship) {
                const newFriendship = new FriendshipModel(new ObjectId(userId), new ObjectId(friendId), 'pending');
                const result = await collection.insertOne(newFriendship);
                return result;
            }

            if (existingFriendship.status === 'accepted') {
                const result = await collection.deleteOne({
                    _id: new ObjectId(existingFriendship._id)
                });
                return result;
            }

            if (existingFriendship.status === 'pending') {
                if (existingFriendship.userId === userId) {
                    throw new Error('Friend request already sent');
                }
                const result = await collection.updateOne(
                    {
                        _id: new ObjectId(existingFriendship._id)
                    },
                    {
                        $set: {
                            status: 'accepted',
                            updatedAt: new Date()
                        }
                    }
                )
                return result;
            };
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
