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

interface AddToPlaylistDialogProps {
  songId: string;
  songName: string;
}

export const AddToPlaylistDialog = ({ songId, songName }: AddToPlaylistDialogProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const savedPlaylists = localStorage.getItem("playlists");
      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists));
      }
    }
  }, [open]);

  const handleAddToPlaylist = (playlistId: string) => {
    const savedPlaylists = localStorage.getItem("playlists");
    if (!savedPlaylists) return;

    const parsedPlaylists: Playlist[] = JSON.parse(savedPlaylists);
    const playlistIndex = parsedPlaylists.findIndex((p) => p.id === playlistId);
    
    if (playlistIndex === -1) return;

    const playlist = parsedPlaylists[playlistIndex];
    
    if (playlist.songs.includes(songId)) {
      toast.error("Song already in this playlist");
      return;
    }

    playlist.songs.push(songId);
    localStorage.setItem("playlists", JSON.stringify(parsedPlaylists));
    
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
