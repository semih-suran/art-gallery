import React, { useState, useEffect } from "react";
import { IoRemoveCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaRegSave } from "react-icons/fa";
import { saveExhibition } from "../../services/api";
import {
  fetchAllCuratorusers,
  fetchCuratorusersById,
} from "../../services/api";
import { auth } from "../../config/firebase.config";

function ExhibitionPreview({ previewData, onRemoveArtwork }) {
  const {
    background,
    fontStyle,
    artworks,
    title,
    location,
    date,
    description,
  } = previewData;
  const navigate = useNavigate();
  const [curatorUser, setCuratorUser] = useState(null);
  const currentUser = auth.currentUser;
  const userEmail = currentUser ? currentUser.email : null;

  useEffect(() => {
    const getCuratorUser = async (email) => {
      try {
        const allUsers = await fetchAllCuratorusers();
        const matchingUser = allUsers.find((u) => u.email === email);
        if (matchingUser) {
          const fullUser = await fetchCuratorusersById(matchingUser.id);
          setCuratorUser(fullUser);
        }
      } catch (error) {
        console.error("Error fetching curator user:", error);
      }
    };
    if (userEmail) {
      getCuratorUser(userEmail);
    }
  }, [userEmail]);

  const handleArtworkClick = (art) => {
    navigate(`/artwork/${art.source}${art.id}`, {
      state: { art },
    });
  };

  const handleSaveExhibition = async () => {
    if (!curatorUser) {
      alert("User is not logged in. Please log in to save exhibitions.");
      return;
    }
    if (!title) {
      alert('Please fill the "Title" section before saving!');
      return;
    }
    if (!date) {
      alert('Please fill the "Date" section before saving!');
      return;
    }
    if (!location) {
      alert('Please fill the "Location" section before saving!');
      return;
    }
    if (!description) {
      alert('Please fill the "Description" section before saving!');
      return;
    }
    if (!fontStyle) {
      alert('Please fill the "Font Style" section before saving!');
      return;
    }
    if (!background) {
      alert('Please fill the "Background" section before saving!');
      return;
    }
    if (artworks.length === 0) {
      alert(
        "Please select at least one artwork for your exhibition before saving."
      );
      return;
    }

    const exhibitionArtworks = artworks.map((art) => art.source + art.id);

    const exhibitionData = {
      user_id: curatorUser.id,
      title,
      date,
      location,
      description,
      font: fontStyle,
      background,
      exhibitions: exhibitionArtworks,
    };

    try {
      await saveExhibition(exhibitionData);
      alert("Exhibition saved successfully!");
      navigate(`/my-exhibitions/${curatorUser.id}`);
    } catch (error) {
      console.error("Failed to save exhibition:", error);
      alert("Failed to save exhibition.");
    }
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
          <strong>Title:</strong> {title}
        </p>
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
                <p className="text-sm italic">Description for {art.title}</p>
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
