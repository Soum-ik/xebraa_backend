import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const responseData: TResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || undefined,
    data: data.data || undefined,
    error: data.error || null,
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;