import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Music } from "lucide-react";
import { Playlist as PlaylistType } from "@/types/song";
import { toast } from "sonner";

const Playlist = () => {
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("playlists");
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
  }, []);

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }

    const newPlaylist: PlaylistType = {
      id: Date.now().toString(),
      name: newPlaylistName,
      songs: [],
      createdAt: new Date(),
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    setNewPlaylistName("");
    toast.success("Playlist created!");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
            Your Playlists
          </h1>
          <p className="text-muted-foreground">Create and manage your music collections</p>
        </div>

        {/* Create Playlist */}
        <Card className="p-6 mb-8 bg-card border-border animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Create New Playlist</h2>
          <div className="flex gap-3">
            <Input
              placeholder="Enter playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreatePlaylist()}
              className="bg-secondary"
            />
            <Button onClick={handleCreatePlaylist} className="whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </Card>

        {/* Playlists Grid */}
        {playlists.length === 0 ? (
          <div className="text-center py-20">
            <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">No playlists yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first playlist to organize your favorite songs
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist, index) => (
              <Card
                key={playlist.id}
                className="p-6 bg-card border-border hover:bg-card/80 transition-all cursor-pointer hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                  <Music className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{playlist.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;
