import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import LikeModel from "./like.model.js";

export default class LikeRepository {

    constructor() {
        this.collection = "likes";
    }

    async findLike(userID, postID) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);

            const like = await collection.findOne({ userID: new ObjectId(userID), postID: new ObjectId(postID) });

            return like;

        } catch (err) {
            throw err;
        }
    }

    async addLike(userID, postID) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);

            const newLikeObj = new LikeModel(new ObjectId(userID), new ObjectId(postID));

            const result = await collection.insertOne(newLikeObj);
            return result;
        } catch (err) {
            throw err;
        }

    }

    async removeLike(userID, postID) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);

            const result = await collection.deleteOne({
                userID: new ObjectId(userID),
                postID: new ObjectId(postID)
            });
            return result;
        } catch (err) {
            throw err;
        }

    }

    async getAllLikesForPost(postID) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);

            const allLikes = await collection.find({
                postID: new ObjectId(postID)
            }).toArray();
            return allLikes;
        } catch (err) {
            throw err;
        }

    }
}