import UserRepository from "./user.repository.js";
import ApplicationError from "../../../utils/applicationError.js";

export default class UserController {

    // constructor
    constructor() {
        this.userRepository = new UserRepository();
    }

    // 1. async get-details (no passwords)
    async getUser(req, res, next) {
        try {
            const userID = req.params.userId;
            if (!userID) {
                throw new ApplicationError("User ID is missing", 400);
            }
            const user = await this.userRepository.getUser(userID);

            return res.status(200).json({
                message: "user details retrieved succesfully",
                user
            });
        } catch (err) {
            next(err);
        }
    }

    // 2. async get-all-details (no passwords)
    async getAllUser(req, res, next) {
        try {
            const allUser = await this.userRepository.getAllUser();

            return res.status(200).json({
                message: "All user details retrieved succesfully",
                users: allUser
            });
        } catch (err) {
            next(err);
        }
    }

    // 3. async update-details (no passwords)
    async updateById(req, res, next) {
        try {
            const userID = req.params.userId;
            const { name, gender } = req.body;

            if (!userID) {
                throw new ApplicationError("User ID is missing", 400);
            }

            const updateData = {};
            // Validate and add name if provided
            if (name !== undefined) {
                if (!name || typeof name !== "string" || !name.trim()) {
                    throw new ApplicationError("Valid name is required", 400);
                }
                updateData.name = name.trim();
            }

            // Validate and add gender if provided
            if (gender !== undefined) {
                const allowedGenders = ["male", "female", "other"];
                if (!allowedGenders.includes(gender.toLowerCase())) {
                    throw new ApplicationError(
                        `Gender must be one of: ${allowedGenders.join(", ")}`,
                        400
                    );
                }
                updateData.gender = gender.toLowerCase();
            }

            // If no fields provided at all
            if (Object.keys(updateData).length === 0) {
                throw new ApplicationError(
                    "At least one field (name or gender) is required",
                    400
                );
            }


            const updatedUser = await this.userRepository.updateById(userID,updateData);

            if (!updatedUser) {
                throw new ApplicationError("User not found or not updated", 404);
            }

            return res.status(200).json({
                message: "User updated succesfully ",
                updatedUser: updatedUser
            })
        } catch (err) {
            next(err);
        }
    }
}