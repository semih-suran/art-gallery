import React, { useState } from "react";

function InfoTab({ onUpdatePreview }) {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const handleInputChange = () => {
    onUpdatePreview({ title, location, date, description });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-bold mb-2">Exhibition Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleInputChange();
          }}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block font-bold mb-2">Exhibition Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            handleInputChange();
          }}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block font-bold mb-2">Exhibition Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            handleInputChange();
          }}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block font-bold mb-2">Exhibition Description:</label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleInputChange();
          }}
          className="w-full p-2 border rounded"
        ></textarea>
      </div>
    </div>
  );
}

export default InfoTab;
