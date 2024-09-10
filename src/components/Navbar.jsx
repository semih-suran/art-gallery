import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { auth } from "../config/firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Modal from "./Auth/Modal";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-lg font-bold text-gray-800">
              My Exhibition Platform
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                {console.log("user? >>", user)}
                  <button
                    className="flex items-center space-x-2"
                    onClick={toggleDropdown}
                  >
                    {user ? (
                      <img
                        src={"https://picsum.photos/150"}
                        alt="User"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <FaUser className="w-6 h-6" />
                    )}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg py-1">
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={toggleDropdown}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
                >
                  <FaUser className="w-6 h-6" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Modal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default Navbar;
