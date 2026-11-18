import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Course from '../models/Course.js';
const router = Router();
router.get('/me/courses', protect, async (req, res, next) => {
  try {
    const courses = await Course.find({ students: req.user.id }).populate('instructor', 'name');
    res.json(courses);
  } catch (e) { next(e); }
});
export default router;
