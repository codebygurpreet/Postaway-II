// import required packages
import LikeModel from "./like.model.js";
import PostModel from "../post/post.model.js";
import UserModel from "../auth/auth.model.js";


export default class LikeController {
    addLike(req, res) {
        try {
            const userId = req.userID;
            console.log(userId)
            const user = UserModel.getAllUser().find(u => u.id === userId);
            console.log(user)
            if (!user) {
                throw new Error("user not available")
            }

            const postId = parseInt(req.params.postid);
            const post = PostModel.getAllPosts().find(p => p.id === postId);
            if (!post) {
                throw new Error("Post not available")
            }

            const newLike = LikeModel.addLike(userId, postId)
            if (!newLike) {
                throw new Error("Like could not be added");

            }
            return res.status(200).json({
                success: true,
                message: "like Added",
                newLike
            });
        } catch (err) {
            console.error("Error in addingLike:", err.message);
            return res.status(500).json({
                success: false,
                message: err.message || "Something went wrong while adding like"
            });
        }


    }
    getAllLikesForPost(req, res) {
        try {
            const postId = parseInt(req.params.postid);
            const post = PostModel.getAllPosts().find(p => p.id === postId);
            if (!post) {
                throw new Error("Post not available")
            }
            const getAllLike = LikeModel.getAllLikesForPost(postId)

            if (!getAllLike) {
                throw new Error("Like could not be added");
            }

            return res.status(200).json({
                success: true,
                message: "like Added",
                getAllLike
            });

        } catch (err) {
            console.error("Error in addingLike:", err.message);
            return res.status(500).json({
                success: false,
                message: err.message || "Something went wrong while grtting all like for specific post"
            });

        }
    }

    deleteLike(req, res) {
        try {
            const userId = req.userID;
            const postId = parseInt(req.params.postid);
            const post = PostModel.getAllPosts().find(p => p.id === postId);
            if (!post) {
                throw new Error("Post not available")
            }

            const deleteLike = LikeModel.deleteLike(userId, postId)

            if (!deleteLike) {
                throw new Error("Like could not be deleted");
            }

            return res.status(200).json({
                success: true,
                message: "like deleted",
                deleteLike
            });

        } catch (err) {
            console.error("Error in Deleting Like:", err.message);
            return res.status(500).json({
                success: false,
                message: err.message || "Something went wrong while deleting like for specific post"
            });

        }
    }
}
