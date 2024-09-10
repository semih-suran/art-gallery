import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase.config";
import Modal from "../components/Auth/Modal";
import Footer from "../components/Footer";

function WelcomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const speed = 0.5;
      if (videoRef.current) {
        videoRef.current.style.transform = `translateY(${
          scrollPosition * speed
        }px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      {/* Container to control video size */}
      <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden"> {/* Adjusted height */}
        <div className="relative w-[80%] h-[80%] max-w-[800px] max-h-[450px] overflow-hidden">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="absolute top-20 left-0 w-full h-full object-cover"
            src="/media/Art_Background_Video.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-label="Art Background Video"
          />
        </div>
        <div className="absolute z-10 flex items-center justify-center h-full">
          <h1 className="text-4xl font-bold text-white text-center">
            Create Elegance
          </h1>
        </div>
      </div>

      {/* Adjusted margin top to reduce spacing */}
      <div className="flex flex-col items-center justify-center"> 
        <img src="./art.svg" alt="Art Gallery Logo" className="w-24 h-24 mb-6" />
        <h1 className="text-2xl font-bold mb-4">Welcome to Your Art Gallery</h1>
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
      </div>
      <Footer />
      <Modal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}

export default WelcomePage;
