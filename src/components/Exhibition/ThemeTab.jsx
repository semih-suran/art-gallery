import React, { useState } from "react";

const backgroundOptions = [
  "/media/background_1.jpg",
  "/media/background_2.jpg",
  "/media/background_3.jpg",
  "/media/background_4.jpg",
  "/media/background_5.jpg",
  "/media/background_6.jpg",
  "/media/background_7.jpg",
  "/media/background_8.jpg",
  "/media/background_9.jpg",
  "/media/background_10.jpg",
  "/media/background_11.jpg",
  "/media/background_12.jpg",
  "/media/background_13.jpg",
  "/media/background_14.jpg",
  "/media/background_15.jpg",
];

function ThemeTab({ onUpdatePreview }) {
  const [background, setBackground] = useState("");
  const [fontStyle, setFontStyle] = useState("");

  const handleBackgroundChange = (e) => {
    const url = e.target.value;
    setBackground(url);
    onUpdatePreview({ background: url });
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
        <label className="block font-bold mb-2">Select Font Style:</label>
        <select
          value={fontStyle}
          onChange={handleFontChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a Font</option>
          <option value="'Roboto', sans-serif">Roboto</option>
          <option value="'Open Sans', sans-serif">Open Sans</option>
          <option value="'Lora', serif">Lora</option>
          <option value="'Merriweather', serif">Merriweather</option>
          <option value="'Montserrat', sans-serif">Montserrat</option>
        </select>
      </div>
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
              src={url}
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
    </div>
  );
}

export default ThemeTab;
