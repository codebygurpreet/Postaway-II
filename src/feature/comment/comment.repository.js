// Comment Repository

// Import required packages :-
// Application modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

// Comment Repository class
export default class CommentRepository {
  // Initialize collection
  constructor() {
    // MongoDB collection name
    this.collection = "comments";
  }

  // <<< Method to get collection >>>
  getCollection = () => {
    const db = getDB();
    return db.collection(this.collection);
  };

  // <<< Create new comment >>>
  createComment = async (newComment) => {
    try {
      const collection = this.getCollection();
      const result = await collection.insertOne(newComment);
      return result.acknowledged ? newComment : null;
    } catch (err) {
      throw err;
    }
  };

  // <<< Get all comments for a post with pagination >>>
  getAllComment = async (postId, page, limit) => {
    try {
      const collection = this.getCollection();
      const skip = (page - 1) * limit;

      const comments = await collection
        .find({ postId })
        .skip(skip)
        .limit(limit)
        .toArray();

      const totalComments = await collection.countDocuments({ postId });

      return {
        comments,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
        currentPage: page,
      };
    } catch (err) {
      throw err;
    }
  };

  // <<< Delete comment by ID >>>
  deleteComment = async (commentId, userId) => {
    try {
      const collection = this.getCollection();
      const result = await collection.deleteOne({
        _id: new ObjectId(commentId),
        userId,
      });
      return result.deletedCount > 0;
    } catch (err) {
      throw err;
    }
  };

  // <<< Update comment by ID >>>
  updateComment = async (commentId, userId, content) => {
    try {
      const collection = this.getCollection();
      const result = await collection.updateOne(
        { _id: new ObjectId(commentId), userId },
        { $set: { content } }
      );
      return result.modifiedCount > 0;
    } catch (err) {
      throw err;
    }
  };
}
