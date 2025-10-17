// Post routes

// Import required packages :-
// Third-party packages
import express from "express";

// Application modules and middleware
import jwtAuth from "../../middleware/jwt.middleware.js";
import PostController from "./post.controller.js";
import upload from "../../middleware/multer.middleware.js";

// Initialize router and controller :-
const router = express.Router();
const postController = new PostController();

// Routes :-
// Create a new post
// Purpose: Allow authenticated user to create a post with optional image
// Middleware: jwtAuth → ensures user is authenticated
//             upload.single("imageUrl") → handles single image upload
router.post("/",
    jwtAuth,
    upload.single("imageUrl"),
    postController.createNewPost
);

// Get all posts
// Purpose: Fetch all posts from database
// Middleware: None
router.get("/all",
    postController.getAll
);

// Get posts by logged-in user
// Purpose: Fetch posts created by the authenticated user
// Middleware: jwtAuth → ensures user is authenticated
router.get("/",
    jwtAuth,
    postController.getPostByUserCredentials
);

// Get post by ID
// Purpose: Fetch a specific post by its ID
// Middleware: None
router.get("/:postId",
    postController.getPostById
);

// Update post by ID
// Purpose: Update a specific post by its ID
// Middleware: jwtAuth → ensures user is authenticated
//             upload.none() → ensures only text fields are updated
router.put("/:postId",
    upload.none(),
    jwtAuth,
    postController.updatePostById
);

// Delete post by ID
// Purpose: Delete a specific post by its ID
// Middleware: jwtAuth → ensures user is authenticated
router.delete("/:postId",
    jwtAuth,
    postController.deletePostById
);

// Export router
export default router;
