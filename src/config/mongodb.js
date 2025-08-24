// Step 1: Import MongoClient
import {MongoClient} from 'mongodb';

// Step 2: Define MongoDB URL
const url = process.env.DB_URL;

// Step 3: Create a function to connect with MongoDB
const connectToMongoDB = () => {
    MongoClient.connect(url)
    .then((client)=>{
        console.log("MOngodb is connected")
    })
    .catch((err) => {
        console.log(err.message);
    })
}


// Step 4: Export the function
export default connectToMongoDB;


