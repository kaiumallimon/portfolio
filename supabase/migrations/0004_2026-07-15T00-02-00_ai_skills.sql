-- ============================================================================
-- 0004_2026-07-15T00-02-00_ai_skills.sql
-- Add an "AI & Intelligent Systems" toolkit category (idempotent)
-- ============================================================================

INSERT INTO skills (category, icon, skills, "order")
SELECT * FROM (VALUES
  ('AI & Intelligent Systems', 'Brain', '[{"name":"LLM Integration","highlight":true},{"name":"Prompt Engineering","highlight":true},{"name":"RAG Pipelines","highlight":false},{"name":"Machine Learning","highlight":false},{"name":"Computer Vision","highlight":false},{"name":"NLP","highlight":false},{"name":"TensorFlow","highlight":false},{"name":"PyTorch","highlight":false},{"name":"OpenAI / Gemini","highlight":false}]'::jsonb, 5)
) AS v(category, icon, skills, "order")
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'AI & Intelligent Systems');
