// Post Controller

// Import required packages :-
// Application modules 
import ApplicationError from "../../../utils/applicationError.js";
import PostModel from "./post.model.js";
import PostRepository from "./post.repository.js";


// Post Controller class
export default class PostController {
  // Initialize repository
  constructor() {
    this.postRepository = new PostRepository();
  }


  // <<< Create a new post >>>
  createNewPost = async (req, res, next) => {
    try {
      const userID = req.userID;
      const { caption, status } = req.body;

      if (!req.file) {
        throw new ApplicationError("Image file is required", 400);
      }

      if (!caption?.trim()) {
        throw new ApplicationError("Caption is required", 400);
      }

      // Allow only valid statuses
      const allowedStatuses = ["published", "draft"];
      const postStatus = allowedStatuses.includes(status)
        ? status
        : "published";

      const imageUrl = req.file.filename;
      const newPost = new PostModel(
        userID,
        caption.trim(),
        imageUrl,
        postStatus
      );

      await this.postRepository.createNewPost(newPost);

      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        newPost,
      });
    } catch (err) {
      next(err);
    }
  }


  // <<< Get all posts (with pagination) >>>
  getAll = async (req, res, next) => {
    try {
      const caption = req.query.caption || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await this.postRepository.findAll(page, limit, caption);

      if (!result.posts || result.posts.length === 0) {
        throw new ApplicationError("Posts not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "All posts retrieved successfully",
        data: result.posts,
        pagination: {
          totalPosts: result.totalPosts,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
        },
      });
    } catch (err) {
      next(err);
    }
  }


  // <<< Get post by ID >>>
  getPostById = async (req, res, next) => {
    try {
      const postID = req.params.id;
      if (!postID) {
        throw new ApplicationError("Invalid post ID", 400);
      }

      const post = await this.postRepository.getPostById(postID);
      if (!post) {
        throw new ApplicationError("Post not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Post retrieved successfully",
        post,
      });
    } catch (err) {
      next(err);
    }
  }


  // <<< Get posts by logged-in user >>>
  getPostByUserCredentials = async (req, res, next) => {
    try {
      const userID = req.userID;
      if (!userID) {
        throw new ApplicationError("User ID required", 400);
      }

      const posts = await this.postRepository.getPostByUserCredentials(userID);
      if (!posts) {
        throw new ApplicationError("No posts found", 404);
      }

      return res.status(200).json({
        success: true,
        message: `Posts by user ${userID}`,
        posts,
      });
    } catch (err) {
      next(err);
    }
  }


  // <<< Update post by ID >>>
  updatePostById = async (req, res, next) => {
    try {
      const userID = req.userID;
      const postID = req.params.id;
      const data = req.body;

      if (!postID || !userID) {
        throw new ApplicationError("Missing post ID or user ID", 400);
      }

      // Prevent userID updates
      if (data.userID) {
        throw new ApplicationError("You cannot update userID", 400);
      }

      const updatedPost = await this.postRepository.updatePostById(postID, userID, data);

      if (!updatedPost) {
        throw new ApplicationError("Post not found or update failed", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        updatedPost,
      });
    } catch (err) {
      next(err);
    }
  }


  // <<< Delete post by ID >>>
  deletePostById = async (req, res, next) => {
    try {
      const userID = req.userID;
      const postID = req.params.id;

      if (!postID || !userID) {
        throw new ApplicationError("Post ID and User ID are required", 400);
      }

      const deletePost = await this.postRepository.deletePostById(postID, userID);
      if (!deletePost) {
        throw new ApplicationError("Post not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Post deleted successfully",
        deletePost,
      });
    } catch (err) {
      next(err);
    }
  }


  /* -------------------------------
     Additional Tasks (commented out)
  ----------------------------------

  // <<< Filter by caption >>>
  filterByCaption = async (req, res, next) => {
    try {
      const caption = req.query.caption;
      if (!caption) throw new ApplicationError("Caption is not defined", 400);

      const filteredPosts = await PostModel.filterByCaption(caption);

      if (filteredPosts.length === 0) {
        throw new ApplicationError("Post not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Posts retrieved by caption",
        filteredPosts,
      });
    } catch (err) {
      next(err);
    }
  }

  // <<< Update post status (draft/archived) >>>
  postStatus = async (req, res, next) => {
    try {
      const postID = req.params.id;
      const userID = req.userID;
      const { status } = req.body;

      if (!postID || !userID) {
        throw new ApplicationError("Missing post ID or user ID", 400);
      }

      const result = await PostModel.postStatus(userID, postID, status);

      if (result.error === "NOT_FOUND") {
        throw new ApplicationError("Post not found", 404);
      }

      if (result.error === "INVALID_TRANSITION") {
        throw new ApplicationError(
          `Invalid status transition from '${result.currentStatus}' to '${result.newStatus}'`,
          400
        );
      }

      return res.status(200).json({
        success: true,
        updatedStatus: result.updatedPost,
      });
    } catch (err) {
      next(err);
    }
  }

  // <<< Get sorted posts (by engagement/date) >>>
  getSortedPosts = async (req, res, next) => {
    try {
      const allowedSorts = ["engagement", "date"];
      const sortBy = req.query.sortBy;

      if (sortBy && !allowedSorts.includes(sortBy)) {
        throw new ApplicationError(
          `Invalid sort option '${sortBy}'. Allowed values are: ${allowedSorts.join(", ")}`,
          400
        );
      }

      const finalSort = sortBy || "engagement";
      const sortedPosts = await PostModel.getPostsSorted(finalSort);

      if (!sortedPosts || sortedPosts.length === 0) {
        throw new ApplicationError("No posts found", 404);
      }

      return res.status(200).json({
        success: true,
        message: `Sorted posts by ${finalSort}`,
        data: sortedPosts,
      });
    } catch (err) {
      next(err);
    }
  }
  */
}
