import UserRepository from "./user.repository.js";
import ApplicationError from "../../../utils/applicationError.js";

export default class UserController {

    // constructor
    constructor() {
        this.userRepository = new UserRepository();
    }

    // async get individual users
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
}