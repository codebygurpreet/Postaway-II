// Step 1: Import MongoClient
import {MongoClient} from 'mongodb';

// Step 2: Define MongoDB URL
const url = process.env.DB_URL;
const dbname = process.env.DB_NAME;

// Step 3: Create a function to connect with MongoDB
let client;
export const connectToMongoDB = async () => {
    if(!url) throw new Error("DB_URL not found in env");

    try{
        client = await MongoClient.connect(url);
        console.log("Mongodb is connected");
    }catch(err){
        return console.log(err)
    }
}

// Step 4: Export db
export const getDB = () => {
    if(!client) throw new Error("MOngoDB not connected yet");
    return client.db(dbname);
}

