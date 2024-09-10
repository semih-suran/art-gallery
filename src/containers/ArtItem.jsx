import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchHarvardArtworkById, fetchArtInstituteArtworkById } from "../services/api";

const ArtItem = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [isChicago, setIsChicago] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="art-item pt-40">
      <h2>{title}</h2>
      <img src={imageUrl} alt={title} />
      <p>
        <strong>Artist:</strong> {artist}
      </p>
      <p>
        <strong>Date:</strong> {date}
      </p>
      <p>
        <strong>Description:</strong> {description}
      </p>
    </div>
  );
};

export default ArtItem;
