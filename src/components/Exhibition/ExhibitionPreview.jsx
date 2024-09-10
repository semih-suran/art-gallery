import React from "react";
import { IoRemoveCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaRegSave } from "react-icons/fa";

function ExhibitionPreview({ previewData, onRemoveArtwork }) {
  const { background, fontStyle, artworks, location, date, description } =
    previewData;

  const navigate = useNavigate();

  const handleArtworkClick = (art) => {
    const imageUrl = art.image
      ? art.image
      : "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";

    const prefix = imageUrl.startsWith("https://www.artic.edu") ? "c" : "h";
    navigate(`/artwork/${prefix}${art.id}`, {
      state: { art: { ...art, image: imageUrl }, source: prefix },
    });
  };

  const handleSaveExhibition = async () => {
    alert("This logic will be added soon...");
  };

  return (
    <div
      className="p-4 border mx-auto"
      style={{
        backgroundImage: `url(${background})`,
        fontFamily: fontStyle || "inherit",
        width: "375px",
        backgroundSize: "cover",
      }}
    >
      <div className="p-4 bg-white bg-opacity-70 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Exhibition Preview</h2>
        <p>
          <strong>Location:</strong> {location}
        </p>
        <p>
          <strong>Date:</strong> {date}
        </p>
        <p>
          <strong>Description:</strong> {description}
        </p>
        <div className="space-y-4 mb-4">
          {artworks?.map((art, index) => (
            <div
              key={index}
              className={`flex items-center space-x-4 cursor-pointer ${
                index % 2 === 0 ? "" : "flex-row-reverse"
              }`}
              onClick={() => handleArtworkClick(art)}
            >
              <div className="relative">
                <IoRemoveCircle
                  className="absolute top-0 right-0 bg-white text-red-500 rounded-full text-lg hover:bg-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveArtwork(index);
                  }}
                />
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-40 h-40 object-cover mb-2"
                />
              </div>
              <div>
                <p className="text-lg font-semibold">{art.title}</p>
                <p className="text-sm italic">
                  This section will be updated for {art.title}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSaveExhibition}
            className="flex items-center gap-2 px-4 py-2 border border-black rounded-md bg-white hover:bg-gray-100"
          >
            <FaRegSave />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExhibitionPreview;
