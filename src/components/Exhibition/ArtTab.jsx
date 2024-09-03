import React, { useState, useEffect } from "react";
import { fetchHarvardArt, fetchArtInstitute } from "../../services/api";

function ArtTab({ onUpdatePreview }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworks, setSelectedArtworks] = useState([]);

  const handleSearch = async () => {
    const harvardArt = await fetchHarvardArt(searchTerm);
    const artInstitute = await fetchArtInstitute(searchTerm);
    setArtworks([...harvardArt, ...artInstitute]);
  };

  const handleSelectArtwork = (art) => {
    setSelectedArtworks([...selectedArtworks, art]);
    onUpdatePreview({ artworks: [...selectedArtworks, art] });
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search for artworks"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleSearch}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Search Artworks
      </button>
      <div className="grid grid-cols-2 gap-4">
        {artworks.map((art) => (
          <div
            key={art.id}
            className="border p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelectArtwork(art)}
          >
            <img src={art.image} alt={art.title} className="w-full h-32 object-cover mb-2" />
            <p>{art.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtTab;
