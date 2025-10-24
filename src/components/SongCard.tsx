import { Download, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Song } from "@/types/song";
import { Badge } from "@/components/ui/badge";
import { AddToPlaylistDialog } from "./AddToPlaylistDialog";

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onDownload: (song: Song) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

const SongCard = ({ song, onPlay, onDownload, onDelete, isAdmin }: SongCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:bg-card/80 transition-all duration-300 hover-scale">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={song.imageUrl}
          alt={song.songName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            size="icon"
            variant="default"
            className="w-14 h-14 rounded-full hover-glow"
            onClick={() => onPlay(song)}
          >
            <Play className="w-6 h-6 fill-current" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground truncate">{song.songName}</h3>
          <p className="text-sm text-muted-foreground truncate">{song.artistName}</p>
          <p className="text-xs text-muted-foreground truncate">{song.movieName}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {song.type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {song.language}
          </Badge>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onDownload(song)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            {isAdmin && onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(song.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <AddToPlaylistDialog songId={song.id} songName={song.songName} />
        </div>
      </div>
    </Card>
  );
};

export default SongCard;
