import mongoose, { Schema, Document } from 'mongoose';

export interface IMovieRating {
  userId: Schema.Types.ObjectId;
  rating: number;
  createdAt: Date;
}

export interface IMovie extends Document {
  title: string;
  description: string;
  ratings: IMovieRating[];
  createdBy: Schema.Types.ObjectId;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const movieRatingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    ratings: {
      type: [movieRatingSchema],
      default: []
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    averageRating: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Calculate average rating whenever a rating is added or modified
movieSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((sum, item) => sum + item.rating, 0);
    this.averageRating = totalRating / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

const Movie = mongoose.model<IMovie>('Movie', movieSchema);

export default Movie;