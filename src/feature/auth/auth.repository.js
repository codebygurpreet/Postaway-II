// Auth Repository
// Import required packags :-
// Application modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import ApplicationError from "../../../utils/applicationError.js";

// Auth Repository class
export default class AuthRepository {
    // Initialize collection
    constructor() {
        this.collection = 'users';
    }

    // method to get collection
    getCollection = () => {
        const db = getDB();
        return db.collection(this.collection);
    }


    // <<< user signup >>>
    async signUp(newUser) {
        try {
            const collection = this.getCollection();

            await collection.insertOne(newUser);

            delete newUser.password;
            return newUser;
        } catch (err) {
            throw err;
        }
    }


    // <<< find user by email >>>
    // used in signup and signin both
    async findByEmail(email) {
        try {
            const collection = this.getCollection();

            // finding user by email
            return await collection.findOne(
                {
                    email
                },
                {
                    projection: {
                        password: 1,
                        name: 1,
                        email: 1,
                        gender: 1,
                        otp: 1,
                        otpExpiry: 1,
                        refreshTokens: 1,
                    },
                }
            );
        } catch (err) {
            throw err;
        }
    }


    // <<< logout from current device >>>
    // logout user from current device by finding refresh token
    async findByRefreshToken(refreshToken) {
        try {
            const collection = this.getCollection();

            // finding user by refresh token
            return await collection.findOne({ refreshTokens: refreshToken });
        } catch (err) {
            throw err;
        }
    }

    // logout user from current device by removing refresh token
    async removeRefreshToken(userId, refreshToken) {
        try {
            const collection = this.getCollection();

            // removing refresh token from db
            await collection.updateOne(
                { _id: new ObjectId(userId) },
                { $pull: { refreshTokens: refreshToken } }
            );
        } catch (err) {
            throw err;
        }
    }


    // <<< logout from all devices >>>
    // Method to logout user from all devices by removing all refresh tokens
    async removeAllRefreshToken(userId) {
        try {
            const collection = this.getCollection();

            // removing all refresh tokens from db
            await collection.updateOne(
                { _id: new ObjectId(userId) },
                { $set: { refreshTokens: [] } }
            );
        } catch (err) {
            throw err;
        }
    }


    // <<< set OTP and expiry for a user in the database >>>
    setOtp = async (email, otp, otpExpiry) => {
        try {
            const collection = this.getCollection();

            // set otp in the db
            const result = await collection.updateOne(
                { email: email },
                {
                    $set: {
                        otp,
                        otpExpiry
                    }
                }
            );

            return result.modifiedCount
        } catch (err) {
            throw err;
        }
    }


    // <<< Verify OTP for password reset >>>
    clearOtp = async (email) => {
        try {
            const collection = this.getCollection();

            // Clear otp from db
            await collection.updateOne(
                { email: email },
                {
                    $unset: {
                        otp: 1,
                        otpExpiry: 1,
                    }
                }
            );
        } catch (err) {
            throw err;
        }
    }


    // <<< Update password after OTP verified >>>
    async updatePassword(email, newPassword) {
        try {
            const collection = this.getCollection();

            // update password
            return await collection.updateOne(
                { email },
                {
                    $set: { password: newPassword },
                    $unset: { otp: "", otpExpiry: "" },
                }
            );
        } catch (err) {
            throw err;
        }
    }




    // --- utilities fuctions ---
    // add refresh token
    addRefreshToken = async (userId, refreshToken) => {
        try {

            // 1. get database
            const collection = this.getCollection();

            // 2. collection updateOne
            await collection.updateOne(
                { _id: userId }, // filter
                { $push: { refreshTokens: refreshToken } } // update
            );
        } catch (err) {
            throw err;
        }
    }


}






// async setResetToken(email, token, expiry) {
//     try {
//         // 1. get database
//         const db = getDB();
//         // 2. get collection
//         const collection = db.collection(this.collection);
//         // 3. collection updateOne
//         await collection.updateOne(
//             { email },
//             { $set: { resetToken: token, resetTokenExpiry: expiry } },
//         );
//     } catch (err) {
//         nextTick(err)
//     }
// }


// async findByResetToken(token) {
//     try {
//         const db = getDB();

//         const collection = db.collection(this.collection);

//         return await collection.findOne({ resetToken: token });
//     } catch (err) {
//         throw new ApplicationError("Something went wrong with database", 500);
//     }
// }

// async updatePasswordWithToken(token, newPassword) {
//     try {
//         const db = getDB();

//         const collection = db.collection(this.collection);

//         return await collection.updateOne(
//             { resetToken: token },
//             {
//                 $set: { password: newPassword },
//                 $unset: { resetToken: "", resetTokenExpiry: "" },
//             }
//         );
//     } catch (err) {
//         throw new ApplicationError("Something went wrong with database", 500);
//     }
// }
