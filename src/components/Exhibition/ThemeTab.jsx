import React, { useState } from "react";

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

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-bold mb-2">Select Background:</label>
        <input
          type="text"
          placeholder="Enter background image URL"
          value={background}
          onChange={handleBackgroundChange}
          className="w-full p-2 border rounded"
        />
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
