-- Create storage buckets for songs
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('song-images', 'song-images', true),
  ('song-audio', 'song-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for song-images
CREATE POLICY "Anyone can view song images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'song-images');

CREATE POLICY "Admins can upload song images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'song-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update song images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'song-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete song images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'song-images' AND
    public.has_role(auth.uid(), 'admin')
  );

-- Storage policies for song-audio
CREATE POLICY "Anyone can view song audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'song-audio');

CREATE POLICY "Admins can upload song audio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'song-audio' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update song audio"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'song-audio' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete song audio"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'song-audio' AND
    public.has_role(auth.uid(), 'admin')
  );
