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
            {projection: {name:1, gender: 1, _id:1}} // select only name
        )
        return user;
        }catch(err){
            throw new ApplicationError("Something went wrong with the database", 500)
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
            throw new ApplicationError("Something went wrong with the database", 500)
        }
    }

    // 3. async update-details (no passwords)
    async updateById(userID, data){
        try{
        // step 1. getting dbs
        const db = getDB();

        // step 2. getting the collection
        const collection = db.collection(this.collection);

        // step 3. update and return updated doc
        const updatedUser = await collection.findOneAndUpdate(
            {_id: new ObjectId(userID)}, // filter
            {$set: data}, // updating field
            {  
                returnDocument: "after",
                projection: {
                    password:0, 
                    refreshTokens:0
                }
            } // return the updated document instead of the old one and project data
        );
        return updatedUser;
        }catch(err){
            throw new ApplicationError("Something went wrong with the database", 500)
        }
    }

}
