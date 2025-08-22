// import required packages
import PostModel from '../post/post.model.js'
const AllBookmarkPosts = [
    { id: 1, userId: 1, postId: 2 }
];

export default class BookmarkModel {

    constructor(id, userId, postId) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
    }

    static getBookmarks(userId) {
        if (!AllBookmarkPosts || AllBookmarkPosts.length === 0) {
            return null; // Let controller handle this
        }

        const userBookmarkedPosts = AllBookmarkPosts.filter(p => p.userId === userId);

        if (userBookmarkedPosts.length === 0) {
            return []; // Let controller handle empty bookmarks
        }

        const allPosts = PostModel.getAllPosts();

        const bookmarkedPosts = allPosts.filter(post =>
            userBookmarkedPosts.some(bookmark => bookmark.postId === post.id && post.status != 'draft')
        );

        return bookmarkedPosts;
    }


    static addBookmark(userId, postId) {
        const post = PostModel.getPostById(postId);

        if (!post || post.status === 'draft') {
            return null
        }

        const alreadyBookmarked = AllBookmarkPosts.some(bookmark => bookmark.userId === userId && bookmark.postId === postId);

        if (alreadyBookmarked) {
            return 'duplicate'; // Let controller handle this
        }

        const newBookMark = new BookmarkModel(AllBookmarkPosts.length + 1, userId, postId)
        AllBookmarkPosts.push(newBookMark);
        return newBookMark
    }

    static removeBookmark(userId, postId) {
        const index = AllBookmarkPosts.findIndex(
            b => b.userId === userId && b.postId === postId
        );

        if (index === -1) {
            return null;
        }

        const removedBookmark = AllBookmarkPosts.splice(index, 1);
        return removedBookmark; // returns array with removed item


    }


}
