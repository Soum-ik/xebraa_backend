import express from "express";
import { authController } from "./auth.controller";
import { authenticate } from "./auth.middleware";
import { registerSchema, loginSchema } from "./auth.validation";

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", authController.register);

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", authController.login);

/**
 * @route   POST /auth/refresh-token
 * @desc    Refresh access token
 * @access  Public (but requires refresh token cookie)
 */
router.post("/refresh-token", authController.refreshTokenHandler);

/**
 * @route   POST /auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post("/logout", authController.logout);

export const authRoute = router;
