export default class PostModel {
  constructor(userID, caption, imageUrl, status, createdAt = new Date()) {
    this.userID = userID;
    this.caption = caption;
    this.imageUrl = imageUrl;
    this.status = status;
    this.createdAt = createdAt;
  }

  // static async createNewPost(userId, caption, imageUrl, status) {
  //   if (!userId || !caption) return null;

  //   const newPost = new PostModel(
  //     posts.length + 1,
  //     userId,
  //     caption,
  //     imageUrl,
  //     status
  //   );
  //   posts.push(newPost);
  //   return newPost;
  // }

  // static async getAllPosts() {
  //   return posts.length > 0 ? posts : null;
  // }

  // // 5. Get all posts (Pagination)
  // static async findAll(page, limit, caption) {
  //   // Filter by caption if provided
  //   let filteredPosts = posts;

  //   if (caption) {
  //     filteredPosts = posts.filter((post) =>
  //       post.caption.toLowerCase().includes(caption.toLowerCase())
  //     );
  //   }

  //   if (filteredPosts) {
  //     filteredPosts = filteredPosts.filter(
  //       (post) => post.status != "draft" && post.status != "archived"
  //     );
  //   }

  //   // Pagination logic
  //   const startIndex = (page - 1) * limit;
  //   const endIndex = page * limit;
  //   const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  //   return {
  //     posts: paginatedPosts,
  //     totalPosts: filteredPosts.length,
  //     totalPages: Math.ceil(filteredPosts.length / limit),
  //     currentPage: page,
  //   };
  // }

  // static async getPostById(id) {
  //   return posts.find((post) => post.id == id) || null;
  // }

  // static async getPostByUserCredentials(userId) {
  //   const userPosts = posts.filter((post) => post.userId === userId);
  //   return userPosts.length > 0 ? userPosts : null;
  // }

  // static async updatePostById(postId, userId, data) {
  //   const index = posts.findIndex(
  //     (post) => post.id === postId && post.userId === userId
  //   );
  //   if (index === -1) return null;

  //   posts[index] = {
  //     ...posts[index],
  //     ...data,
  //   };

  //   return posts[index];
  // }

  // static async deletePostById(postId, userId) {
  //   const index = posts.findIndex(
  //     (post) => post.id === postId && post.userId === userId
  //   );
  //   if (index === -1) return null;

  //   const deleted = posts[index];
  //   posts.splice(index, 1);
  //   return deleted;
  // }

  // // Additional Task
  // // 1. Filter by caption
  // static async filterByCaption(caption) {
  //   const searchWords = caption.toLowerCase().trim().split(/\s+/);

  //   return posts.filter((post) => {
  //     const postCaption = post.caption.toLowerCase();
  //     return searchWords.every((word) => postCaption.includes(word));
  //   });
  // }

  // // 2. Add a feature to save a post as a draft and to achieve a post
  // static async postStatus(userId, postId, newStatus) {
  //   const postIndex = posts.findIndex(
  //     (p) => p.id == postId && p.userId == userId
  //   );
  //   if (postIndex === -1) {
  //     return { error: "NOT_FOUND" };
  //   }

  //   const currentStatus = posts[postIndex].status;
  //   const allowedTransitions = {
  //     draft: ["published"],
  //     published: ["archived"],
  //     archived: ["published"],
  //   };

  //   if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
  //     return {
  //       error: "INVALID_TRANSITION",
  //       currentStatus,
  //       newStatus,
  //     };
  //   }

  //   posts[postIndex].status = newStatus;
  //   return { updatedPost: posts[postIndex] };
  // }

  // // 3. Implement sorting of posts based on user engagement and date
  // static async getPostsSorted(by = "engagement") {
  //   // just return data, no error handling here
  //   if (!posts || posts.length === 0) {
  //     return [];
  //   }

  //   // Compute engagement for each post
  //   const postsWithEngagement = posts.map((post) => {
  //     const likes = LikeModel.countByPostId(post.id);
  //     const comments = CommentModel.countByPostId(post.id);
  //     const engagement = likes + comments;

  //     return {
  //       ...post,
  //       engagement,
  //     };
  //   });

  //   if (by === "date") {
  //     return postsWithEngagement.sort(
  //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //     );
  //   }

  //   // Default: sort by engagement, then date
  //   return postsWithEngagement.sort((a, b) => {
  //     if (b.engagement === a.engagement) {
  //       return new Date(b.createdAt) - new Date(a.createdAt);
  //     }
  //     return b.engagement - a.engagement;
  //   });
  // }
}
