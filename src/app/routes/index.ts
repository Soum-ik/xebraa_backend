import express from 'express';
import { authRoute } from '../modules/auth/auth.route';
import { movieRoute } from '../modules/movies/movies.route';

const router = express.Router();

// Example route - properly formatted
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

router.use('/auth', authRoute)
router.use('/movies', movieRoute)

export default router;
