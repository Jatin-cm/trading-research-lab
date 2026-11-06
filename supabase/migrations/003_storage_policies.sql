-- ==============================================================================
-- TRADING RESEARCH LAB (TRL) — STORAGE BUCKET & ACCESS POLICIES
-- Migration: 003_storage_policies.sql
-- Description: Creates the 'trade-screenshots' bucket (private) and restricts
--              uploads, reads, and deletes to the file owner's user ID folder.
-- ==============================================================================

-- 1. Create the storage bucket (private by default)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'trade-screenshots',
  'trade-screenshots',
  false,
  10485760, -- 10MB max per screenshot
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp'];

-- 2. Storage RLS Policies for storage.objects
-- Folder organization convention: trade-screenshots/<user_id>/<trade_id>/<filename>

-- Allow users to upload only into their own user_id directory
create policy "Authenticated users can upload screenshots to their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'trade-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to view/download only their own screenshots
create policy "Authenticated users can read their own screenshots"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'trade-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own screenshots
create policy "Authenticated users can delete their own screenshots"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'trade-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own screenshots
create policy "Authenticated users can update their own screenshots"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'trade-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'trade-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

