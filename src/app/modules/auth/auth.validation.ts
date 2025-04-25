import type { RegisterUserInput, LoginUserInput } from './auth.interface';
import Joi from 'joi';

export const registerSchema = Joi.object<RegisterUserInput>({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
});

export const loginSchema = Joi.object<LoginUserInput>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});