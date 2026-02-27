-- Run this SQL in your Render Database to create the tables

CREATE TABLE IF NOT EXISTS classes (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  has_solutions BOOLEAN DEFAULT FALSE,
  has_sample_papers BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS subjects (
  id VARCHAR(50) PRIMARY KEY,
  class_id VARCHAR(10) REFERENCES classes(id),
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS chapters (
  id VARCHAR(50) PRIMARY KEY,
  subject_id VARCHAR(50) REFERENCES subjects(id),
  title VARCHAR(200) NOT NULL,
  order_index INTEGER
);

CREATE TABLE IF NOT EXISTS content (
  id VARCHAR(50) PRIMARY KEY,
  chapter_id VARCHAR(50) REFERENCES chapters(id),
  title VARCHAR(200) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('book', 'solution', 'paper')),
  url TEXT NOT NULL
);

-- Initial Seed Data (Optional - Example)
-- INSERT INTO classes (id, name, has_solutions, has_sample_papers) VALUES ('10', 'Class 10', true, true);
