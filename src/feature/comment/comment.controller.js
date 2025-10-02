// Comment Controller

// Import required packages :-
// Application modules
import PostRepository from "../post/post.repository.js";
import CommentRepository from "./comment.repository.js";
import ApplicationError from "../../../utils/applicationError.js";
import CommentModel from "./comment.model.js"; // Moved model usage to Controller

// Comment Controller class
export default class CommentController {
    // Initialize repository
    constructor() {
        this.postRepository = new PostRepository();
        this.commentRepository = new CommentRepository();
    }

    // <<< Create a new comment for a post >>>
    createComment = async (req, res, next) => {
        try {
            const userId = req.userID; // user from auth middleware
            const postId = req.params.id;
            const { content } = req.body;

            // Validate required fields
            if (!userId || !postId || !content?.trim()) {
                throw new ApplicationError("User ID, Post ID, and content are required", 400);
            }

            // Check if post exists
            const postExists = await this.postRepository.getPostById(postId);
            if (!postExists) {
                throw new ApplicationError(`Post with ID ${postId} does not exist`, 404);
            }

            // Create comment object from model
            const newComment = new CommentModel(userId, postId, content.trim());

            // Save new comment
            const savedComment = await this.commentRepository.createComment(newComment);
            if (!savedComment) {
                throw new ApplicationError("Failed to create comment", 500);
            }

            return res.status(201).json({
                success: true,
                message: "Comment added successfully",
                data: savedComment
            });

        } catch (err) {
            next(err);
        }
    }

    // <<< Get all comments for a specific post with pagination >>>
    getAllComment = async (req, res, next) => {
        try {
            const postId = req.params.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;

            // Check if post exists
            const postExists = await this.postRepository.getPostById(postId);
            if (!postExists) {
                throw new ApplicationError(`Post with ID ${postId} does not exist`, 404);
            }

            if (postExists.status === "draft" || postExists.status === "archived") {
                throw new ApplicationError("Post is not published. It may be in draft or archived.", 403);
            }

            // Fetch comments for the post
            const result = await this.commentRepository.getAllComment(postId, page, limit);

            return res.status(200).json({
                success: true,
                message: `Comments fetched successfully for post ${postId}`,
                comments: result.comments,
                pagination: {
                    totalComments: result.totalComments,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage
                }
            });

        } catch (err) {
            next(err);
        }
    }

    // <<< Delete a comment by ID >>>
    deleteComment = async (req, res, next) => {
        try {
            const userId = req.userID;
            const commentId = req.params.id;

            if (!commentId) {
                throw new ApplicationError("Missing comment ID", 400);
            }

            const deletedComment = await this.commentRepository.deleteComment(commentId, userId);
            if (!deletedComment) {
                throw new ApplicationError("Comment not found or unauthorized to delete", 404);
            }

            return res.status(200).json({
                success: true,
                message: "Comment deleted successfully"
            });

        } catch (err) {
            next(err);
        }
    }

    // <<< Update a comment by ID >>>
    updateComment = async (req, res, next) => {
        try {
            const userId = req.userID;
            const commentId = req.params.commentId;
            const { content } = req.body;

            if (!commentId) {
                throw new ApplicationError("Missing comment ID", 400);
            }

            if (!content || content.trim() === "") {
                throw new ApplicationError("Comment content cannot be empty", 400);
            }

            const updatedComment = await this.commentRepository.updateComment(commentId, userId, content.trim());
            if (!updatedComment) {
                throw new ApplicationError("Comment not found or not updated", 404);
            }

            return res.status(200).json({
                success: true,
                message: `Comment with ID ${commentId} updated successfully`,
                data: updatedComment
            });

        } catch (err) {
            next(err);
        }
    }
}
