import type { Request, Response } from "express";
import * as movieService from "./movies.service";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

// Create a new movie
const createMovie = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id: userId } = req.user as JwtPayload;
    console.log(req.user, "userId in createMovie controller");

    const movie = await movieService.createMovie(req.body, userId.toString());

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: movie,
    });
  }
);

// Get all movies
const getAllMovies = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const movies = await movieService.getAllMovies();

    res.status(200).json({
      success: true,
      data: movies,
    });
  }
);

// Get movie by ID
const getMovieById = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const movie = await movieService.getMovieById(req.params.id!);

    res.status(200).json({
      success: true,
      data: movie,
    });
  }
);

// Rate a movie
const rateMovie = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id: userId } = req.user as JwtPayload;
    
    const updatedMovie = await movieService.rateMovie(
      req.params.id!,
      userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Movie rated successfully",
      data: {
        movieId: updatedMovie._id,
        averageRating: updatedMovie.averageRating,
        totalRatings: updatedMovie.ratings.length,
      },
    });
  }
);

export const movieController = {
  createMovie,
  getAllMovies,
  getMovieById,
  rateMovie,
};
