import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShareAlt } from "react-icons/fa";
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
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const PLACEHOLDER_IMAGE = "https://placehold.co/384x384?text=Copyrighted";

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

  const handleImageClick = (artworkId, originalId) => {
    const prefix = originalId.startsWith("h") ? "h" : "c";
    navigate(`/artwork/${prefix}${artworkId}`);
  };

  const handleShare = async () => {
    const shareData = {
      title: exhibition.title,
      text: `Check out this exhibition: ${exhibition.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(shareData.url).then(() => {
        setIsLinkCopied(true);
        setTimeout(() => setIsLinkCopied(false), 2000);
      });
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = PLACEHOLDER_IMAGE;
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
        <div className="flex items-center justify-center space-x-4">
          <h1
            className={`text-3xl font-bold cursor-pointer text-white ${
              textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
            }`}
            onClick={handleTextClick}
          >
            {title}
          </h1>
          <button
            className="text-white py-2 px-4 rounded"
            onClick={handleShare}
          >
            <FaShareAlt className="w-6 h-6 text-white" />
          </button>
        </div>
        {isLinkCopied && (
          <p className="ml-2 text-sm text-green-500">Link copied!</p>
        )}

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
          This exhibition is going take place at:
        </p>
        <p
          className={`cursor-pointer text-white ${
            textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
          }`}
          onClick={handleTextClick}
        >
          {location} on {formattedDate}
        </p>
        <p
          className={`cursor-pointer text-white ${
            textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
          }`}
          onClick={handleTextClick}
        >
          About this exhibition:
        </p>
        <p
          className={`cursor-pointer text-white ${
            textHighlighted ? "bg-gray-900 bg-opacity-50 rounded" : ""
          }`}
          onClick={handleTextClick}
        >
          {description}
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
                src={artwork.image || PLACEHOLDER_IMAGE}
                alt={artwork.title}
                onError={handleImageError}
                className="h-3/4 object-contain shadow-lg"
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
