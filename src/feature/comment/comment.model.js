// Dummy comment data (for in-memory operations)
// let comments = [
//     { id: 1, userId: 1, postId: 1, content: "First comment on post 1" },
//     { id: 2, userId: 2, postId: 1, content: "Second comment on post 1" },
//     { id: 3, userId: 1, postId: 2, content: "Nice picture on post 2" },
//     { id: 4, userId: 2, postId: 2, content: "Amazing view on post 2" },
//     { id: 5, userId: 1, postId: 1, content: "Love the colors" },
//     { id: 6, userId: 2, postId: 1, content: "So beautiful!" },
//     { id: 7, userId: 1, postId: 2, content: "I want to visit here" },
//     { id: 8, userId: 2, postId: 2, content: "Looks peaceful" },
//     { id: 9, userId: 1, postId: 1, content: "This is stunning" },
//     { id: 10, userId: 2, postId: 1, content: "Perfect shot" },
//     { id: 11, userId: 1, postId: 2, content: "Love this scenery" },
//     { id: 12, userId: 2, postId: 2, content: "Wonderful vibe" },
//     { id: 13, userId: 1, postId: 1, content: "Great lighting" },
//     { id: 14, userId: 2, postId: 1, content: "Wow, breathtaking" },
//     { id: 15, userId: 1, postId: 2, content: "Looks magical" },
//     { id: 16, userId: 2, postId: 2, content: "So relaxing" },
//     { id: 17, userId: 1, postId: 1, content: "Love the details" },
//     { id: 18, userId: 2, postId: 1, content: "Absolutely gorgeous" },
//     { id: 19, userId: 1, postId: 2, content: "Such a beautiful place" },
//     { id: 20, userId: 2, postId: 2, content: "Peaceful and calm" }
// ];


export default class CommentModel {

    constructor(userID, postID, content) {
        this.userID = userID;
        this.postID = postID;
        this.content = content;
    }

    // static getAllComment(postId, page, limit) {
    //     const filteredComments = comments.filter(comment => comment.postId == postId);

    //     // Pagination Logic
    //     const startIndex = (page - 1) * limit
    //     const endIndex = page * limit
    //     const paginatedComments = filteredComments.slice(startIndex, endIndex);

    //     return {
    //         comments: paginatedComments,
    //         totalComments: filteredComments.length,
    //         totalPages: Math.ceil(filteredComments.length / limit),
    //         currentPage: page,
    //     };
    // }


    // static createComment(userId, postId, content) {
    //     const newComment = new CommentModel(comments.length + 1, userId, postId, content);

    //     comments.push(newComment);
    //     return newComment;
    // }


    // static deleteComment(commentId, userId) {
    //     const index = comments.findIndex(
    //         (c) => c.id == commentId && c.userId == userId
    //     );

    //     if (index === -1) return null;

    //     const deleted = comments.splice(index, 1)[0]; // Return deleted comment
    //     return deleted;
    // }


    // static updateComment(commentId, userId, content) {
    //     const index = comments.findIndex((c) => c.id === commentId && c.userId === userId);

    //     if (index === -1) return null;

    //     comments[index].content = content;

    //     return comments[index];
    // }

    // // 3. Additional
    // // Assume comments = [{ postId: 1, userId: 1, content: 'Nice!' }, ...]
    // static countByPostId(postId) {
    //     return comments.filter(comment => comment.postId === postId).length;
    // }

}

