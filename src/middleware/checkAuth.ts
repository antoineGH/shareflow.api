import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function checkAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req["user"] = decoded as jwt.JwtPayload;
    next();
  } catch (err) {
    res.status(403).json({ message: "Failed to authenticate token" });
  }
}

export { checkAuth };
