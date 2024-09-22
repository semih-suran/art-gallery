import React, { useEffect, useState } from "react";
import {
  fetchExhibitionsByUser,
  fetchAllCuratorusers,
  fetchCuratorusersById,
} from "../services/api";
import { auth } from "../config/firebase.config";
import { useNavigate } from "react-router-dom";
import Account from "../components/Account";

function AccountPage() {
  const navigate = useNavigate();
  const handleCreateExhibition = () => {
    navigate("/create-exhibition");
  };
  const [exhibitions, setExhibitions] = useState([]);
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

  useEffect(() => {
    const getUserExhibitions = async (userId) => {
      try {
        const fetchedExhibitions = await fetchExhibitionsByUser(userId);
        setExhibitions(fetchedExhibitions);
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      }
    };

    if (curatorUser && curatorUser.id) {
      getUserExhibitions(curatorUser.id);
    }
  }, [curatorUser]);

  return (
    <>
      <div className="mb-4">
        <Account />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
        <div className="space-y-6 w-full max-w-md">
          <button
            onClick={handleCreateExhibition}
            className="w-full px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900"
          >
            Create New Exhibition
          </button>
          <div className="border rounded-lg p-4">
            <h2 className="text-2xl font-semibold">Your Exhibitions</h2>
            {exhibitions.length > 0 ? (
              <div className="exhibitions-list grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {exhibitions.map((exhibition) => (
                  <div
                    key={exhibition.id}
                    className="exhibition-card border p-4 rounded-md shadow-sm bg-white"
                    onClick={() => navigate(`/exhibition-edit/${exhibition.id}`)}
                    style={{
                      backgroundImage: `url(${exhibition.background})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      minHeight: "100px",
                      color: "white",
                    }}
                  >                    
                    <h3 className="font-semibold">{exhibition.title}</h3>
                    <p>at {exhibition.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center mt-6">
                No exhibitions found. Create one!
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountPage;
