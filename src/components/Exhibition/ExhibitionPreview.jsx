import React from "react";

function ExhibitionPreview({ previewData }) {
  const { background, fontStyle, artworks, location, date, description } =
    previewData;

  return (
    <div
      className="w-1/2 p-4 border-l"
      style={{
        backgroundImage: `url(${background})`,
        fontFamily: fontStyle || "inherit",
      }}
    >
      <div className="p-4 bg-white bg-opacity-70 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Exhibition Preview</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {artworks?.map((art, index) => (
            <div key={index} className="border p-2">
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-32 object-cover mb-2"
              />
              <p>{art.title}</p>
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
