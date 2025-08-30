// importing modules
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../../utils/applicationError.js";
import { ObjectId } from "mongodb";

export default class UserRepository{

    // constructor
    constructor(){
        this.collection = "user"
    }

    // async get individual users
    async getUser(userId){
        try{
        // step 1. getting dbs
        const db = getDB();
        // step 2. getting the collection
        const collection = db.collection(this.collection)
        const user = await collection.findOne(
            {_id: new ObjectId(userId)}, // filter
            {projection: {name:1, _id:0}} // select only name
        )
        return user;
        }catch(err){
            throw new ApplicationError("SOmething went wrong with the database", 500)
        }
    }

}
