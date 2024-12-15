class ApiError extends Error {
    //e.g 404, 500
    statusCode: number;

    //states if the error is operational(i.e, database or network) or program error(bug that can be fixed)
    isOperational: boolean

    constructor(statusCode: number, message: string, stack = '', isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        //tells us where the error occured
        if(stack) {
            this.stack = stack;

            //create a new stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default ApiError;