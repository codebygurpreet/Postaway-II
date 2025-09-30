// Like Controller

// Import required packages :-
// Application modules
import LikeRepository from "./like.repository.js";
import PostRepository from "../post/post.repository.js";
import ApplicationError from "../../../utils/applicationError.js";

// Like Controller class
export default class LikeController {
  // Initialize repositories
  constructor() {
    this.likeRepository = new LikeRepository();
    this.postRepository = new PostRepository();
  }

  // <<< Toggle like status for a post >>>
  togglePostLike = async (req, res, next) => {
    try {
      const userId = req.userID;        // ID of logged-in user
      const postId = req.params.id;     // ID of the post to like/unlike

      if (!postId) {
        throw new ApplicationError("Missing post ID", 400);
      }

      // Check if post exists
      const postExists = await this.postRepository.getPostById(postId);
      if (!postExists) {
        throw new ApplicationError("Post not found", 404);
      }

      // Check if user already liked the post
      const existingLike = await this.likeRepository.findLike(userId, postId);
      let likeToggle = false; // Will track whether like was added or removed

      if (existingLike) {
        // If already liked → remove like
        const removedLike = await this.likeRepository.removeLike(
          userId,
          postId
        );
        if (!removedLike) {
          throw new ApplicationError("Like could not be removed", 500);
        }
        likeToggle = false;
      } else {
        // If not liked → add like
        const addedLike = await this.likeRepository.addLike(
          userId,
          postId
        );
        if (!addedLike) {
          throw new ApplicationError("Like could not be added", 500);
        }
        likeToggle = true;
      }

      // Send response indicating action performed
      return res.status(200).json({
        success: true,
        message: likeToggle
          ? "Like added successfully"
          : "Like removed successfully",
      });

    } catch (err) {
      next(err);
    }
  };

  // <<< Get all likes for a specific post >>>
  getPostLikes = async (req, res, next) => {
    try {
      const postId = req.params.id;     // ID of the post to get likes for

      if (!postId) {
        throw new ApplicationError("Missing post ID", 400);
      }

      // Check if post exists
      const postExists = await this.postRepository.getPostById(postId);
      if (!postExists) {
        throw new ApplicationError("Post not found", 404);
      }

      // Fetch all likes for the post
      const allLikes = await this.likeRepository.getAllLikesForPost(postId);
      if (!allLikes || allLikes.length === 0) {
        throw new ApplicationError("No likes found for this post", 404);
      }

      // Send all likes in response
      return res.status(200).json({
        success: true,
        message: "All likes retrieved successfully",
        data: allLikes,
      });

    } catch (err) {
      next(err);
    }
  };
}
