// Like Repository

// Import required packages :-
// Application modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import LikeModel from "./like.model.js";

// Like Repository class
export default class LikeRepository {
  // Initialize collection
  constructor() {
    this.collection = "likes";
  }

  // Get collection instance
  getCollection = () => {
    const db = getDB();
    return db.collection(this.collection);
  };

  // <<< Find a like by userId and postId >>>
  findLike = async (userId, postId) => {
    try {
      const collection = this.getCollection();

      // Find like for given user and post
      return await collection.findOne({
        userId: userId,
        postId: postId,
      });

    } catch (err) {
      throw err;
    }
  };

  // <<< Add a new like >>>
  addLike = async (userId, postId) => {
    try {
      const collection = this.getCollection();

      // Create new like object
      const newLikeObj = new LikeModel(userId, postId);

      // Insert like into collection
      return await collection.insertOne(newLikeObj);

    } catch (err) {
      throw err;
    }
  };

  // <<< Remove a like >>>
  removeLike = async (userId, postId) => {
    try {
      const collection = this.getCollection();

      // Delete like document for given user and post
      return await collection.deleteOne({
        userId: userId,
        postId: postId,
      });

    } catch (err) {
      throw err;
    }
  };

  // <<< Get all likes for a specific post >>>
  getAllLikesForPost = async (postId) => {
    try {
      const collection = this.getCollection();

      // Find all likes for the given post
      return await collection
        .find({ postId: postId })
        .toArray();

    } catch (err) {
      throw err;
    }
  };
}
