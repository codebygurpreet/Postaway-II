// Import required packages and middleware
import express from "express";
import jwtAuth from "../../middleware/jwt.middleware.js";
import PostController from "./post.controller.js";
import upload from "../../middleware/multer.middleware.js";

// Initialize controller and router
const router = express.Router();
const postController = new PostController();

// Routes
// Create a new post
router.post("/", jwtAuth, upload.single("imageUrl"), (req, res, next) =>
  postController.createNewPost(req, res, next)
);

// Get all posts
router.get("/all", (req, res, next) =>
  postController.getAll(req, res, next)
);

// Get posts by logged-in user
router.get("/", jwtAuth, (req, res, next) =>
  postController.getPostByUserCredentials(req, res, next)
);

// 1. Additional Task Filter By Caption
router.get("/filter", (req, res, next) =>
  postController.filterByCaption(req, res, next)
);

// 3. Additional Task Implement sorting of posts based on user engagement and date
router.get("/sorted", jwtAuth, (req, res, next) =>
  postController.getSortedPosts(req, res, next)
);

// Get post by ID
router.get("/:id", (req, res, next) =>
  postController.getPostById(req, res, next)
);

// Update post by ID
router.put("/:id", upload.none(), jwtAuth, (req, res, next) =>
  postController.updatePostById(req, res, next)
);

// 2. Additional Task post.routes.js
router.patch("/:id/status", upload.none(), jwtAuth, (req, res, next) =>
  postController.postStatus(req, res, next)
);

// Delete post by ID
router.delete("/:id", jwtAuth, (req, res, next) =>
  postController.deletePostById(req, res, next)
);

export default router;
