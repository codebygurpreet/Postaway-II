// Post Model
// Handles creation of post objects with essential fields

export default class PostModel {
  constructor(userId, caption, imageUrl, status, createdAt = new Date()) {
    this.userId = userId;
    this.caption = caption;
    this.imageUrl = imageUrl;
    this.status = status;
    this.createdAt = createdAt;
  }
}