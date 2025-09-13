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

    getPendingRequests = async (userId) => {
        try {
            // write you code down here
            const collection = await this.getCollection();

            const requests = await collection.find({
                friendId: userId,
                status: { $in: ['pending'] },
            }).toArray();

            return requests

        } catch (err) {
            throw err;
        }
    };

    toggleFriendship = async (userId, friendId) => {
        try {
            // write you code down here
            const collection = await this.getCollection();

            // Check if friendship already exists
            const existingFriendship = await collection.findOne({
                $or: [
                    { userId: userId, friendId: friendId },
                    {
                        userId: friendId,
                        friendId: userId,
                    }
                ]
            });
            console.log(existingFriendship);

            // Case 1: No friendship → create request
            if (!existingFriendship) {
                const newFriendship = new FriendshipModel(userId, friendId, 'pending');
                const result = await collection.insertOne(newFriendship);
                return {
                    message: "Friendship request sent",
                    data: { ...newFriendship, _id: result.insertedId },
                };

            }

            // Case 2: Pending → cancel request
            if (existingFriendship.status === 'pending') {
                await collection.deleteOne({
                    _id: existingFriendship._id
                });
                return {
                    message: "Friendship request cancelled",
                    data: existingFriendship,
                };

            }

            // Case 3: Accepted → unfriend
            if (existingFriendship.status === 'accepted') {
                await collection.deleteOne({
                    _id: existingFriendship._id
                });
                return {
                    message: "Friend removed",
                    data: existingFriendship,
                };
            };

            return {
                message: "No action taken",
                data: existingFriendship,
            };

            // if (existingFriendship.status === 'pending') {
            //     if (existingFriendship.userId === userId) {
            //         throw new Error('Friend request already sent');
            //     }
            //     const result = await collection.updateOne(
            //         {
            //             _id: new ObjectId(existingFriendship._id)
            //         },
            //         {
            //             $set: {
            //                 status: 'accepted',
            //                 updatedAt: new Date()
            //             }
            //         }
            //     )
            // return result;
            // };
        } catch (err) {
            throw err;
        }
    };

    responseToRequest = async (userId, friendId, action) => {
        try {
            const collection = await this.getCollection();

            // Check if friendship already exists
            const existingFriendship = await collection.findOne({
                $or: [
                    {
                        userId: userId,
                        friendId: friendId,
                        status: "pending"
                    },
                    {
                        userId: friendId, friendId: userId,
                        status: "pending"
                    }
                ]
            });

            // Case 1: No friendship → throw error
            if (!existingFriendship) {
                return {
                    message: "No friendship request found",
                    data: null,
                }
            }

            // Case 2: Accept → update status to accepted
            if (existingFriendship.status === 'pending' && action === 'accept') {
                const result = await collection.updateOne(
                    {
                        _id: existingFriendship._id
                    },
                    {
                        $set: {
                            status: 'accepted',
                            updatedAt: new Date(),
                        }
                    });
                return result;
            }

            // Case 3: Reject → delete the friendship
            if (existingFriendship.status === 'pending' && action === 'reject') {
                await collection.deleteOne({
                    _id: existingFriendship._id
                })
                return {
                    message: "request rejected",
                    data: existingFriendship,
                };
            }

            return {
                message: "No action taken",
                data: existingFriendship,
            };

        } catch (err) {
            throw err;
        }
    };
}
