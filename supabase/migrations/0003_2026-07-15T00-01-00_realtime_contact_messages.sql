-- Add contact_messages to the realtime publication so clients receive
-- INSERT/UPDATE/DELETE events. Idempotent: only adds if not present.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'contact_messages'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;';
  END IF;
END $$;
