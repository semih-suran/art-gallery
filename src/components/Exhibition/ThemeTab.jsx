import React, { useState } from "react";

const backgroundOptions = [
  "https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg",
  "https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg",
  "https://images.pexels.com/photos/207353/pexels-photo-207353.jpeg",
  "https://images.pexels.com/photos/1227511/pexels-photo-1227511.jpeg",
  "https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg",
  "https://images.pexels.com/photos/413195/pexels-photo-413195.jpeg",
  "https://images.pexels.com/photos/220067/pexels-photo-220067.jpeg",
  "https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg",
  "https://images.pexels.com/photos/960137/pexels-photo-960137.jpeg",
  "https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg",
  "https://images.pexels.com/photos/1590549/pexels-photo-1590549.jpeg",
  "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg",
  "https://images.pexels.com/photos/459277/pexels-photo-459277.jpeg",
  "https://images.pexels.com/photos/352096/pexels-photo-352096.jpeg",
  "https://images.pexels.com/photos/247671/pexels-photo-247671.jpeg",
];

function ThemeTab({ onUpdatePreview }) {
  const [background, setBackground] = useState("");
  const [fontStyle, setFontStyle] = useState("");

  const handleBackgroundChange = (e) => {
    setBackground(e.target.value);
    onUpdatePreview({ background: e.target.value });
  };

  const handleFontChange = (e) => {
    setFontStyle(e.target.value);
    onUpdatePreview({ fontStyle: e.target.value });
  };

  const handleThumbnailClick = (url) => {
    setBackground(url);
    onUpdatePreview({ background: url });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-bold mb-2">
          Enter Background Image URL:
        </label>
        <input
          type="text"
          placeholder="Enter background image URL"
          value={background}
          onChange={handleBackgroundChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-bold mb-2">
          Or Select a Background Image:
        </label>
        <div className="grid grid-cols-5 gap-2">
          {backgroundOptions.map((url, index) => (
            <img
              key={index}
              src={`${url}?auto=compress&cs=tinysrgb&h=128&w=128`}
              alt={`Background ${index + 1}`}
              className={`cursor-pointer border ${
                background === url ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => handleThumbnailClick(url)}
              style={{ width: 128, height: 128 }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block font-bold mb-2">Select Font Style:</label>
        <select
          value={fontStyle}
          onChange={handleFontChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Default Font</option>
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans-Serif</option>
          <option value="monospace">Monospace</option>
        </select>
      </div>
    </div>
  );
}

export default ThemeTab;
