// User Controller

// Import required packages :-
// Application modules 
import UserRepository from "./user.repository.js";
import ApplicationError from "../../../utils/applicationError.js";


// User Controller class
export default class UserController {
  // Initialize repository
  constructor() {
    this.userRepository = new UserRepository();
  }


  // <<< Get user details by ID (no passwords) >>>
  getUser = async (req, res, next) => {
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
        success: true,
        message: "User details retrieved successfully",
        user,
      });
    } catch (err) {
      next(err);
    }
  }


  // <<< Get all user details (no passwords) >>>
  getAllUsers = async (req, res, next) => {
    try {
      const users = await this.userRepository.getAllUsers();

      if (!users || users.length === 0) {
        throw new ApplicationError("No users found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "All user details retrieved successfully",
        users,
      });
    } catch (err) {
      next(err);
    }
  }


  // <<< Update user details (no passwords) >>>
  updateById = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const { name, gender } = req.body;

      if (!userId) {
        throw new ApplicationError("User ID required", 400);
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
        if (!allowedGenders.includes(gender.toLowerCase().trim())) {
          throw new ApplicationError(
            `Gender must be one of: ${allowedGenders.join(", ")}`,
            400
          );
        }
        updateData.gender = gender.trim();
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
        success: true,
        message: "User updated successfully",
        updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }
}
