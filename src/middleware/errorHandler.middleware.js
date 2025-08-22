import ApplicationError from "../../utils/applicationError.js";

export default function errorHandler(err,req,res,next){
    console.error("Error", err )
    const statusCode = err instanceof ApplicationError ? err.statusCode : 500;
    const message = err instanceof ApplicationError ? err.message : "Internal Server Error";

    res.status(statusCode).json({success: false, message});
}