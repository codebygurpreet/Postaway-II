// import required packages
import ApplicationError from '../../../utils/applicationError.js';
import BookmarkModel from './bookmark.model.js';

export default class BookmarkController {

    getBookmarks(req, res, next) {
        try {
            const userId = parseInt(req.userID);
            const getAllBookmarkedPosts = BookmarkModel.getBookmarks(userId);

            if (getAllBookmarkedPosts === null) {
                throw new ApplicationError('There are no bookmarked posts in the system.', 404);
            }

            if (getAllBookmarkedPosts.length === 0) {
                throw new ApplicationError('No bookmarks found for this user.', 404);
            }

            res.status(200).json({
                success: true,
                message: "All Bookmarked Posts",
                posts: getAllBookmarkedPosts,
            });
        } catch (err) {
            next(err);
        }
    }

    addBookmark(req, res, next) {
        try {
            const userId = req.userID;;
            const postId = parseInt(req.params.postId);

            const newBookmark = BookmarkModel.addBookmark(userId, postId);

            if (newBookmark === null) {
                throw new ApplicationError(`Post with id ${postId} not found or status is draft.`, 404);
            }

            if (newBookmark === 'duplicate') {
                throw new ApplicationError(`Post with id ${postId} is already bookmarked.`, 400);
            }

            res.status(200).json({
                success: true,
                message: `Your post with id:${postId} has been bookmarked`,
                allbookmark: newBookmark,
            });
        } catch (err) {
            next(err);
        }
    }

    removeBookmark(req, res, next) {
        try {
            const userId = req.userID;
            const postId = parseInt(req.params.postId);

            const removedBookmark = BookmarkModel.removeBookmark(userId, postId);

            if (removedBookmark === null) {
                throw new ApplicationError(
                    `Bookmark for post id ${postId} not found.`,
                    404
                );
            }

            res.status(200).json({
                success: true,
                message: `Your bookmark for post id ${postId} has been removed.`,
                removed: removedBookmark,
            });
        } catch (err) {
            next(err);
        }
    }
}
