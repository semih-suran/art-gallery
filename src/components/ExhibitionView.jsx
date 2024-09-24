import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchExhibitionById,
  fetchCuratorusersById,
  fetchHarvardArtworkById,
  fetchArtInstituteArtworkById,
} from "../services/api";

const ExhibitionView = () => {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);
  const [user, setUser] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [textHighlighted, setTextHighlighted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedExhibition = await fetchExhibitionById(id);
        setExhibition(fetchedExhibition);

        const artworkPromises = fetchedExhibition.exhibitions.map(
          async (artId) => {
            if (artId.startsWith("h")) {
              return await fetchHarvardArtworkById(artId.slice(1));
            } else {
              return await fetchArtInstituteArtworkById(artId.slice(1));
            }
          }
        );

        const currentUser = await fetchCuratorusersById(
          fetchedExhibition.user_id
        );
        setUser(currentUser);

        const fetchedArtworks = await Promise.all(artworkPromises);
        setArtworks(fetchedArtworks);
      } catch (error) {
        console.error("Error fetching exhibition data:", error);
      }
    };
    fetchData();
  }, [id]);

  if (!exhibition || artworks.length === 0) return <div>Loading...</div>;

  const { title, date, location, font, background, description } = exhibition;
  const formattedDate = exhibition.date
    ? new Date(exhibition.date).toISOString().split("T")[0]
    : "";

  const handleTextClick = () => {
    setTextHighlighted((prevState) => !prevState);
  };

  const handleBetaClick = () => {
    navigate(`/exhibition-viewV2/${id}`);
  };

  const handleImageClick = (artworkId, originalId) => {
    const prefix = originalId.startsWith("h") ? "h" : "c";
    navigate(`/artwork/${prefix}${artworkId}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-32"
      style={{
        fontFamily: font,
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <header className="text-center p-4">
        <h1
          className={`text-3xl font-bold cursor-pointer text-white ${
            textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
          }`}
          onClick={handleTextClick}
        >
          {title}
        </h1>
        <p
          className={`cursor-pointer text-white ${
            textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
          }`}
          onClick={handleTextClick}
        >
          Curated by: {user?.nickname}
        </p>
        <p
          className={`cursor-pointer text-white ${
            textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
          }`}
          onClick={handleTextClick}
        >
          at {location}
        </p>
        <p
          className={`cursor-pointer text-white ${
            textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
          }`}
          onClick={handleTextClick}
        >
          on {formattedDate}
        </p>
        <p
          className={`cursor-pointer text-white ${
            textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
          }`}
          onClick={handleTextClick}
        >
          Description: {description}
        </p>
        <p
          className={`cursor-pointer text-white bg-black rounded mt-2 ${
            textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
          }`}
          onClick={handleBetaClick}
        >
          3D View (( BETA ))
        </p>
      </header>
      <div className="w-full">
        {artworks.map((artwork, index) => (
          <div
            key={artwork.id}
            className={`flex w-full items-center justify-center my-8 ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div
              className="w-1/2 h-full flex items-center justify-center cursor-pointer"
              onClick={() =>
                handleImageClick(artwork.id, exhibition.exhibitions[index])
              }
            >
              <img
                src={artwork.image}
                alt={artwork.title}
                className="h-3/4 object-contain"
              />
            </div>
            <div className="w-1/2 p-6">
              <h2
                className={`text-2xl font-bold cursor-pointer text-white ${
                  textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
                }`}
                onClick={handleTextClick}
              >
                {artwork.title}
              </h2>
              <p
                className={`text-sm italic cursor-pointer text-white ${
                  textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
                }`}
                onClick={handleTextClick}
              >
                by {artwork.artist}
              </p>
              <p
                className={`text-sm italic cursor-pointer text-white ${
                  textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
                }`}
                onClick={handleTextClick}
              >
                created in {artwork.date}
              </p>
              <p
                className={`mt-4 text-lg cursor-pointer text-white ${
                  textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
                }`}
                onClick={handleTextClick}
              >
                {artwork.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExhibitionView;
