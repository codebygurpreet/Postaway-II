import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import CommentModel from "./comment.model.js";

export default class CommentRepository {

    constructor() {
        // MongoDB collection name
        this.commentRepository = "comments"; 
    }

    async createComment(userID, postID, content){
        try {
        // 1. get db
        const db = getDB();

        // 2. collection
        const collection = db.collection(this.commentRepository);

        // 3. create comment object
        const newComment = new CommentModel(userID, postID, content);

        // 4. commentcomment insert in mongoDB
        const result = await collection.insertOne(newComment);
        return newComment;

        } catch (err) {
            console.error("Error in createComment:", err.message);
        } 
    }


}