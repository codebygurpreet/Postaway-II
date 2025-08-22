export default class ApplicationError extends Error {
    constructor(message, statusCode = 500) {
        super(message)
        //Sets the name of the error to "ApplicationError"
        this.name = this.constructor.name 
        this.statusCode = statusCode

        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor); // Create a clean stack trace for  error
        }
    }

}