// User Repository

// Import required packages :-
// Application modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";


// User Repository class
export default class UserRepository {
  // Initialize collection
  constructor() {
    this.collection = "users";
  }

  // method to get collection
  getCollection = () => {
    const db = getDB();
    return db.collection(this.collection);
  }


  // <<< Get user by ID (no passwords) >>>
  async getUserById(userId) {
    try {
      const collection = this.getCollection();

      // find user by ID
      return await collection.findOne(
        { _id: new ObjectId(userId) },
        {
          projection: {
            _id: 1,
            name: 1,
            email: 1,
            gender: 1,
          },
        }
      );
    } catch (err) {
      throw err;
    }
  }


  // <<< Get all users (no passwords) >>>
  async getAllUsers() {
    try {
      const collection = this.getCollection();

      // find all users
      return await collection
        .find(
          {},
          {
            projection: {
              _id: 1,
              name: 1,
              email: 1,
              gender: 1,
            },
          }
        )
        .toArray();
    } catch (err) {
      throw err;
    }
  }


  // <<< Update user by ID (no passwords) >>>
  async updateById(userId, data) {
    try {
      const collection = this.getCollection();

      // update and return updated document
      const updatedUser = await collection.findOneAndUpdate(
        { _id: new ObjectId(userId) }, // filter
        { $set: data }, // update fields
        {
          returnDocument: "after",
          projection: {
            _id: 1,
            name: 1,
            email: 1,
            gender: 1,
            avatar: 1,
          },
        }
      );

      return updatedUser;
    } catch (err) {
      throw err;
    }
  }
}
