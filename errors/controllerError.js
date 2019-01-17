module.exports = class ControllerError extends Error {

    constructor(msg, status) {
        super(msg);
        this.name = 'ControllerError';
        this.msg = msg;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
};