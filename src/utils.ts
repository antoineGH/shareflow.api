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

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

function handleError(err: unknown, res: Response) {
  console.error(err);
  if (err instanceof Error) {
    if (err instanceof MissingFieldError) {
      res.status(400).send(err.message);
    } else if (err instanceof DatabaseError) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  } else {
    res.status(500).send("An unknown error occurred.");
  }
}

function throwError(err: Error | unknown) {
  console.error(err);
  if (err instanceof Error) {
    if (err instanceof MissingFieldError) {
      throw err;
    } else {
      throw new DatabaseError("An error occurred with the user.");
    }
  } else {
    throw new Error("An unknown error occurred.");
  }
}

export {
  errorHandler,
  MissingFieldError,
  DatabaseError,
  handleError,
  throwError,
};
