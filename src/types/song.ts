export interface Song {
  id: string;
  songName: string;
  artistName: string;
  movieName: string;
  type: 'Song' | 'BGM';
  language: string;
  imageUrl: string;
  audioUrl: string;
  uploadedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  songs: string[]; // song IDs
  createdAt: Date;
}
