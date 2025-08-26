// Import required packags
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../../utils/applicationError.js";

export default class UserRepository {
    constructor() {
        this.collection = 'user';
    }

    async signUp(newUser) {
        try {
            // 1. get database
            const db = getDB();
            // 2. get collection
            const collection = db.collection(this.collection)
            // 3. collection insert user
            await collection.insertOne(newUser);
            delete newUser.password;
            return newUser;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Database", 500);
        }
    }

    async signIn(email) {
        try {
            // 1. get database
            const db = getDB();
            // 2. get collection
            const collection = db.collection(this.collection);
            // 3. collection find email
            return await collection.findOne({ email });
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with Database", 500);
        }
    }
}