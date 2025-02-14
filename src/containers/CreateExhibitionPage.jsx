import React, { useState, useEffect, useRef } from "react";
import ExhibitionTabs from "../components/Exhibition/ExhibitionTabs";
import ExhibitionPreview from "../components/Exhibition/ExhibitionPreview";
import Footer from "../components/Footer";

function CreateExhibitionPage() {
  const [previewData, setPreviewData] = useState({
    background: "",
    fontStyle: "",
    artworks: [],
    location: "",
    date: "",
    description: "",
  });

  const handleUpdatePreview = (newData) => {
    setPreviewData((prev) => {
      const isDifferent = Object.keys(newData).some(
        (key) => prev[key] !== newData[key]
      );
      return isDifferent ? { ...prev, ...newData } : prev;
    });
  };
  

  const handleAddArtwork = (art) => {
    const updatedArtworks = [...previewData.artworks, art];
    setPreviewData((prev) => ({ ...prev, artworks: updatedArtworks }));
  };

  const handleRemoveArtwork = (index) => {
    const updatedArtworks = [...previewData.artworks];
    updatedArtworks.splice(index, 1);
    setPreviewData((prev) => ({ ...prev, artworks: updatedArtworks }));
  };

  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const speed = 0.5;
      if (videoRef.current) {
        videoRef.current.style.transform = `translateY(${
          scrollPosition * speed
        }px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
          {" "}
          <div className="relative w-full h-[80%] max-w-[800px] max-h-[450px] overflow-hidden">
            <video
              ref={videoRef}
              className="absolute top-4 left-0 w-full h-full object-cover"
              src="/media/Art_Background_Video_2_low.mp4"
              autoPlay
              loop
              muted
              playsInline
              aria-label="Art Background Video"
            />
          </div>
          <div className="absolute z-10 flex items-center justify-center h-full">
            <h1 className="text-4xl font-bold text-white text-center">
              {/* << Text on the video HERE >> */}
            </h1>
          </div>
        </div>
          <p>Create your exhibition in 3 simple steps...</p>
          <p>Then "Save" it from your preview</p>
        <div className="w-full mb-8">
          <ExhibitionTabs
            onUpdatePreview={handleUpdatePreview}
            onAddArtwork={handleAddArtwork}
          />
        </div>
        <div className="w-full flex-grow">
          <ExhibitionPreview
            previewData={previewData}
            onRemoveArtwork={handleRemoveArtwork}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CreateExhibitionPage;
