import React, { useState } from "react";
import ThemeTab from "./ThemeTab";
import ArtTab from "./ArtTab";
import InfoTab from "./InfoTab";

const tabs = ["Art", "Info", "Theme"];

function ExhibitionTabs({ onUpdatePreview, onAddArtwork }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Art":
        return <ArtTab onAddArtwork={onAddArtwork} />;
      case "Info":
        return <InfoTab onUpdatePreview={onUpdatePreview} />;
      case "Theme":
        return <ThemeTab onUpdatePreview={onUpdatePreview} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold rounded ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
}

export default ExhibitionTabs;
