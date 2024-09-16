import React, { useState } from "react";

const backgroundOptions = [
  "https://t3.ftcdn.net/jpg/04/83/50/72/240_F_483507282_d2BapyPOVcLx6maMXhSl8pnVAXlMTMCu.jpg",
  "https://t3.ftcdn.net/jpg/01/91/78/32/240_F_191783282_0TVrx5VrvrkpDHSKdjjI87HkbXJy5TMw.jpg",
  "https://t4.ftcdn.net/jpg/00/93/85/77/240_F_93857796_qLrpr07hATvqdRphenFoVx2JKSNKY3NE.jpg",
  "https://t3.ftcdn.net/jpg/00/68/81/24/240_F_68812489_5wFdCbLq9WjO7wd5IWcPgGsr7E29wrtr.jpg",
  "https://t3.ftcdn.net/jpg/01/34/11/58/240_F_134115811_zDBMdIni0jDuAMVpFsovAK9H3xUcrTMg.jpg",
  "https://t3.ftcdn.net/jpg/03/30/59/60/240_F_330596087_U626GuHm42zeoV7WjpMaPrdn9K10D3fY.jpg",
  "https://t3.ftcdn.net/jpg/00/64/09/92/240_F_64099251_mzI1Phve8eONFsk1WKMoY4fZV4J50otc.jpg",
  "https://t3.ftcdn.net/jpg/02/16/49/46/240_F_216494639_uZ0e27KMsl5qyKFXiZDTGUPO7bcMxCeh.jpg",
  "https://t4.ftcdn.net/jpg/04/73/74/53/240_F_473745366_1U2qGsM9OM9La7ZTjOd7leEJ6tZVd2jm.jpg",
  "https://t4.ftcdn.net/jpg/01/75/84/87/240_F_175848794_Z776U0628zvqI7qW7Nebz7L2lziTvlbL.jpg",
  "https://t4.ftcdn.net/jpg/08/39/42/13/240_F_839421398_syktsm99vWJtIVJTUHN0NQDGsHkU8iov.jpg",
  "https://t3.ftcdn.net/jpg/06/10/71/62/240_F_610716230_vt5dgEE267bkhWTQJXXakq6V9Jn2wQ0C.jpg",
  "https://t4.ftcdn.net/jpg/05/71/83/47/240_F_571834789_ujYbUnH190iUokdDhZq7GXeTBRgqYVwa.jpg",
  "https://t4.ftcdn.net/jpg/02/97/25/15/240_F_297251563_LN4Ok2k0rXtsCKbBgr2rlINBXYn9duao.jpg",
  "https://t4.ftcdn.net/jpg/03/79/10/59/240_F_379105991_mSYkJP13bmbwAqoLkK9YRgqzvXCnICWv.jpg",
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
    </div>
  );
}

export default ThemeTab;
