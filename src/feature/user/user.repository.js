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

    async setResetToken(email, token, expiry){
        try{
              // 1. get database
            const db = getDB();
            // 2. get collection
            const collection = db.collection(this.collection);
            // 3. collection updateOne
            await collection.updateOne(
                {email},
                {$set: {resetToken: token, resetTokenExpiry: expiry}},
            );
        }catch(err){
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


}