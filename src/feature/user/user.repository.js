// importing modules
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../../utils/applicationError.js";
import { ObjectId } from "mongodb";

export default class UserRepository{

    // constructor
    constructor(){
        this.collection = "user"
    }

    // 1. async get-details (no passwords)
    async getUser(userId){
        try{
        // step 1. getting dbs
        const db = getDB();
        // step 2. getting the collection
        const collection = db.collection(this.collection)
        const user = await collection.findOne(
            {_id: new ObjectId(userId)}, // filter
            {projection: {name:1, _id:1}} // select only name
        )
        return user;
        }catch(err){
            throw new ApplicationError("SOmething went wrong with the database", 500)
        }
    }

    // 2. async get-all-details (no passwords)
    async getAllUser(){
        try{
        // step 1. getting dbs
        const db = getDB();
        // step 2. getting the collection
        const collection = db.collection(this.collection)
        const allUser = await collection.find(
            {}, // filter
            {projection: {name:1, _id:0}} // select name
        ).toArray();
        return allUser;
        }catch(err){
            throw new ApplicationError("SOmething went wrong with the database", 500)
        }
    }

    // 3. async update-details (no passwords)
    // async getAllUser(){
    //     try{
       
    //     }catch(err){
    //         throw new ApplicationError("SOmething went wrong with the database", 500)
    //     }
    // }

}
