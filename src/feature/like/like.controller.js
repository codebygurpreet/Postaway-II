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
  toggleLike = async (req, res, next) => {
    try {
      const userId = req.userID;          // ID of logged-in user
      const postId = req.params.id;       // ID of the post to like/unlike

      if (!postId) throw new ApplicationError("Post ID required", 400);

      const post = await this.postRepository.getPostById(postId); // Check if post exists
      if (!post) throw new ApplicationError("Post not available", 404);

      const existingLike = await this.likeRepository.findLike(userId, postId); // Check if user already liked
      let likeToggle = false; // Will track whether like was added or removed

      if (existingLike) {
        // If already liked → remove like
        const removedLike = await this.likeRepository.removeLike(userId, postId);
        if (!removedLike) throw new ApplicationError("Like could not be removed", 500);
        likeToggle = false;
      } else {
        // If not liked → add like
        const addLike = await this.likeRepository.addLike(userId, postId);
        if (!addLike) throw new ApplicationError("Like could not be added", 500);
        likeToggle = true;
      }

      // Send response indicating action performed
      return res.status(200).json({
        success: true,
        message: likeToggle ? "Like added successfully" : "Like removed successfully",
      });
    } catch (err) {
      next(err);
    }
  };


  // <<< Get all likes for a specific post >>>
  getAllLikesForPost = async (req, res, next) => {
    try {
      const postId = req.params.id;       // ID of the post to get likes for
      if (!postId) throw new ApplicationError("Post ID required", 400);

      const postExists = await this.postRepository.getPostById(postId); // Check if post exists
      if (!postExists) throw new ApplicationError("Post not found", 404);

      const allLikes = await this.likeRepository.getAllLikesForPost(postId); // Fetch all likes
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


  // <<< Delete all likes for a post (optional) >>>
  // deleteLike = async (req, res, next) => {
  //   try {
  //     const userId = req.userID;          // ID of logged-in user
  //     const postId = req.params.postid;   // ID of the post to delete likes for
  //
  //     if (!postId) throw new ApplicationError("Post ID required", 400);
  //
  //     const post = await this.postRepository.getPostById(postId); // Check if post exists
  //     if (!post) throw new ApplicationError("Post not available", 404);
  //
  //     const deleteLike = await this.likeRepository.deleteLike(userId, postId); // Delete likes
  //     if (!deleteLike) throw new ApplicationError("Like could not be deleted", 500);
  //
  //     return res.status(200).json({
  //       success: true,
  //       message: "Like deleted successfully",
  //       data: deleteLike,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // };
}
