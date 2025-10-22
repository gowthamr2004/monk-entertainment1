import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Clock, Music } from "lucide-react";
import { Song } from "@/types/song";
import { Button } from "@/components/ui/button";

const History = () => {
  const [history, setHistory] = useState<Song[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("history");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
              Recently Played
            </h1>
            <p className="text-muted-foreground">Your listening history</p>
          </div>
          {history.length > 0 && (
            <Button variant="outline" onClick={handleClearHistory}>
              Clear History
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">No history yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Songs you play will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((song, index) => (
              <Card
                key={`${song.id}-${index}`}
                className="p-4 bg-card border-border hover:bg-card/80 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={song.imageUrl}
                    alt={song.songName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{song.songName}</h3>
                    <p className="text-sm text-muted-foreground truncate">{song.artistName}</p>
                    <p className="text-xs text-muted-foreground truncate">{song.movieName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{song.type}</span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{song.language}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
