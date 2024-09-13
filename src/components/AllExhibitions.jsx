import React, { useEffect, useState } from "react";
import {
  fetchAllExhibitions,
  deleteExhibition,
  fetchCuratorusersById, // Use your function for fetching curator by ID
  fetchAllCuratorusers,
} from "../services/api";
import { auth } from "../config/firebase.config";
import { useNavigate } from "react-router-dom";

const AllExhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [curatorUser, setCuratorUser] = useState(null); // State for logged-in curator
  const [curators, setCurators] = useState({}); // State to hold all curators by exhibition
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const userEmail = currentUser ? currentUser.email : null;

  // Fetch curator details for each exhibition by user_id
  const fetchCuratorForExhibition = async (user_id) => {
    try {
      const curator = await fetchCuratorusersById(user_id); // Fetch curator by ID
      return curator;
    } catch (error) {
      console.error("Error fetching curator:", error);
      return null;
    }
  };

  useEffect(() => {
    // Fetch logged-in curator user details
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
      getCuratorUser(userEmail); // Fetch curator details of logged-in user
    }
  }, [userEmail]);

  useEffect(() => {
    const getAllExhibitions = async () => {
      try {
        const fetchedExhibitions = await fetchAllExhibitions();

        // Fetch curator details for each exhibition
        const exhibitionCurators = {};
        for (const exhibition of fetchedExhibitions) {
          if (exhibition.user_id) {
            const curator = await fetchCuratorForExhibition(exhibition.user_id);
            if (curator) {
              exhibitionCurators[exhibition.id] = curator.nickname; // Store nickname
            }
          }
        }

        setExhibitions(fetchedExhibitions);
        setCurators(exhibitionCurators);
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      }
    };

    getAllExhibitions();
  }, []);

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
      <h2 className="text-center text-lg font-bold mt-4">All Exhibitions</h2>
      {exhibitions.length > 0 ? (
        <div className="exhibitions-list grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {exhibitions.map((exhibition) => (
            <div
              key={exhibition.id}
              className="exhibition-card border p-4 rounded-md shadow-sm bg-white"
            >
              <h3 className="font-semibold">
                {exhibition.title}
                {curators[exhibition.id] && (
                  <span className="text-gray-500 italic">
                    {" "}
                    by {curators[exhibition.id]}
                  </span>
                )}
              </h3>
              <p>{exhibition.description}</p>

              {/* Conditionally render Edit and Delete buttons if the logged-in user matches */}
              {curatorUser && exhibition.user_id === curatorUser.id && (
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
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-6">No exhibitions found. Create one!</p>
      )}
    </div>
  );
};

export default AllExhibitions;
