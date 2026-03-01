import express from 'express';
import cors from 'cors';
import { query, isDbConfigured } from '../db';

const router = express.Router();

router.use(cors());

// Get all classes
router.get('/classes', async (req, res) => {
  if (!isDbConfigured()) {
    return res.status(503).json({ error: 'Database not configured' });
  }
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
  if (!isDbConfigured()) {
    return res.status(503).json({ error: 'Database not configured' });
  }
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
  if (!isDbConfigured()) {
    return res.status(503).json({ error: 'Database not configured' });
  }
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
  if (!isDbConfigured()) {
    return res.status(503).json({ error: 'Database not configured' });
  }
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

// ... (previous imports)

// Create new content
router.post('/content', async (req, res) => {
  try {
    const { chapter_id, title, type, url } = req.body;
    const id = `cont-${Date.now()}`; // Simple ID generation
    await query(
      'INSERT INTO content (id, chapter_id, title, type, url) VALUES ($1, $2, $3, $4, $5)',
      [id, chapter_id, title, type, url]
    );
    res.json({ id, chapter_id, title, type, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete content
router.delete('/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM content WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new chapter
router.post('/chapters', async (req, res) => {
  try {
    const { subject_id, title, order_index } = req.body;
    const id = `ch-${Date.now()}`;
    await query(
      'INSERT INTO chapters (id, subject_id, title, order_index) VALUES ($1, $2, $3, $4)',
      [id, subject_id, title, order_index || 0]
    );
    res.json({ id, subject_id, title, order_index });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new subject
router.post('/subjects', async (req, res) => {
  try {
    const { class_id, name } = req.body;
    const id = name.toLowerCase().replace(/\s+/g, '-');
    await query(
      'INSERT INTO subjects (id, class_id, name) VALUES ($1, $2, $3)',
      [id, class_id, name]
    );
    res.json({ id, class_id, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
