import { Types } from "mongoose";

export interface CreateMovieInput {
  title: string;
  description: string;
}

export interface MovieRatingInput {
  rating: number;
}

export interface MovieRatingPayload {
  movieId: string;
  userId: string;
  rating: number;
}

export interface MoviePayload {
  _id: Types.ObjectId;
  title: string;
  description: string;
  ratings: MovieRatingPayload[];
  averageRating: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
