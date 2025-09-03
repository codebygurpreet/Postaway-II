// post.controller.js
import ApplicationError from "../../../utils/applicationError.js";
import PostModel from "./post.model.js";
import PostRepository from "./post.repository.js";

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  async createNewPost(req, res, next) {
    try {
      const userID = req.userID;
      const { caption, status } = req.body;

      if (!req.file) {
        throw new ApplicationError("Image file is required", 400);
      }

      if (!caption) {
        throw new ApplicationError("Caption are required", 400);
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

      return res
        .status(201)
        .json({ success: true, message: "Post created successfully", newPost });
    } catch (err) {
      next(err);
    }
  }

  // 5. Get all posts (Pagination)
  async getAll(req, res, next) {
    try {
      const caption = req.query.caption || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await this.postRepository.findAll(page, limit, caption);

      // Application error handling moved here
      if (!result.posts || result.posts.length === 0) {
        throw new ApplicationError("Posts Not Found", 404);
      }

      res.status(200).json({
        success: true,
        message: "All posts",
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

  async getPostById(req, res, next) {
    try {
      const postID = req.params.id;
      if (!postID) throw new ApplicationError("Invalid post ID", 400);

      const post = await this.postRepository.getPostById(postID);
      if (!post) throw new ApplicationError("Post not found", 404);

      return res
        .status(200)
        .json({ success: true, message: "Post retrieved", post });
    } catch (err) {
      next(err);
    }
  }

  async getPostByUserCredentials(req, res, next) {
    try {
      const userID = req.userID;
      if (!userID) throw new ApplicationError("User ID required", 400);

      const posts = await this.postRepository.getPostByUserCredentials(userID);
      if (!posts) throw new ApplicationError("No Post Found", 404)
        console.log(posts)

      return res
        .status(200)
        .json({ success: true, message: `Posts by user ${userID}`, posts });
    } catch (err) {
      next(err);
    }
  }

  // async updatePostById(req, res, next) {
  //   try {
  //     const userId = req.userID;
  //     const postId = parseInt(req.params.id);
  //     const data = req.body;

  //     if (!postId || !userId) throw new ApplicationError("Missing post ID or user ID", 400);

  //     const updatedPost = await PostModel.updatePostById(postId, userId, data);
  //     if (!updatedPost)
  //       throw new ApplicationError("Post not found or update failed", 404);

  //     res.status(200).json({
  //       success: true,
  //       message: "Post updated successfully",
  //       updatedPost,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  
  // async delete post by id
  async deletePostById(req, res, next) {
    try {
      const userID = req.userID;
      const postID = req.params.id;
      if (!postID || !userID) throw new ApplicationError("Post ID And User ID both required", 400);

      const deletePost = await this.postRepository.deletePostById(postID, userID);
      if (!deletePost) throw new ApplicationError("Post not found", 404);
      console.log(deletePost);

      res.status(201).json({
        success: true,
        message: "Post deleted successfully",
        deletePost,
      });
    } catch (err) {
      next(err);
    }
  }

  // // Additional Task
  // // 1. Filter by caption
  // async filterByCaption(req, res, next) {
  //   try {
  //     const caption = req.query.caption;
  //     if (!caption) throw new ApplicationError("Caption is not defined", 400);

  //     const filteredPosts = await PostModel.filterByCaption(caption);

  //     if (filteredPosts.length === 0)
  //       throw new ApplicationError("Post Not found", 404);

  //     res.status(200).json({
  //       success: true,
  //       message: "Post retrieved by caption",
  //       filteredPosts,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // // 2. Add a feature to save a post as a draft and to achieve a post
  // async postStatus(req, res, next) {
  //   try {
  //     const postID = req.params.id;
  //     const userID = req.userID;
  //     const { status } = req.body;

  //     if (!postID || !userID) throw new ApplicationError("Missing post ID or user ID", 400);

  //     const result = await PostModel.postStatus(userID, postID, status);

  //     if (result.error === "NOT_FOUND") {
  //       throw new ApplicationError("Post Not Found", 404);
  //     }

  //     if (result.error === "INVALID_TRANSITION") {
  //       throw new ApplicationError(
  //         `Invalid status transition from '${result.currentStatus}' to '${result.newStatus}'`,
  //         400
  //       );
  //     }

  //     res.status(200).json({
  //       success: true,
  //       updatedStatus: result.updatedPost,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // // 3. Implement sorting of posts based on user engagement and date
  // async getSortedPosts(req, res, next) {
  //   try {
  //     const allowedSorts = ["engagement", "date"];
  //     const sortBy = req.query.sortBy;

  //     // if sortBy is given but invalid → throw error
  //     if (sortBy && !allowedSorts.includes(sortBy)) {
  //       throw new ApplicationError(
  //         `Invalid sort option '${sortBy}'. Allowed values are: ${allowedSorts.join(", ")}`,
  //         400
  //       );
  //     }

  //     // default to "engagement"
  //     const finalSort = sortBy || "engagement";

  //     const sortedPosts = await PostModel.getPostsSorted(finalSort);

  //     // if no posts found → throw error
  //     if (!sortedPosts || sortedPosts.length === 0) {
  //       throw new ApplicationError("No posts found", 404);
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: `Sorted posts by ${finalSort}`,
  //       data: sortedPosts,
  //     });
  //   } catch (err) {
  //     next(err); // pass error to global error handler
  //   }
  // }
}
