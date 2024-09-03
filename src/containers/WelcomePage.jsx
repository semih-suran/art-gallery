import React from "react";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src="./art.svg" alt="Art Gallery Logo" className="w-24 h-24 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Art Gallery</h1>
      <p className="text-center text-lg mb-8">
        Create and curate your own art exhibitions with ease! Discover artworks
        from the world’s most renowned museums and showcase them in a beautiful
        virtual gallery.
      </p>
      <button
        onClick={handleLoginClick}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Get Started
      </button>
    </div>
  );
}

export default WelcomePage;
