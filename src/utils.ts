import type { Response } from "express";

const errorHandler = (err: any, res: Response) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
};

export { errorHandler };
