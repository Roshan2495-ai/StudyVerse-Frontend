import express from 'express';
import cors from 'cors';
import { query } from '../db';

const router = express.Router();

router.use(cors());

// Get all classes
router.get('/classes', async (req, res) => {
  try {
    const result = await query('SELECT * FROM classes ORDER BY CAST(id AS INTEGER)');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subjects for a class
router.get('/classes/:classId/subjects', async (req, res) => {
  try {
    const { classId } = req.params;
    const result = await query('SELECT * FROM subjects WHERE class_id = $1', [classId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chapters for a subject
router.get('/subjects/:subjectId/chapters', async (req, res) => {
  try {
    const { subjectId } = req.params;
    const result = await query('SELECT * FROM chapters WHERE subject_id = $1 ORDER BY order_index', [subjectId]);
    
    // For each chapter, fetch content (books/solutions)
    // Note: In a real app, you might want to do a JOIN or separate calls
    const chapters = await Promise.all(result.rows.map(async (chapter) => {
      const contentResult = await query('SELECT * FROM content WHERE chapter_id = $1', [chapter.id]);
      return { ...chapter, content: contentResult.rows };
    }));

    res.json(chapters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific content (book/solution)
router.get('/content/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;
    const result = await query('SELECT * FROM content WHERE id = $1', [contentId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
