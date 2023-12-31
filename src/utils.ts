import type { Response } from "express";

const errorHandler = (err: any, res: Response) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
};

class MissingFieldError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingFieldError";
  }
}

class RessourceNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RessourceNotFoundError";
  }
}

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

class WrongTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WrongTypeError";
  }
}

class AlreadyExists extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlreadyExists";
  }
}

function handleError(err: unknown, res: Response) {
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
  } else {
    res.status(500).send("An unknown error occurred.");
  }
}

export {
  errorHandler,
  MissingFieldError,
  DatabaseError,
  RessourceNotFoundError,
  WrongTypeError,
  AlreadyExists,
  handleError,
};
