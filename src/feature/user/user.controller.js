// Import required packages
import UserRepository from "./user.repository.js";
import ApplicationError from "../../../utils/applicationError.js";

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    // 1. get - user-details (no passwords)
    async getUser(req, res, next) {
        try {
            const userId = req.params.userId;
            if (!userId) {
                throw new ApplicationError("User ID required", 400);
            }

            const user = await this.userRepository.getUserById(userId);
            if (!user) {
                throw new ApplicationError("User not found", 404);
            }

            return res.status(200).json({
                message: "user details retrieved succesfully",
                user,
            });
        } catch (err) {
            next(err);
        }
    }

    // 2. get - all-user-details (no passwords)
    async getAllUsers(req, res, next) {
        try {
            const users = await this.userRepository.getAllUsers();

            if (!users || users.length === 0) {
                throw new ApplicationError("No users found.", 404);
            }

            return res.status(200).json({
                message: "All user details retrieved succesfully",
                users
            });
        } catch (err) {
            next(err);
        }
    }

    // 3. post - update-user-details (no passwords)
    async updateById(req, res, next) {
        try {
            const userId = req.params.userId;
            const { name, gender } = req.body;
            if (!userId) {
                throw new ApplicationError("User ID required", 400);
            }

            const updateData = {};

            // Validate and add name if provided
            if (name !== undefined) {
                if (typeof name !== "string" || !name.trim()) {
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


            const updatedUser = await this.userRepository.updateById(userId, updateData);

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