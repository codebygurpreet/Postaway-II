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
    // async updateUser(req, res, next) {
    //     try {
           
    //     } catch (err) {
    //         next(err);
    //     }
    // }
}