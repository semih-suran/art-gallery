import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchHarvardArtworkById,
  fetchArtInstituteArtworkById,
} from "../services/api";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

const ArtItem = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [isChicago, setIsChicago] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const prefix = id.charAt(0);
    const artId = id.slice(1);

    const fetchArtwork = async () => {
      try {
        let artData;
        if (prefix === "c") {
          artData = await fetchArtInstituteArtworkById(artId);
          setIsChicago(true);
        } else if (prefix === "h") {
          artData = await fetchHarvardArtworkById(artId);
          setIsChicago(false);
        }
        setArtwork(artData);
      } catch (err) {
        console.error("Error fetching artwork data:", err);
        setError("Failed to load artwork.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!artwork) {
    return <div>No artwork found.</div>;
  }

  const title = artwork.title || "Untitled";
  const artist = artwork.artist || "Unknown Artist";
  const date = artwork.date || "Unknown Date";
  const description = artwork.description || "No description available";
  const imageUrl = artwork.image
    ? artwork.image
    : "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";

  const openFullScreen = () => setIsFullScreen(true);

  const closeFullScreen = () => setIsFullScreen(false);

  return (
    <div className="art-item pt-40 text-center mx-auto max-w-full sm:max-w-md">
      <h2 className="text-2xl font-serif text-[#4a3f35]">{title}</h2>
      <div
        className="relative inline-block w-full h-auto p-4 sm:p-8 lg:p-10 bg-white border border-gray-300 shadow-2xl bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://dictionary.cambridge.org/images/full/brown_noun_001_01948.jpg?version=6.0.31')",
        }}
      >
        <button
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg"
          onClick={openFullScreen}
        >
          <AiOutlineSearch className="text-2xl text-gray-700" />
        </button>
        <img src={imageUrl} alt={title} className="w-full h-auto shadow-xl" />
      </div>
      <p className="mt-4 font-serif text-lg text-gray-700">
        <strong>Artist:</strong> {artist}
      </p>
      <p className="font-serif text-lg text-gray-700">
        <strong>Date:</strong> {date}
      </p>
      <p className="font-serif text-lg text-gray-700">
        <strong>Description:</strong> {description}
      </p>
      {isFullScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <img src={imageUrl} alt={title} className="max-w-full max-h-full" />
          <button
            className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg"
            onClick={closeFullScreen}
          >
            <AiOutlineClose className="text-2xl text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtItem;
