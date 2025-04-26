import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";

import catchAsync from "../utils/catchAsync";
import User from "../modules/auth/auth.model";

export type DecodedToken = {
  id: number;
  email: string;
  name: string;
  userId: string;
};

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const findUser = await User.findById(decoded.userId);
    
    if (!findUser) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
    }

    const payload = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    } as DecodedToken; 

    req.user = payload as DecodedToken;  
    next();
  });
};

export default auth;
