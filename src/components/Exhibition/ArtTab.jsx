import React, { useState } from "react";
import { fetchHarvardArt, fetchArtInstitute } from "../../services/api";

function ArtTab({ onAddArtwork }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [sortBy, setSortBy] = useState("title");
  const [filterByMuseum, setFilterByMuseum] = useState("all");
  const [hoveredArt, setHoveredArt] = useState(null);
  const [selectedArt, setSelectedArt] = useState(null);

  const handleSearch = async () => {
    const harvardArt = await fetchHarvardArt(searchTerm);
    const artInstitute = await fetchArtInstitute(searchTerm);
    const allArtworks = [...harvardArt, ...artInstitute];
    const filteredArtworks = allArtworks.filter((art) => art.image);
    setArtworks(filteredArtworks);
  };

  const handleSelectArtwork = (art) => {
    onAddArtwork(art);
    alert(`${art.title} successfully added!`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleViewArtwork = (art) => {
    setSelectedArt(art);
  };

  const closeModal = () => {
    setSelectedArt(null);
  };

  const sortArtworks = (artworks, sortBy) => {
    return artworks.sort((a, b) => {
      if (sortBy === "artist") {
        return a.artist.localeCompare(b.artist);
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const filterArtworks = (artworks, filterByMuseum) => {
    if (filterByMuseum === "harvard") {
      return artworks.filter((art) => art.source === "h");
    } else if (filterByMuseum === "chicago") {
      return artworks.filter((art) => art.source === "c");
    }
    return artworks;
  };

  const sortedAndFilteredArtworks = sortArtworks(
    filterArtworks(artworks, filterByMuseum),
    sortBy
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search for artworks"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleSearch}
        className="w-full px-4 py-2 bg-gray-700 text-white shadow-[0_0_15px_5px_gray] rounded-lg"
      >
        Search Artworks
      </button>
      <div className="flex space-x-4">
        <div>
          <label htmlFor="sort">Sort By:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="title">Title</option>
            <option value="artist">Artist</option>
          </select>
        </div>
        <div>
          <label htmlFor="filter">Filter By Museum:</label>
          <select
            id="filter"
            value={filterByMuseum}
            onChange={(e) => setFilterByMuseum(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All</option>
            <option value="harvard">Harvard Art Museum</option>
            <option value="chicago">Art Institute of Chicago</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {sortedAndFilteredArtworks.map((art) => (
          <div
            key={art.id}
            className={`relative border p-2 cursor-pointer ${
              hoveredArt === art.id ? "bg-gray-300" : "hover:bg-gray-100"
            }`}
            onMouseEnter={() => setHoveredArt(art.id)}
            onMouseLeave={() => setHoveredArt(null)}
          >
            <img
              src={art.image}
              alt={art.title}
              className={`w-full h-32 object-cover mb-2 ${
                hoveredArt === art.id ? "opacity-50" : ""
              }`}
            />
            {hoveredArt === art.id && (
              <div className="absolute inset-0 flex justify-center items-center space-x-2">
                <button
                  className="px-4 py-2 bg-gray-800 text-white p-2 rounded-full hover:bg-green-500"
                  onClick={() => handleSelectArtwork(art)}
                >
                  Add
                </button>
                <button
                  className="px-4 py-2 bg-gray-800 text-white p-2 rounded-full hover:bg-green-500"
                  onClick={() => handleViewArtwork(art)}
                >
                  View
                </button>
              </div>
            )}
            <p>{art.title}</p>
            <p>{art.artist}</p>
            <p>{art.date}</p>
          </div>
        ))}
      </div>
      {selectedArt && (
        <div className="fixed inset-0 flex justify-center items-center pt-24 bg-black bg-opacity-75">
          <div className="relative p-4 bg-white rounded-lg max-w-[80vw] max-h-[80vh]">
            <img
              src={selectedArt.image}
              alt={selectedArt.title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-red-500"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtTab;
