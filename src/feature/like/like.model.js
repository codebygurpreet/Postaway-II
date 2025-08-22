// Dummy like data (for in-memory operations)
let likes = [
    { id: 1, userId: 1, postId: 1 },
    { id: 2, userId: 2, postId: 1 },
    { id: 3, userId: 2, postId: 2 },
    { id: 4, userId: 3, postId: 2 }
];

export default class LikeModel {
    constructor(id, userId, postId) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
    }

    static addLike(userId, postId) {
        const newLike = new LikeModel(likes.length + 1, userId, postId);
        likes.push(newLike);
        return newLike;
    }

    static getAllLikesForPost(postId) {
        const result = likes.filter(like => like.postId === postId);
        if (result.length === 0) throw new Error("There is no like")
        return result
    }

    static deleteLike(userId, postId) {
        const index = likes.findIndex(
            like => like.postId === postId && like.userId === userId
        );

        if (index === -1) throw new Error("Like not found");

        const deleted = likes.splice(index, 1)[0];
        return deleted;
    }

    // 3. Additional 
    // Assume likes = [{ postId: 1, userId: 2 }, ...]
    static countByPostId(postId) {
        return likes.filter(like => like.postId === postId).length;
    }

}
