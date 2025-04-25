import jwt from "jsonwebtoken";
import User from "./auth.model";
import type {
  RegisterUserInput,
  LoginUserInput,
  UserPayload,
  Tokens,
  RefreshTokenPayload,
} from "./auth.interface";
import jwtConfig from "../../config/index";

// Generate access token
export const generateAccessToken = (user: any): string => {
  const payload: UserPayload = {
    userId: user._id,
    name: user.name,
    email: user.email,
  };

  return jwt.sign(payload, jwtConfig.jwt_access_secret as string, {
    expiresIn: "10s",
  });
};

// Generate refresh token
export const generateRefreshToken = (user: any): string => {
  const payload: RefreshTokenPayload = {
    userId: user._id,
    tokenVersion: 0, // This could be incremented when you want to invalidate all tokens
  };

  return jwt.sign(payload, jwtConfig.jwt_refresh_secret as string, {
    expiresIn: '1d',
  });
};

// Generate tokens
export const generateTokens = (user: any): Tokens => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

// Register a new user
export const registerUser = async (
  userData: RegisterUserInput
): Promise<{ user: any; tokens: Tokens }> => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Create and save new user
    const user = new User(userData);
    await user.save();

    // Generate tokens
    const tokens = generateTokens(user);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      tokens,
    };
  } catch (error) {
    throw error;
  }
};

// Login user
export const loginUser = async (
  loginData: LoginUserInput
): Promise<{ user: any; tokens: Tokens }> => {
  try {
    console.log(loginData, 'user data');
    
    // Find user
    const user = await User.findOne({ email: loginData.email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(loginData.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate tokens
    const tokens = generateTokens(user);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      tokens,
    };
  } catch (error) {
    throw error;
  }
};

// Refresh token
export const refreshToken = async (
  refreshTokenString: string
): Promise<{ accessToken: string }> => {
  try {
    if (!refreshTokenString) {
      throw new Error("Refresh token is required");
    }

    // Verify refresh token
    const payload = jwt.verify(
      refreshTokenString,
      jwtConfig.jwt_refresh_secret as string
    ) as RefreshTokenPayload;

    // Find user
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    return { accessToken };
  } catch (error) {
    throw error;
  }
};
