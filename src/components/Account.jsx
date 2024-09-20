import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the user ID from the URL
import {
  updateUserNickname,
  updateUserAddress,
  fetchCuratorusersById,
} from "../services/api";
import { FaRegSave } from "react-icons/fa";

function Account() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Profile");
  const { id } = useParams(); // Get the user ID from the URL

  useEffect(() => {
    const getCuratorUser = async (userId) => {
      try {
        const fullUser = await fetchCuratorusersById(userId);
        setUser(fullUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (id) {
      getCuratorUser(id); // Fetch the user by the ID from the URL
    }
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSaveNickname = async () => {
    try {
      const nicknameData = { nickname: user.nickname };
      await updateUserNickname(user.id, nicknameData);
      alert("Nickname updated successfully!");
    } catch (error) {
      console.error("Failed to update nickname:", error);
      alert("Failed to update nickname.");
    }
  };

  const handleSaveAddress = async () => {
    try {
      const addressData = {
        street: user.street,
        city: user.city,
        state: user.state,
        zipcode: user.zipcode,
        country: user.country,
      };
      await updateUserAddress(user.id, addressData);
      alert("Address updated successfully!");
    } catch (error) {
      console.error("Failed to update address:", error);
      alert("Failed to update address.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <label className="block mb-2">Nickname:</label>
            <div className="relative">
              <input
                type="text"
                value={user.nickname || ""}
                onChange={(e) => setUser({ ...user, nickname: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md hover:border-black"
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSaveNickname}
                className="flex items-center gap-2 px-4 py-2 border border-black rounded-md bg-white hover:bg-gray-100"
              >
                <FaRegSave />
                Save
              </button>
            </div>
          </div>
        );
      case "Address":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Edit Address</h2>
            <label className="block mb-2">Street:</label>
            <input
              type="text"
              value={user.street || ""}
              onChange={(e) => setUser({ ...user, street: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md hover:border-black"
            />
            <label className="block mb-2">City:</label>
            <input
              type="text"
              value={user.city || ""}
              onChange={(e) => setUser({ ...user, city: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md hover:border-black"
            />
            <label className="block mb-2">State:</label>
            <input
              type="text"
              value={user.state || ""}
              onChange={(e) => setUser({ ...user, state: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md hover:border-black"
            />
            <label className="block mb-2">Zip Code:</label>
            <input
              type="text"
              value={user.zipcode || ""}
              onChange={(e) => setUser({ ...user, zipcode: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md hover:border-black"
            />
            <label className="block mb-2">Country:</label>
            <input
              type="text"
              value={user.country || ""}
              onChange={(e) => setUser({ ...user, country: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md hover:border-black"
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSaveAddress}
                className="flex items-center gap-2 px-4 py-2 border border-black rounded-md bg-white hover:bg-gray-100"
              >
                <FaRegSave />
                Save
              </button>
            </div>
          </div>
        );
      default:
        return <div>Select a tab to edit user information.</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-8 pt-40">
      <div className="flex flex-col sm:flex-row w-full h-full max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="sm:w-1/4 w-full bg-gray-700 p-6 flex flex-col items-center text-white sm:min-w-[250px] sm:max-w-[250px]">
          <h1 className="text-xl font-semibold">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-sm">{user.email}</p>
          <img
            src={user.picture}
            alt="User Profile"
            className="w-24 h-24 m-4 rounded-full border-4 border-white"
          />
          <p className="text-sm">{user.nickname}</p>
          <p className="text-sm">Last updated at:</p>
          <p className="text-sm">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            }).format(new Date(user.updated_at))}
          </p>
          <div className="grid grid-cols-2 gap-2 mt-6 w-full">
            <button
              onClick={() => setActiveTab("Profile")}
              className="bg-gray-600 text-white py-2 px-4 rounded border border-transparent hover:border-white"
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("Address")}
              className="bg-gray-600 text-white py-2 px-4 rounded border border-transparent hover:border-white"
            >
              Address
            </button>
          </div>
        </div>
        <div className="w-full p-6">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Account;
