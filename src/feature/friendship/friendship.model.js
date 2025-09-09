// Friendship Model
export class FriendshipModel {
    constructor(userId1, userId2, status, actionUserId, createdAt = new Date(), updatedAt = new Date()) {
        this.userId1 = userId1;
        this.userId2 = userId2;
        this.status = status; // 'pending', 'accepted', 'rejected'
        this.actionUserId = actionUserId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}