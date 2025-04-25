// types/express/index.d.ts
import { DecodedToken } from "../../middlewares/auth"; // adjust path as needed

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}
