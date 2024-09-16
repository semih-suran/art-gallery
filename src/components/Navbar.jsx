import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { auth } from "../config/firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { fetchAllCuratorusers, fetchCuratorusersById } from "../services/api";
import Modal from "./Auth/Modal";
import UnderDevelopment from "./UnderDevelopment";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [curatorUser, setCuratorUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 450);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [showUDModal, setShowUDModal] = useState(false);

  const underDevelopment = () => {
    setShowUDModal(true);
  };

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

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
        getCuratorUser(currentUser.email);
      } else {
        setUser(null);
        setCuratorUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 450);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCuratorUser(null);
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const renderMenuItems = (className) => (
    <div className={className}>
      <Link
        to="/"
        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        onClick={handleMenuItemClick}
      >
        Home
      </Link>

      <Link
        to="/all-exhibitions"
        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        onClick={handleMenuItemClick}
      >
        All Exhibitions
      </Link>
      <Link
        to="/my-exhibitions"
        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        onClick={handleMenuItemClick}
      >
        My Exhibitions
      </Link>
      <Link
        to="/create-exhibition"
        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        onClick={handleMenuItemClick}
      >
        New
      </Link>
    </div>
  );

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex flex-col">
              <Link to="/" className="text-lg font-bold text-gray-800">
                My Exhibition Platform
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user && curatorUser ? (
                <div
                  className="relative flex flex-col items-center space-y-1"
                  ref={dropdownRef}
                >
                  <button
                    className="flex items-center justify-center"
                    onClick={toggleDropdown}
                  >
                    <img
                      src={curatorUser.picture || "https://picsum.photos/150"}
                      alt="User"
                      className="w-12 h-12 rounded-full"
                    />
                  </button>
                  <button
                    onClick={toggleDropdown}
                    className="text-gray-700 hover:text-gray-900 text-sm font-medium"
                  >
                    {curatorUser.nickname || "Nickname"}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-12 w-48 bg-white border border-gray-300 rounded-md shadow-lg py-2">
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
          <div className="flex items-center justify-start mt-2" ref={menuRef}>
            {isWideScreen ? (
              renderMenuItems("flex space-x-4")
            ) : (
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Menu
              </button>
            )}
          </div>
          {isMenuOpen && (
            <div className="flex items-center justify-start mt-2" ref={menuRef}>
              {renderMenuItems("flex flex-col")}
            </div>
          )}
        </div>
      </nav>
      <UnderDevelopment
        show={showUDModal}
        onClose={() => setShowUDModal(false)}
        message="This section is currently under development. Please check back later."
      />
      <Modal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default Navbar;
