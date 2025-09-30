// Post Repository

// Import required packages :- 
// Application modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

// Post Repository class
export default class PostRepository {
  // Initialize collection
  constructor() {
    this.collection = "posts";
  }

  // Get collection instance
  getCollection = () => {
    const db = getDB();
    return db.collection(this.collection);
  }


  // <<< Create new post >>>
  async createNewPost(newPost) {
    try {
      const collection = this.getCollection();

      // Insert new post
      await collection.insertOne(newPost);

    } catch (err) {
      throw err;
    }
  }


  // <<< Get all posts with optional caption filter and pagination >>>
  async findAll(page, limit, caption) {
    try {
      const collection = this.getCollection();

      // Ensure valid page and limit
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);

      // Base query: exclude drafts and archived posts
      const query = { status: { $nin: ["draft", "archived"] } };

      // Add caption filter if provided
      if (caption?.trim()) {
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
  async getPostById(postId) {
    try {
      const collection = this.getCollection();

      // Find post by _id and exclude drafts/archived
      return await collection.findOne(
        { _id: new ObjectId(postId), status: { $nin: ["draft", "archived"] } }
      );

    } catch (err) {
      throw err;
    }
  }


  // <<< Get posts by userId >>>
  async getPostByUserCredentials(userId) {
    try {
      const collection = this.getCollection();

      // Find all posts for a user, exclude drafts/archived
      return await collection
        .find({ userId, status: { $nin: ["draft", "archived"] } })
        .toArray();

    } catch (err) {
      throw err;
    }
  }


  // <<< Update post by postId and userId >>>
  async updatePostById(postId, userId, data) {
    try {
      const collection = this.getCollection();

      // Update fields and return the updated document
      return await collection.findOneAndUpdate(
        { _id: new ObjectId(postId), userId },
        { $set: data },
        { returnDocument: "after" }
      );

    } catch (err) {
      throw err;
    }
  }


  // <<< Delete post by postId and userId >>>
  async deletePostById(postId, userId) {
    try {
      const collection = this.getCollection();

      // Delete post if matches postId and userId
      return await collection.deleteOne({ _id: new ObjectId(postId), userId });

    } catch (err) {
      throw err;
    }
  }
}
