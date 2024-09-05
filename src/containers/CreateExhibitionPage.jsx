import React, { useState } from "react";
import ExhibitionTabs from "../components/Exhibition/ExhibitionTabs";
import ExhibitionPreview from "../components/Exhibition/ExhibitionPreview";

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
    setPreviewData((prev) => ({ ...prev, ...newData }));
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

  return (
    <div className="flex flex-col min-h-screen pt-20 px-4">
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
  );
}

export default CreateExhibitionPage;
