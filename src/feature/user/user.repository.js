// importing modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import ApplicationError from "../../../utils/applicationError.js";

export default class UserRepository {

    // constructor
    constructor() {
        this.collection = "users"
    }

    // get collection
    getCollection() {
        const db = getDB();
        return db.collection(this.collection);
    };

    // 1. async get-details (no passwords)
    async getUserById(userId) {
        try {
            const collection = this.getCollection();

            const user = await collection.findOne(
                { _id: new ObjectId(userId)}, // filter
                {
                    projection: {
                        _id: 1,
                        name: 1,
                        gender: 1,
                    }
                }
            );

            return user;
        } catch (err) {
            throw err;
        }
    }

    // 2. async get-all-details (no passwords)
    async getAllUsers() {
        try {
            const collection = this.getCollection();

            const users = await collection.find(
                {}, // filter
                {
                    projection: {
                        _id: 1,
                        name: 1,
                        gender: 1,
                    }
                }
            ).toArray();

            return users;
        } catch (err) {
            throw err;
        }
    }

    // 3. async update-details (no passwords)
    async updateById(userId, data) {
        try {
            const collection = this.getCollection();

            // update and return updated doc
            const updatedUser = await collection.findOneAndUpdate(
                { _id: new ObjectId(userId)}, // filter
                { $set: data }, // updating field
                {
                    returnDocument: "after",
                    projection: {
                        password: 0,
                        refreshTokens: 0
                    }
                } // return the updated document instead of the old one and project data
            );
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }

}
