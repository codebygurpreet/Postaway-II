// Import required packags
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../../utils/applicationError.js";
import {ObjectId} from "mongodb";

export default class AuthRepository {
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

    async findByEmail(email) {
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

    async addRefreshToken(userId, refreshToken) {
    try {
      // getting the access of the db
      const db = getDB();

      const collection = db.collection(this.collection);
      await collection.updateOne(
        { _id: userId },
        { $push: { refreshTokens: refreshToken } }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

    async setResetToken(email, token, expiry) {
        try {
            // 1. get database
            const db = getDB();
            // 2. get collection
            const collection = db.collection(this.collection);
            // 3. collection updateOne
            await collection.updateOne(
                { email },
                { $set: { resetToken: token, resetTokenExpiry: expiry } },
            );
        } catch (err) {
            nextTick(err)
        }
    }


    async findByResetToken(token) {
        try {
            const db = getDB();

            const collection = db.collection(this.collection);

            return await collection.findOne({ resetToken: token });
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async updatePasswordWithToken(token, newPassword) {
        try {
            const db = getDB();

            const collection = db.collection(this.collection);

            return await collection.updateOne(
                { resetToken: token },
                {
                    $set: { password: newPassword },
                    $unset: { resetToken: "", resetTokenExpiry: "" },
                }
            );
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    // logout

    async findByRefreshToken(refreshToken) {
        try {
            // getting the access of the db
            const db = getDB();

            // getting the access of the collection
            const collection = db.collection(this.collection);

            return await collection.findOne({ refreshTokens: refreshToken });
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async removeRefreshToken(userId, refreshToken) {
        try {
            // getting the access of the db
            const db = getDB();

            // getting the access of the collection
            const collection = db.collection(this.collection);
            await collection.updateOne(
                { _id: new ObjectId(userId) },
                { $pull: { refreshTokens: refreshToken } }
            );
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }


    // logout all
    async removeAllRefreshToken(userId) {
        try {
            // getting the access of the db
            const db = getDB();

            // getting the access of the collection
            const collection = db.collection(this.collection);

            const result = await collection.updateOne(
                { _id: new ObjectId(userId) },
                { $set: { refreshTokens: [] } }
            );

        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }


}