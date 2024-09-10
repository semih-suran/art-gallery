import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase.config";
import Modal from "../components/Auth/Modal";

function WelcomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleGetStartedClick = () => {
    if (user) {
      navigate("/create-exhibition");
    } else {
      setShowModal(true);
    }
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
        onClick={handleGetStartedClick}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Get Started
      </button>
      <Modal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}

export default WelcomePage;
