export default class ApplicationError extends Error {
    constructor(message, statusCode = 500) {
        super(message) // sets this.message = message
        this.name = this.constructor.name // sets this.name = "ApplicationError"
        this.statusCode = statusCode

        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor); 
            // Create a clean stack trace for  error
            // It gives you a cleaner, more accurate stack trace that points directly to the problem location, not the error class constructor.
        }
    }

}