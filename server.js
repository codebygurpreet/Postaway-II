// Import required packages
import "./env.js"
import express from "express";

// Import middlewares
import loggerMiddleware from "./src/middleware/logger.middleware.js";
import errorHandler from "./src/middleware/errorHandler.middleware.js";

// Import route files
import userRoutes from "./src/feature/user/user.routes.js";
import postsRoutes from "./src/feature/post/post.routes.js";
import commentRoutes from "./src/feature/comment/comment.routes.js";
import likeRoutes from "./src/feature/like/like.routes.js";
import bookmarkRoutes from "./src/feature/bookmark/bookmark.routes.js";

// Import MongoDB
import {connectToMongoDB} from "./src/config/mongodb.js";

// Create an instance of express app
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(loggerMiddleware); // Log every request

// Routes
app.use("/api/user", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/bookmark", bookmarkRoutes);

// Health check / root route
app.get("/", (req, res) => {
    res.send("Welcome to Postaway API 🚀");
});

// Error handler (should be the last middleware)
app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    connectToMongoDB();
});
