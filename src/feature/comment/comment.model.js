// Comment Model
// Handles creation of comment objects with essential fields

export default class CommentModel {
    constructor(userId, postId, content) {
        this.userId = userId;
        this.postId = postId;
        this.content = content;
    }
}

