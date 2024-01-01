"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.AlreadyExists = exports.WrongTypeError = exports.RessourceNotFoundError = exports.DatabaseError = exports.MissingFieldError = exports.errorHandler = void 0;
const errorHandler = (err, res) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
};
exports.errorHandler = errorHandler;
class MissingFieldError extends Error {
    constructor(message) {
        super(message);
        this.name = "MissingFieldError";
    }
}
exports.MissingFieldError = MissingFieldError;
class RessourceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "RessourceNotFoundError";
    }
}
exports.RessourceNotFoundError = RessourceNotFoundError;
class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseError";
    }
}
exports.DatabaseError = DatabaseError;
class WrongTypeError extends Error {
    constructor(message) {
        super(message);
        this.name = "WrongTypeError";
    }
}
exports.WrongTypeError = WrongTypeError;
class AlreadyExists extends Error {
    constructor(message) {
        super(message);
        this.name = "AlreadyExists";
    }
}
exports.AlreadyExists = AlreadyExists;
function handleError(err, res) {
    console.error(err);
    if (err instanceof Error) {
        switch (err.constructor) {
            case MissingFieldError:
                res.status(400).send(err.message);
                break;
            case RessourceNotFoundError:
                res.status(404).send(err.message);
                break;
            case WrongTypeError:
            case DatabaseError:
                res.status(500).send(err.message);
                break;
            default:
                res.status(500).send(err.message);
        }
    }
    else {
        res.status(500).send("An unknown error occurred.");
    }
}
exports.handleError = handleError;
