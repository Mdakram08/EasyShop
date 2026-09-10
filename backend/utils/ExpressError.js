class ExpressError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
        this.name="ExpressError";
        Error.captureStackTrace(this,this.constructor)
    }
}

export default ExpressError