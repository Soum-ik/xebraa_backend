import express from "express";
import { movieController } from "./movies.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

/**
 * @route   POST /movies
 * @desc    Create a new movie
 * @access  Protected
 */
router.post("/", auth(), movieController.createMovie);

/**
 * @route   GET /movies
 * @desc    Get all movies
 * @access  Public
 */
router.get("/", movieController.getAllMovies);

/**
 * @route   GET /movies/:id
 * @desc    Get movie by ID
 * @access  Public
 */
router.get("/:id", movieController.getMovieById);

/**
 * @route   POST /movies/:id/rate
 * @desc    Rate a movie
 * @access  Protected
 */
router.post("/:id/rate", auth(), movieController.rateMovie);

export const movieRoute = router;
