// import required packages
import express from 'express';
import jwtAuth from '../../middleware/jwt.middleware.js';
import BookmarkController from "./bookmark.controller.js";

// Initialize controller and router
const router = express.Router();
const bookmarkController = new BookmarkController();

// Routes
router.get('/', jwtAuth, bookmarkController.getBookmarks)

router.post('/:postId', jwtAuth, bookmarkController.addBookmark)

router.delete('/:postId', jwtAuth, bookmarkController.removeBookmark)

export default router;