// import required packages
import CommentModel from "./comment.model.js";
// import PostModel from "../post/post.model.js";
import PostRepository from "../post/post.repository.js";
import CommentRepository from "./comment.repository.js";
import ApplicationError from "../../../utils/applicationError.js";

export default class CommentController {

    constructor() {
        this.postRepository = new PostRepository();
        this.commentRepository = new CommentRepository();
    }

    async createComment(req, res) {
        try {
            const userID = req.userID;
            const postID = req.params.id;
            const { content } = req.body;

            // Basic validation
            if (!userID || !postID || !content?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "User ID, Post ID, and content are required"
                });
            }

            // Check if postId exists in posts array
            const postExists = await this.postRepository.getPostById(postID);

            if (!postExists) {
                throw new ApplicationError(`Post with ID ${postID} does not exist`, 404);
            }

            // Create comment
            const newComment = await this.commentRepository.createComment(userID, postID, content.trim());
            if (!newComment) {
                throw new ApplicationError("Failed to create comment", 500);
            }

            return res.status(201).json({
                success: true,
                message: "Comment added successfully",
                data: newComment
            });

        } catch (err) {
            console.error("Error in Adding New Comment:", err.message);
            next(err);
        }
    }


    async getAllComment(req, res) {
        try {
            const postID = req.params.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;

            // Get all posts and find the specific one
            // Check if postId exists in posts array
            const postExists = await this.postRepository.getPostById(postID);

            if (!postExists) {
                throw new ApplicationError(`Post with ID ${postID} does not exist`, 404);
            }

            if (postExists.status === "draft" || postExists.status === "archived") {
                throw new ApplicationError("Post is not published. It may be in draft or archived.", 404);
            }

            // Get all comments for the specific post
            const result = await this.commentRepository.getAllComment(postID, page, limit);
            console.log(result);

            return res.status(200).json({
                success: true,
                message: `Comments fetched successfully for the post ${postID}`,
                comments: result.comments,
                pagination: {
                    totalComments: result.totalComments,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage
                }
            });

        } catch (err) {
            console.error("Error in getAllComment:", err.message);
            next(err);
        }
    }



    async deleteComment(req, res, next) {
        try {
            const userID = req.userID;
            const commentID = req.params.id;

            if (!commentID) {
                throw new ApplicationError("Missing commnet ID", 400);
            }


            const deletedComment = await this.commentRepository.deleteComment(commentID, userID);
            console.log(deletedComment);

            if (!deletedComment) {
                throw new ApplicationError("Comment not found or unauthorized to delete", 404);
            }

            return res.status(200).json({
                success: true,
                message: "Comment deleted successfully",
                data: deletedComment
            });

        } catch (err) {
            console.error("Error in deleting comment:", err.message);
            next(err);
        }
    }


    // updateComment(req, res) {
    //     try {
    //         const userId = req.userID;
    //         const commentId = parseInt(req.params.id);
    //         const { content } = req.body;

    //         const updatedComment = CommentModel.updateComment(commentId, userId, content);

    //         if (!updatedComment) {
    //             throw new ApplicationError("Comment not found or you are not the owner", 404);
    //         }

    //         return res.status(200).json({
    //             success: true,
    //             message: "Comment updated successfully",
    //             updatedComment
    //         });

    //     } catch (err) {
    //         console.error("Error in updating comment:", err.message);
    //         return res.status(500).json({
    //             success: false,
    //             message: err.message || "Something went wrong while updating the comment"
    //         });
    //     }
    // }



}