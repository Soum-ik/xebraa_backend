import { Types } from "mongoose";
import Movie from "./movies.model";
import type { CreateMovieInput, MovieRatingInput } from "./movies.interface";
import { getSocketIO } from "../../socket/socket-server";

// Create a new movie
export const createMovie = async (
  movieData: CreateMovieInput,
  userId: string
): Promise<any> => {
  try {
    const newMovie = new Movie({
      ...movieData,
      createdBy: userId,
    });

    const savedMovie = await newMovie.save();

    // Emit socket event for new movie
    const io = getSocketIO();
    io.emit("movie-added", {
      _id: savedMovie._id,
      title: savedMovie.title,
      description: savedMovie.description,
      averageRating: savedMovie.averageRating,
      createdAt: savedMovie.createdAt,
    });

    return savedMovie;
  } catch (error) {
    throw error;
  }
};

// Get all movies
export const getAllMovies = async (): Promise<any> => {
  try {
    return await Movie.find()
      .sort({ createdAt: -1 })
      .select(
        "_id title description releaseYear genre director posterUrl averageRating createdAt"
      );
  } catch (error) {
    throw error;
  }
};

// Get movie by ID
export const getMovieById = async (movieId: string): Promise<any> => {
  try {
    const movie = await Movie.findById(movieId)
      .populate("createdBy", "name")
      .populate("ratings.userId", "name");

    if (!movie) {
      throw new Error("Movie not found");
    }

    return movie;
  } catch (error) {
    throw error;
  }
};

// Rate a movie
export const rateMovie = async (
  movieId: string,
  userId: string,
  ratingData: MovieRatingInput
): Promise<any> => {
  console.log(
    movieId,
    userId,
    ratingData,
    "movieId, userId, ratingData in rateMovie service"
  );

  try {
    // Find the movie
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error("Movie not found");
    }

    // Check if user has already rated this movie
    const existingRatingIndex = movie.ratings.findIndex(
      (rating) => rating.userId.toString() === userId
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      if (movie.ratings[existingRatingIndex]) {
        movie.ratings[existingRatingIndex].rating = ratingData.rating;
        movie.ratings[existingRatingIndex].createdAt = new Date();
      }
    } else {
      // Add new rating

      movie.ratings.push({
        userId: new Types.ObjectId(userId), // ✅ convert to ObjectId
        rating: ratingData.rating,
        createdAt: new Date(),
      });
    }

    // Save the updated movie (average rating is calculated in pre-save hook)
    const updatedMovie = await movie.save();

    // Emit socket event for rating update
    const io = getSocketIO();
    io.emit("rating-updated", {
      movieId: movie._id,
      averageRating: updatedMovie.averageRating,
      totalRatings: updatedMovie.ratings.length,
    });

    return updatedMovie;
  } catch (error) {
    throw error;
  }
};
