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

  return (
    <div className="flex min-h-screen pt-20">
      <ExhibitionTabs onUpdatePreview={handleUpdatePreview} />
      <ExhibitionPreview previewData={previewData} />
    </div>
  );
}

export default CreateExhibitionPage;
