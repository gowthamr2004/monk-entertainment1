import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SongCard from "@/components/SongCard";
import ParticleBackground from "@/components/ParticleBackground";
import AudioPlayer from "@/components/AudioPlayer";
import { Song } from "@/types/song";
import { toast } from "sonner";

interface HomeProps {
  songs: Song[];
  onDeleteSong?: (id: string) => void;
  isAdmin: boolean;
}

const Home = ({ songs, onDeleteSong, isAdmin }: HomeProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [history, setHistory] = useState<Song[]>([]);

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.songName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.movieName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || song.type === selectedType;
    const matchesLanguage = selectedLanguage === "all" || song.language === selectedLanguage;
    return matchesSearch && matchesType && matchesLanguage;
  });

  const handlePlay = (song: Song) => {
    setCurrentSong(song);
    // Add to history
    const updatedHistory = [song, ...history.filter((s) => s.id !== song.id)].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    toast.success(`Now playing: ${song.songName}`);
  };

  const handleDownload = (song: Song) => {
    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = song.audioUrl;
    link.download = `${song.songName} - ${song.artistName}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started!");
  };

  const handleNext = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setCurrentSong(nextSong);
      setQueue(queue.slice(1));
    }
  };

  const handlePrevious = () => {
    if (history.length > 1) {
      const previousSong = history[1];
      setCurrentSong(previousSong);
    }
  };

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      <main className="container mx-auto px-4 py-8 pb-32">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
            Discover Music
          </h1>
          <p className="text-muted-foreground">
            {filteredSongs.length} {filteredSongs.length === 1 ? "song" : "songs"} available
          </p>
        </div>

        {filteredSongs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No songs found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredSongs.map((song, index) => (
              <div
                key={song.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <SongCard
                  song={song}
                  onPlay={handlePlay}
                  onDownload={handleDownload}
                  onDelete={onDeleteSong}
                  isAdmin={isAdmin}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <AudioPlayer
        currentSong={currentSong}
        queue={queue}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
};

export default Home;
