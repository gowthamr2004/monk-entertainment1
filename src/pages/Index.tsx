import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Home from "./Home";
import Playlist from "./Playlist";
import Upload from "./Upload";
import History from "./History";
import About from "./About";
import { Song } from "@/types/song";

// Sample songs data
const sampleSongs: Song[] = [
  {
    id: "1",
    songName: "Vaseegara",
    artistName: "Bombay Jayashri",
    movieName: "Minnale",
    type: "Song",
    language: "Tamil",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    uploadedAt: new Date(),
  },
  {
    id: "2",
    songName: "Hosanna",
    artistName: "Vijay Prakash, Suzanne",
    movieName: "Vinnaithaandi Varuvaayaa",
    type: "Song",
    language: "Tamil",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    uploadedAt: new Date(),
  },
  {
    id: "3",
    songName: "Nee Partha Vizhigal",
    artistName: "A.R. Rahman",
    movieName: "3",
    type: "BGM",
    language: "Tamil",
    imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    uploadedAt: new Date(),
  },
];

const Index = () => {
  const [songs, setSongs] = useState<Song[]>(sampleSongs);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, [location]);

  const handleUploadSong = (newSong: Song) => {
    setSongs([newSong, ...songs]);
  };

  const handleDeleteSong = (id: string) => {
    setSongs(songs.filter((song) => song.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                songs={songs}
                onDeleteSong={handleDeleteSong}
                isAdmin={isAdmin}
              />
            }
          />
          <Route path="/playlist" element={<Playlist />} />
          <Route
            path="/upload"
            element={<Upload onUpload={handleUploadSong} />}
          />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
};

export default Index;
