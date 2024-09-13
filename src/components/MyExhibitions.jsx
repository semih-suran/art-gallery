import React, { useEffect, useState } from "react";
import {
  fetchExhibitionsByUser,
  deleteExhibition,
  fetchAllCuratorusers,
  fetchCuratorusersById,
} from "../services/api";
import { auth } from "../config/firebase.config";
import { useNavigate } from "react-router-dom";

const MyExhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [curatorUser, setCuratorUser] = useState(null);
  const navigate = useNavigate();
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

  const handleDelete = async (id) => {
    try {
      await deleteExhibition(id);
      setExhibitions((prev) =>
        prev.filter((exhibition) => exhibition.id !== id)
      );
    } catch (error) {
      console.error(`Error deleting exhibition ${id}:`, error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-exhibition/${id}`);
  };

  return (
    <div className="pt-40">
      <h2 className="text-center text-lg font-bold mt-4">My Exhibitions</h2>
      {exhibitions.length > 0 ? (
        <div className="exhibitions-list grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {exhibitions.map((exhibition) => (
            <div
              key={exhibition.id}
              className="exhibition-card border p-4 rounded-md shadow-sm bg-white"
            >
              <h3 className="font-semibold">{exhibition.title}</h3>
              <p>{exhibition.description}</p>
              <div className="mt-2 flex justify-between">
                <button
                  onClick={() => handleEdit(exhibition.id)}
                  className="text-blue-500 underline"
                >
                  View / Edit
                </button>
                <button
                  onClick={() => handleDelete(exhibition.id)}
                  className="text-red-500 underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-6">No exhibitions found. Create one!</p>
      )}
    </div>
  );
};

export default MyExhibitions;
