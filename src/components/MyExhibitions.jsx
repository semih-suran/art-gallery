import React, { useEffect, useState } from "react";
import {
  fetchExhibitionsByUser,
  deleteExhibition,
  fetchCuratorusersById,
} from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const MyExhibitions = () => {
  const { id } = useParams();
  const user_id = id;
  const [exhibitions, setExhibitions] = useState([]);
  const [curatorUser, setCuratorUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCuratorUser = async (id) => {
      try {
        const fullUser = await fetchCuratorusersById(id);
        setCuratorUser(fullUser);
      } catch (error) {
        console.error("Error fetching curator user:", error);
      }
    };

    if (user_id) {
      fetchCuratorUser(user_id);
    }
  }, [user_id]);

  useEffect(() => {
    const getUserExhibitions = async (id) => {
      setLoading(true);
      try {
        const fetchedExhibitions = await fetchExhibitionsByUser(id);
        setExhibitions(fetchedExhibitions);
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      } finally {
        setLoading(false);
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
    navigate(`/exhibition-edit/${id}`);
  };

  const handleViewExhibition = (id) => {
    navigate(`/exhibition-view/${id}`); // Navigate to the relevant exhibition view page
  };

  return (
    <div className="pt-40">
      <h2 className="text-center text-lg font-bold mt-4">My Exhibitions</h2>
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <img
            src="/media/loading.gif"
            alt="Loading..."
            className="w-80 h-60"
          />
          <p className="text-lg mt-4">Loading exhibitions, please wait...</p>
        </div>
      ) : exhibitions.length > 0 ? (
        <div className="exhibitions-list grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {exhibitions.map((exhibition) => (
            <div
              key={exhibition.id}
              onClick={() => handleViewExhibition(exhibition.id)} // Navigate onClick
              className="exhibition-card border p-4 rounded-md shadow-sm relative h-[200px] w-[300px] mx-auto cursor-pointer" // Added cursor-pointer for better UX
              style={{
                backgroundImage: `url(${exhibition.background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                fontFamily: exhibition.font || "sans-serif",
              }}
            >
              <div className="absolute top-0 left-0 right-0 text-center p-4 bg-opacity-75 bg-black text-white rounded-t-md">
                <h3 className="font-semibold">{exhibition.title}</h3>
                <p>
                  at {exhibition.location}, on{" "}
                  {new Date(exhibition.date).toLocaleDateString()}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2 bg-opacity-75 bg-black text-white">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from propagating to the div
                    handleEdit(exhibition.id);
                  }}
                  className="text-blue-500 underline"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from propagating to the div
                    handleDelete(exhibition.id);
                  }}
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
