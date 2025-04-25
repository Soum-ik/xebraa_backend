import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";

import catchAsync from "../utils/catchAsync";
import User from "../modules/auth/auth.model";
import { Types } from "mongoose";

export type DecodedToken = {
  id: number;
  email: string;
  name: string;
  userId: string;
};

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;


    console.log(decoded, "decoded in auth middleware");
    

    const findUser = await User.findById(decoded.userId);
    console.log(findUser, "findUser in auth middleware");
    
    if (!findUser) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
    }

    const payload = {
      id: decoded.userId, // or string if you convert it,
      email: decoded.email,
      name: decoded.name,
    } as DecodedToken; // Cast to DecodedToken type

    req.user = payload as DecodedToken; // Cast to any to avoid TypeScript error
    next();
  });
};

export default auth;
