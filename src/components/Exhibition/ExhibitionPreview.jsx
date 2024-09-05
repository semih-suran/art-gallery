import React from "react";
import { IoRemoveCircle } from "react-icons/io5";

function ExhibitionPreview({ previewData, onRemoveArtwork }) {
  const { background, fontStyle, artworks, location, date, description } =
    previewData;

  return (
    <div
      className="p-4 border mx-auto"
      style={{
        backgroundImage: `url(${background})`,
        fontFamily: fontStyle || "inherit",
        width: "350px",
        backgroundSize: "cover",
      }}
    >
      <div className="p-4 bg-white bg-opacity-70 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Exhibition Preview</h2>
        <div className="space-y-4 mb-4">
          {artworks?.map((art, index) => (
            <div
              key={index}
              className={`flex items-center space-x-4 ${
                index % 2 === 0 ? "" : "flex-row-reverse"
              }`}
            >
              <div className="relative">
                <IoRemoveCircle
                  className="absolute top-0 right-0 bg-white text-red-500 rounded-full text-lg hover:bg-black"
                  onClick={() => onRemoveArtwork(index)}
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
        <p>
          <strong>Location:</strong> {location}
        </p>
        <p>
          <strong>Date:</strong> {date}
        </p>
        <p>
          <strong>Description:</strong> {description}
        </p>
      </div>
    </div>
  );
}

export default ExhibitionPreview;
