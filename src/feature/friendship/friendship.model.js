// Friendship Model
export default class FriendshipModel {
    constructor(userId, friendId, status, createdAt = new Date(), updatedAt = new Date()) {
        this.userId = userId;
        this.friendId = friendId;
        this.status = status; // 'pending', 'accepted', 'rejected'
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}