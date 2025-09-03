import ApplicationError from "../../../utils/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

export default class PostRepository {
    constructor() {
        this.collection = 'posts'
    }

    async createNewPost(newPost) {
        try {
            // 1. get db
            const db = getDB();
            // 2. collection
            const collection = db.collection(this.collection);
            // 3. add post
            await collection.insertOne(newPost);
        } catch (err) {
            throw new ApplicationError("Something went wrong with the database", 400)
        }
    }

    // 5. Get all posts (Pagination)
    async findAll(page, limit, caption) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);

            // Convert to numbers safely
            const pageNum = Math.max(1, parseInt(page, 10) || 1);
            const limitNum = Math.max(1, parseInt(limit, 10) || 10);

            // Build query
            const query = { status: { $nin: ["draft", "archived"] } };

            if (caption && caption.trim() !== "") {
                query.caption = { $regex: caption, $options: "i" }; // case-insensitive
            }

            // Count total
            const totalPosts = await collection.countDocuments(query);

            // Fetch posts with pagination
            const posts = await collection
                .find(query)
                .sort({ createdAt: -1 }) // newest first (optional)
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .toArray();

            return {
                posts,
                totalPosts,
                totalPages: totalPosts ? Math.ceil(totalPosts / limitNum) : 0,
                currentPage: pageNum,
            };
        } catch (err) {
            throw new ApplicationError("Error fetching posts: " + err.message, 500);
        }
    }

    async getPostById(postID) {
        try {
            // 1. get db
            const db = getDB();
            // 2. collection
            const collection = db.collection(this.collection);
            // 3. find post by id
            // Aggregation pipeline
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(postID),
                        status: { $nin: ["draft", "archived"] }, // exclude drafts directly
                    },
                },
                {
                    $limit: 1, // ensure only one doc is returned
                },
            ];

            const results = await collection.aggregate(pipeline).toArray();

            return results.length > 0 ? results[0] : null;
        } catch (err) {
            throw new ApplicationError("Error fetching post bye postID: " + err.message, 500);
        }
    }

    async getPostByUserCredentials(userID) {
        try {
            // 1. getting db
            const db = getDB();
            // 2. getting collection
            const collection = db.collection(this.collection);
            // Aggregation pipeline
            const pipeline = [
                {
                    $match: {
                        userID: userID,
                        status: { $nin: ["draft", "archived"] }
                    }
                },
            ];
            return await collection.aggregate(pipeline).toArray();
        } catch (err) {
            throw new ApplicationError("Error fetching post: " + err.message, 500);
        }
    }

    async deletePostById(postID, userID) {
        try {
            // 1. getting db
            const db = getDB();
            // 2. getting collection
            const collection = db.collection(this.collection);
            // 3. use remove()
            const result = await collection.deleteOne(
                {
                    _id: new ObjectId(postID),
                    userID: userID
                }
            )

            if (result.deletedCount === 0) {
                throw new ApplicationError("No matching post found to delete", 404);
            }
            
            return result;
        } catch (err) {
            throw new ApplicationError("Error fetching post: " + err.message, 500);
        }
    }

}