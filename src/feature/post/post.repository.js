// Post Repository

// Import required packages :-
// Application modules
import ApplicationError from "../../../utils/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

// Post Repository class
export default class PostRepository {
  // Initialize collection
  constructor() {
    this.collection = 'posts';
  }

  // method to get collection
  getCollection = () => {
    const db = getDB();
    return db.collection(this.collection);
  };


  // <<< Create new post >>>
  async createNewPost(newPost) {
    try {
      const collection = this.getCollection();

      // insert new post
      await collection.insertOne(newPost);
    } catch (err) {
      throw new ApplicationError("Something went wrong with the database", 400);
    }
  }


  // <<< Get all posts (with pagination and optional caption filter) >>>
  async findAll(page, limit, caption) {
    try {
      const collection = this.getCollection();

      // Parse pagination inputs
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);

      // Build query to exclude draft/archived
      const query = { status: { $nin: ["draft", "archived"] } };

      // Add caption filter if provided
      if (caption && caption.trim() !== "") {
        query.caption = { $regex: caption, $options: "i" };
      }

      // Count total documents
      const totalPosts = await collection.countDocuments(query);

      // Fetch paginated posts
      const posts = await collection
        .find(query)
        .sort({ createdAt: -1 }) // newest first
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
      throw err;
    }
  }


  // <<< Get post by ID >>>
  async getPostById(postID) {
    try {
      const collection = this.getCollection();

      // Aggregation pipeline to find post
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(postID),
            status: { $nin: ["draft", "archived"] }, // exclude drafts and archived directly
          },
        },
        {
          $limit: 1, // only one result
        },
      ];

      const results = await collection.aggregate(pipeline).toArray();

      return results.length > 0 ? results[0] : null;
    } catch (err) {
      throw err;
    }
  }


  // <<< Get posts by user ID >>>
  async getPostByUserCredentials(userID) {
    try {
      const collection = this.getCollection();

      // Aggregation pipeline to match posts by user
      const pipeline = [
        {
          $match: {
            userID: userID,
            status: { $nin: ["draft", "archived"] },
          },
        },
      ];

      return await collection.aggregate(pipeline).toArray();
    } catch (err) {
      throw err;
    }
  }


  // <<< Delete post by ID and user ID >>>
  async deletePostById(postID, userID) {
    try {
      const collection = this.getCollection();

      // Delete post if it matches postID and userID
      const result = await collection.deleteOne({
        _id: new ObjectId(postID),
        userID: userID,
      });

      if (result.deletedCount === 0) {
        throw new ApplicationError("No matching post found to delete", 404);
      }

      return result;
    } catch (err) {
      throw err;
    }
  }


  // <<< Update post by ID and user ID >>>
  async updatePostById(postID, userID, data) {
    try {
      const collection = this.getCollection();

      // Update post and return the updated document
      const result = await collection.findOneAndUpdate(
        {
          _id: new ObjectId(postID),
          userID: userID,
        },
        {
          $set: data,
        },
        {
          returnDocument: "after", // return updated document
        }
      );

      return result;
    } catch (err) {
      throw err;
    }
  }
}
