import { Router } from 'express';
import Course from '../models/Course.js';
import { protect, instructorOnly } from '../middleware/auth.js';
const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.search) filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { category: { $regex: req.query.search, $options: 'i' } }
    ];
    if (req.query.category) filter.category = req.query.category;
    const courses = await Course.find(filter).populate('instructor', 'name').sort({ createdAt: -1 });
    res.json(courses);
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (e) { next(e); }
});
router.post('/', protect, instructorOnly, async (req, res, next) => {
  try {
    const course = await Course.create({ ...req.body, instructor: req.user.id });
    res.status(201).json(course);
  } catch (e) { next(e); }
});
router.put('/:id', protect, instructorOnly, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'You cannot edit this course' });
    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (e) { next(e); }
});
router.delete('/:id', protect, instructorOnly, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'You cannot delete this course' });
    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (e) { next(e); }
});
router.post('/:id/enroll', protect, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!course.students.some(id => id.toString() === req.user.id)) course.students.push(req.user.id);
    await course.save();
    res.json({ message: 'Successfully enrolled', course });
  } catch (e) { next(e); }
});
router.patch('/:id/lessons/:lessonId/complete', protect, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!course.students.some(id => id.toString() === req.user.id)) return res.status(403).json({ message: 'Enroll in this course first' });
    res.json({ message: 'Lesson completion endpoint ready', lessonId: req.params.lessonId });
  } catch (e) { next(e); }
});
export default router;
