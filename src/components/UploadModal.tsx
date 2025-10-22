import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Song } from "@/types/song";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (song: Song) => void;
}

const UploadModal = ({ isOpen, onClose, onUpload }: UploadModalProps) => {
  const [formData, setFormData] = useState({
    songName: "",
    artistName: "",
    movieName: "",
    type: "Song" as "Song" | "BGM",
    language: "Tamil",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!formData.songName || !formData.artistName || !formData.movieName || !imageFile || !audioFile) {
      toast.error("Please fill all fields and upload files");
      return;
    }

    // Create URLs for preview (in production, upload to Firebase Storage)
    const imageUrl = URL.createObjectURL(imageFile);
    const audioUrl = URL.createObjectURL(audioFile);

    const newSong: Song = {
      id: Date.now().toString(),
      songName: formData.songName,
      artistName: formData.artistName,
      movieName: formData.movieName,
      type: formData.type,
      language: formData.language,
      imageUrl,
      audioUrl,
      uploadedAt: new Date(),
    };

    onUpload(newSong);
    toast.success("Song uploaded successfully!");
    onClose();
    
    // Reset form
    setFormData({
      songName: "",
      artistName: "",
      movieName: "",
      type: "Song",
      language: "Tamil",
    });
    setImageFile(null);
    setAudioFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Song</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="songName">Song Name</Label>
              <Input
                id="songName"
                placeholder="Enter song name"
                value={formData.songName}
                onChange={(e) => setFormData({ ...formData, songName: e.target.value })}
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artistName">Artist Name</Label>
              <Input
                id="artistName"
                placeholder="Enter artist name"
                value={formData.artistName}
                onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                className="bg-secondary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="movieName">Movie Name</Label>
            <Input
              id="movieName"
              placeholder="Enter movie name"
              value={formData.movieName}
              onChange={(e) => setFormData({ ...formData, movieName: e.target.value })}
              className="bg-secondary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "Song" | "BGM") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Song">Song</SelectItem>
                  <SelectItem value="BGM">BGM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Malayalam">Malayalam</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Thumbnail Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="bg-secondary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audio">Audio File (MP3)</Label>
            <Input
              id="audio"
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              className="bg-secondary"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Upload Song
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
