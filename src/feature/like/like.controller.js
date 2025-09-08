// import required packages
import LikeRepository from "./like.repository.js";
import PostRepository from "../post/post.repository.js";
import ApplicationError from "../../../utils/applicationError.js";


export default class LikeController {
    constructor() {
        this.likeRepository = new LikeRepository();
        this.postRepository = new PostRepository();
    }

    async toggleLike(req, res, next) {
        try {
            const userID = req.userID;
            const postID = req.params.id;

            const post = await this.postRepository.getPostById(postID);
            if (!post) {
                throw ApplicationError("Post not available", 404);
            }

            const existingLike = await this.likeRepository.findLike(userID, postID);
            let likeToggle = false;

            if (existingLike) {
                const removedLike = await this.likeRepository.removeLike(userID, postID);
                if (!removedLike) {
                    throw ApplicationError("Like could not be removed", 500);
                }
                likeToggle = false;
            } else {
                // proceed to add like
                const addLike = await this.likeRepository.addLike(userID, postID)
                if (!addLike) {
                    throw ApplicationError("Like could not be added", 500);
                }
                likeToggle = true;
            }

            return res.status(200).json({
                success: true,
                message: `${likeToggle ? "Like Added" : "Like Removed"}`,
            });
        } catch (err) {
            next(err);
        }
    }

    async getAllLikesForPost(req, res, next) {
        try {
            const postID = req.params.id;
            if (!postID) {
                throw new ApplicationError("Missing post ID", 400);
            }

            // Check if post exists
            const postExists = await this.postRepository.getPostById(postID);
            if (!postExists) {
                throw new ApplicationError("Post not found", 404);
            };

            // Fetch all likes for the post
            const allLikes = await this.likeRepository.getAllLikesForPost(postID);
            if (!allLikes) {
                throw new ApplicationError("No likes found for this post", 404);
            }

            return res.status(200).json({
                success: true,
                message: `All likes have been retrieved `,
                data: allLikes,
            });
        } catch (err) {
            next(err);
        }
    }

    // deleteLike(req, res) {
    //     try {
    //         const userId = req.userID;
    //         const postId = parseInt(req.params.postid);
    //         const post = PostModel.getAllPosts().find(p => p.id === postId);
    //         if (!post) {
    //             throw new Error("Post not available")
    //         }

    //         const deleteLike = LikeModel.deleteLike(userId, postId)

    //         if (!deleteLike) {
    //             throw new Error("Like could not be deleted");
    //         }

    //         return res.status(200).json({
    //             success: true,
    //             message: "like deleted",
    //             deleteLike
    //         });

    //     } catch (err) {
    //         console.error("Error in Deleting Like:", err.message);
    //         return res.status(500).json({
    //             success: false,
    //             message: err.message || "Something went wrong while deleting like for specific post"
    //         });

    //     }
    // }
}
