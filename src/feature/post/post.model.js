import LikeModel from "../like/like.model.js";
import CommentModel from "../comment/comment.model.js";

// post.model.js
let posts = [
  {
    id: 1,
    userId: 1,
    caption: "First post",
    imageUrl: "https://example.com/image1.jpg",
    status: "published",
    createdAt: new Date("2024-08-01T10:00:00Z"),
  },
  {
    id: 2,
    userId: 2,
    caption: "Second post",
    imageUrl: "https://example.com/image2.jpg",
    status: "published",
    createdAt: new Date("2024-07-28T09:15:00Z"),
  },
  {
    id: 3,
    userId: 1,
    caption: "Third post",
    imageUrl: "https://example.com/image3.jpg",
    status: "published",
    createdAt: new Date("2024-07-30T14:45:00Z"),
  },
  {
    id: 4,
    userId: 2,
    caption: "Morning vibes",
    imageUrl: "https://example.com/image4.jpg",
    status: "published",
    createdAt: new Date("2024-08-03T08:30:00Z"),
  },
  {
    id: 5,
    userId: 1,
    caption: "Beach day",
    imageUrl: "https://example.com/image5.jpg",
    status: "draft",
    createdAt: new Date("2024-07-25T12:00:00Z"),
  },
  {
    id: 6,
    userId: 2,
    caption: "Coffee time",
    imageUrl: "https://example.com/image6.jpg",
    status: "published",
    createdAt: new Date("2024-08-05T07:20:00Z"),
  },
  {
    id: 7,
    userId: 1,
    caption: "City lights",
    imageUrl: "https://example.com/image7.jpg",
    status: "published",
    createdAt: new Date("2024-08-06T19:45:00Z"),
  },
  {
    id: 8,
    userId: 2,
    caption: "Nature walk",
    imageUrl: "https://example.com/image8.jpg",
    status: "draft",
    createdAt: new Date("2024-07-29T16:10:00Z"),
  },
  {
    id: 9,
    userId: 1,
    caption: "Workout session",
    imageUrl: "https://example.com/image9.jpg",
    status: "published",
    createdAt: new Date("2024-08-07T05:50:00Z"),
  },
  {
    id: 10,
    userId: 2,
    caption: "Dinner with friends",
    imageUrl: "https://example.com/image10.jpg",
    status: "published",
    createdAt: new Date("2024-08-08T21:15:00Z"),
  },
  {
    id: 11,
    userId: 1,
    caption: "Art gallery visit",
    imageUrl: "https://example.com/image11.jpg",
    status: "draft",
    createdAt: new Date("2024-08-09T14:25:00Z"),
  },
  {
    id: 12,
    userId: 2,
    caption: "Sunset capture",
    imageUrl: "https://example.com/image12.jpg",
    status: "published",
    createdAt: new Date("2024-08-10T18:40:00Z"),
  },
  {
    id: 13,
    userId: 1,
    caption: "Book reading",
    imageUrl: "https://example.com/image13.jpg",
    status: "published",
    createdAt: new Date("2024-08-11T09:05:00Z"),
  },
  {
    id: 14,
    userId: 2,
    caption: "Mountain hiking",
    imageUrl: "https://example.com/image14.jpg",
    status: "draft",
    createdAt: new Date("2024-08-12T11:50:00Z"),
  },
  {
    id: 15,
    userId: 1,
    caption: "Rainy day",
    imageUrl: "https://example.com/image15.jpg",
    status: "published",
    createdAt: new Date("2024-08-13T17:30:00Z"),
  },
  {
    id: 16,
    userId: 2,
    caption: "Gaming night",
    imageUrl: "https://example.com/image16.jpg",
    status: "published",
    createdAt: new Date("2024-08-14T20:45:00Z"),
  },
  {
    id: 17,
    userId: 1,
    caption: "Family picnic",
    imageUrl: "https://example.com/image17.jpg",
    status: "published",
    createdAt: new Date("2024-08-15T13:10:00Z"),
  },
  {
    id: 18,
    userId: 2,
    caption: "Street photography",
    imageUrl: "https://example.com/image18.jpg",
    status: "draft",
    createdAt: new Date("2024-08-16T15:55:00Z"),
  },
  {
    id: 19,
    userId: 1,
    caption: "Cooking experiment",
    imageUrl: "https://example.com/image19.jpg",
    status: "published",
    createdAt: new Date("2024-08-17T06:25:00Z"),
  },
  {
    id: 20,
    userId: 2,
    caption: "Throwback vacation",
    imageUrl: "https://example.com/image20.jpg",
    status: "published",
    createdAt: new Date("2024-08-18T10:45:00Z"),
  },
];


export default class PostModel {
  constructor(id, userId, caption, imageUrl, status, createdAt = new Date()) {
    this.id = id;
    this.userId = userId;
    this.caption = caption;
    this.imageUrl = imageUrl;
    this.status = status;
    this.createdAt = createdAt;
  }

  static async createNewPost(userId, caption, imageUrl, status) {
    if (!userId || !caption) return null;

    const newPost = new PostModel(
      posts.length + 1,
      userId,
      caption,
      imageUrl,
      status
    );
    posts.push(newPost);
    return newPost;
  }

  static async getAllPosts() {
    return posts.length > 0 ? posts : null;
  }

  // 5. Get all posts (Pagination)
  static async findAll(page, limit, caption) {
    // Filter by caption if provided
    let filteredPosts = posts;

    if (caption) {
      filteredPosts = posts.filter((post) =>
        post.caption.toLowerCase().includes(caption.toLowerCase())
      );
    }

    if (filteredPosts) {
      filteredPosts = filteredPosts.filter(
        (post) => post.status != "draft" && post.status != "archived"
      );
    }

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      totalPosts: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / limit),
      currentPage: page,
    };
  }

  static async getPostById(id) {
    return posts.find((post) => post.id == id) || null;
  }

  static async getPostByUserCredentials(userId) {
    const userPosts = posts.filter((post) => post.userId === userId);
    return userPosts.length > 0 ? userPosts : null;
  }

  static async updatePostById(postId, userId, data) {
    const index = posts.findIndex(
      (post) => post.id === postId && post.userId === userId
    );
    if (index === -1) return null;

    posts[index] = {
      ...posts[index],
      ...data,
    };

    return posts[index];
  }

  static async deletePostById(postId, userId) {
    const index = posts.findIndex(
      (post) => post.id === postId && post.userId === userId
    );
    if (index === -1) return null;

    const deleted = posts[index];
    posts.splice(index, 1);
    return deleted;
  }

  // Additional Task
  // 1. Filter by caption
  static async filterByCaption(caption) {
    const searchWords = caption.toLowerCase().trim().split(/\s+/);

    return posts.filter((post) => {
      const postCaption = post.caption.toLowerCase();
      return searchWords.every((word) => postCaption.includes(word));
    });
  }

  // 2. Add a feature to save a post as a draft and to achieve a post
  static async postStatus(userId, postId, newStatus) {
    const postIndex = posts.findIndex(
      (p) => p.id == postId && p.userId == userId
    );
    if (postIndex === -1) {
      return { error: "NOT_FOUND" };
    }

    const currentStatus = posts[postIndex].status;
    const allowedTransitions = {
      draft: ["published"],
      published: ["archived"],
      archived: ["published"],
    };

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      return {
        error: "INVALID_TRANSITION",
        currentStatus,
        newStatus,
      };
    }

    posts[postIndex].status = newStatus;
    return { updatedPost: posts[postIndex] };
  }

  // 3. Implement sorting of posts based on user engagement and date
  static async getPostsSorted(by = "engagement") {
    // just return data, no error handling here
    if (!posts || posts.length === 0) {
      return [];
    }

    // Compute engagement for each post
    const postsWithEngagement = posts.map((post) => {
      const likes = LikeModel.countByPostId(post.id);
      const comments = CommentModel.countByPostId(post.id);
      const engagement = likes + comments;

      return {
        ...post,
        engagement,
      };
    });

    if (by === "date") {
      return postsWithEngagement.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    // Default: sort by engagement, then date
    return postsWithEngagement.sort((a, b) => {
      if (b.engagement === a.engagement) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return b.engagement - a.engagement;
    });
  }
}
