import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "@/components/LoginModal";
import UploadModal from "@/components/UploadModal";
import { Song } from "@/types/song";

interface UploadProps {
  onUpload: (song: Song) => void;
}

const Upload = ({ onUpload }: UploadProps) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
    
    if (!adminStatus) {
      setShowLoginModal(true);
    } else {
      setShowUploadModal(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowUploadModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
    navigate("/");
  };

  const handleCloseUpload = () => {
    setShowUploadModal(false);
    navigate("/");
  };

  const handleUpload = (song: Song) => {
    onUpload(song);
    handleCloseUpload();
  };

  return (
    <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLogin}
        onLoginSuccess={handleLoginSuccess}
      />
      <UploadModal
        isOpen={showUploadModal}
        onClose={handleCloseUpload}
        onUpload={handleUpload}
      />
    </>
  );
};

export default Upload;
