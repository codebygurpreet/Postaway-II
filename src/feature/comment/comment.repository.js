import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import CommentModel from "./comment.model.js";
import ApplicationError from "../../../utils/applicationError.js";

export default class CommentRepository {

    constructor() {
        // MongoDB collection name
        this.commentRepository = "comments";
    }

    async createComment(userID, postID, content) {
        try {
            const db = getDB();
            const collection = db.collection(this.commentRepository);

            // create comment object
            const newComment = new CommentModel(userID, postID, content);
            // commentcomment insert in mongoDB
            const result = await collection.insertOne(newComment);


            if (!result.acknowledged) {
                throw new ApplicationError("Failed to create comment", 500);
            }

            return newComment;
        } catch (err) {
            console.error("Error in createComment (Repository):", err.message);
            throw err; // Rethrow for controller to catch
        }
    }

    async getAllComment(postID, page, limit) {
        try {
            const db = getDB();
            const collection = db.collection(this.commentRepository);

            const skip = (page - 1) * limit;
            // Fetch comments with pagination
            const comments = await collection
                .find({ postID: postID })
                .skip(skip)
                .limit(limit)
                .toArray();

            if (!comments || comments.length === 0) {
                throw new ApplicationError("No comments found for this post", 404);
            }

            // Count total comments for pagination metadata
            const totalComments = await collection.countDocuments({ postID: postID });

            return {
                comments,
                totalComments,
                totalPages: Math.ceil(totalComments / limit),
                currentPage: page,
            };
        } catch (err) {
            console.error("Error in getAllComment (Repository):", err.message);
            throw err; // Rethrow for controller to catch
        }
    }

    async deleteComment(commentID, userID) {
        try {
            const db = getDB();
            const collection = db.collection(this.commentRepository);

            const result = await collection.deleteOne({ _id: new ObjectId(commentID), userID: userID });

            return result.deletedCount > 0;

        } catch (err) {
            console.error("Error in deleteComment (Repository):", err.message);
            throw err; // Rethrow for controller to catch
        }
    }
}