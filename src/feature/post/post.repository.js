import ApplicationError from "../../../utils/applicationError.js";
import { getDB } from "../../config/mongodb.js";

export default class PostRepository{
    constructor(){
        this.collection = 'posts'
    }

    async createNewPost(newPost){
        try{
        // 1. get db
        const db = getDB();
        // 2. collection
        const collection = db.collection(this.collection);
        // 3. add post
        await collection.insertOne(newPost);
        }catch(err){
            throw new ApplicationError("Something went wrong with the database", 400)
        }
    }

}