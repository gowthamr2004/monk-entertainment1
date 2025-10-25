import { useState, useEffect } from "react";
import { ListPlus, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Playlist } from "@/types/song";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AddToPlaylistDialogProps {
  songId: string;
  songName: string;
}

export const AddToPlaylistDialog = ({ songId, songName }: AddToPlaylistDialogProps) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchPlaylists();
    }
  }, [open, user]);

  const fetchPlaylists = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch playlists");
      return;
    }

    const userPlaylists: Playlist[] = data.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      songs: playlist.song_ids,
      createdAt: new Date(playlist.created_at),
    }));

    setPlaylists(userPlaylists);
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    
    if (!playlist) return;

    if (playlist.songs.includes(songId)) {
      toast.error("Song already in this playlist");
      return;
    }

    const updatedSongs = [...playlist.songs, songId];

    const { error } = await supabase
      .from("playlists")
      .update({ song_ids: updatedSongs })
      .eq("id", playlistId);

    if (error) {
      toast.error("Failed to add song to playlist");
      return;
    }
    
    toast.success(`Added "${songName}" to "${playlist.name}"`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="flex-1">
          <ListPlus className="w-4 h-4 mr-2" />
          Add to Playlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>
            Choose a playlist to add "{songName}"
          </DialogDescription>
        </DialogHeader>
        
        {playlists.length === 0 ? (
          <div className="text-center py-8">
            <Music className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No playlists yet. Create one first!
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleAddToPlaylist(playlist.id)}
                >
                  <Music className="w-4 h-4 mr-2" />
                  <div className="flex flex-col items-start flex-1">
                    <span className="font-medium">{playlist.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
