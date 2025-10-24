import { useState, useEffect } from "react";
import SongCard from "@/components/SongCard";
import ParticleBackground from "@/components/ParticleBackground";
import AudioPlayer from "@/components/AudioPlayer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Song {
  id: string;
  song_name: string;
  artist_name: string;
  movie_name: string;
  type: "Song" | "BGM";
  language: string;
  image_url: string;
  audio_url: string;
}

const Home = () => {
  const { isAdmin, user } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [history, setHistory] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
    loadHistory();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Map database types to component types
      const mappedSongs = (data || []).map(song => ({
        ...song,
        type: song.type as "Song" | "BGM"
      }));
      
      setSongs(mappedSongs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = () => {
    const savedHistory = localStorage.getItem("history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  };

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.song_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.movie_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || song.type === selectedType;
    const matchesLanguage =
      selectedLanguage === "all" || song.language === selectedLanguage;
    return matchesSearch && matchesType && matchesLanguage;
  });

  const handlePlay = (song: Song) => {
    setCurrentSong(song);
    const updatedHistory = [
      song,
      ...history.filter((s) => s.id !== song.id),
    ].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    toast.success(`Now playing: ${song.song_name}`);
  };

  const handleDownload = (song: Song) => {
    const link = document.createElement("a");
    link.href = song.audio_url;
    link.download = `${song.song_name} - ${song.artist_name}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started!");
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast.error("Only admins can delete songs");
      return;
    }

    try {
      const { error } = await supabase.from("songs").delete().eq("id", id);

      if (error) throw error;

      setSongs(songs.filter((song) => song.id !== id));
      toast.success("Song deleted successfully");
    } catch (error) {
      console.error("Error deleting song:", error);
      toast.error("Failed to delete song");
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />

      <main className="px-8 py-6 pb-32">
        {/* Search and Filters Section */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-5xl font-bold mb-8 text-foreground tracking-tight">
            Discover Music
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search songs, artists, movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-11 bg-card/50 border-border/50 rounded-xl focus-visible:ring-primary/30"
              />
            </div>

            {/* Filters */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-36 h-11 bg-card/50 border-border/50 rounded-xl">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Song">Song</SelectItem>
                <SelectItem value="BGM">BGM</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-36 h-11 bg-card/50 border-border/50 rounded-xl">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
                <SelectItem value="Telugu">Telugu</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Malayalam">Malayalam</SelectItem>
                <SelectItem value="English">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-muted-foreground text-sm">
            {filteredSongs.length}{" "}
            {filteredSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>

        {/* Songs Grid */}
        {filteredSongs.length === 0 ? (
          <div className="py-32">
            <p className="text-2xl text-muted-foreground font-medium">No songs found</p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {filteredSongs.map((song, index) => (
              <div
                key={song.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <SongCard
                  song={{
                    id: song.id,
                    songName: song.song_name,
                    artistName: song.artist_name,
                    movieName: song.movie_name,
                    type: song.type,
                    language: song.language,
                    imageUrl: song.image_url,
                    audioUrl: song.audio_url,
                    uploadedAt: new Date(),
                  }}
                  onPlay={(s) =>
                    handlePlay({
                      id: s.id,
                      song_name: s.songName,
                      artist_name: s.artistName,
                      movie_name: s.movieName,
                      type: s.type,
                      language: s.language,
                      image_url: s.imageUrl,
                      audio_url: s.audioUrl,
                    })
                  }
                  onDownload={(s) =>
                    handleDownload({
                      id: s.id,
                      song_name: s.songName,
                      artist_name: s.artistName,
                      movie_name: s.movieName,
                      type: s.type,
                      language: s.language,
                      image_url: s.imageUrl,
                      audio_url: s.audioUrl,
                    })
                  }
                  onDelete={handleDelete}
                  isAdmin={isAdmin}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {currentSong && (
        <AudioPlayer
          currentSong={{
            id: currentSong.id,
            songName: currentSong.song_name,
            artistName: currentSong.artist_name,
            movieName: currentSong.movie_name,
            type: currentSong.type,
            language: currentSong.language,
            imageUrl: currentSong.image_url,
            audioUrl: currentSong.audio_url,
            uploadedAt: new Date(),
          }}
          queue={queue.map((s) => ({
            id: s.id,
            songName: s.song_name,
            artistName: s.artist_name,
            movieName: s.movie_name,
            type: s.type,
            language: s.language,
            imageUrl: s.image_url,
            audioUrl: s.audio_url,
            uploadedAt: new Date(),
          }))}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
};

export default Home;
