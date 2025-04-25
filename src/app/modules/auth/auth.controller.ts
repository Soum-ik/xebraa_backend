import type { Request, Response } from "express";
import * as authService from "./auth.service";
import catchAsync from "../../utils/catchAsync";

// Register a new user
const register = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { user, tokens } = await authService.registerUser(req.body);

    // Set refresh token as HttpOnly cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        accessToken: tokens.accessToken,
      },
    });
  }
);

// Login user
const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { user, tokens } = await authService.loginUser(req.body);

  // Set refresh token as HttpOnly cookie
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      user,
      accessToken: tokens.accessToken,
    },
  });
});

// Refresh token
const refreshTokenHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const refreshTokenString = req.cookies.refreshToken;

    const { accessToken } = await authService.refreshToken(refreshTokenString);

    res.status(200).json({
      success: true,
      data: {
        accessToken,
      },
    });
  }
);

// Logout user
const logout = async (req: Request, res: Response): Promise<void> => {
  // Clear refresh token cookie
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

export const authController = {
  register,
  login,
  refreshTokenHandler,
  logout,
};
