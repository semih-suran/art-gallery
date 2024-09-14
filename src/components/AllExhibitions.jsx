import React, { useEffect, useState } from "react";
import {
  fetchAllExhibitions,
  deleteExhibition,
  fetchCuratorusersById,
  fetchAllCuratorusers,
  fetchHarvardArtworkById,
  fetchArtInstituteArtworkById,
} from "../services/api";
import { auth } from "../config/firebase.config";
import { useNavigate } from "react-router-dom";

const AllExhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [curatorUser, setCuratorUser] = useState(null);
  const [curators, setCurators] = useState({});
  const [loading, setLoading] = useState(true);
  const [artworks, setArtworks] = useState({});
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const userEmail = currentUser ? currentUser.email : null;

  const fetchCuratorForExhibition = async (user_id) => {
    try {
      const curator = await fetchCuratorusersById(user_id);
      return curator;
    } catch (error) {
      console.error("Error fetching curator:", error);
      return null;
    }
  };

  const fetchArtwork = async (id) => {
    if (!id) return null;

    const type = id.charAt(0);
    try {
      if (type === "h") {
        return await fetchHarvardArtworkById(id.slice(1));
      } else if (type === "c") {
        return await fetchArtInstituteArtworkById(id.slice(1));
      }
    } catch (error) {
      console.error(`Error fetching artwork with ID ${id}:`, error);
    }
    return null;
  };

  const fetchAllArtworks = async (exhibitions) => {
    const artworksMap = {};
    for (const exhibition of exhibitions) {
      const artworkPromises = exhibition.exhibitions.map((artworkId) =>
        fetchArtwork(artworkId)
      );
      const fetchedArtworks = await Promise.all(artworkPromises);
      artworksMap[exhibition.id] = fetchedArtworks;
    }
    setArtworks(artworksMap);
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

    if (userEmail) {
      getCuratorUser(userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    const getAllExhibitions = async () => {
      setLoading(true);
      try {
        const fetchedExhibitions = await fetchAllExhibitions();
        const exhibitionCurators = {};

        for (const exhibition of fetchedExhibitions) {
          if (exhibition.user_id) {
            const curator = await fetchCuratorForExhibition(exhibition.user_id);
            if (curator) {
              exhibitionCurators[exhibition.id] = curator.nickname;
            }
          }
        }

        setExhibitions(fetchedExhibitions);
        setCurators(exhibitionCurators);

        await fetchAllArtworks(fetchedExhibitions);
      } catch (error) {
        console.error("Error fetching exhibitions:", error);
      } finally {
        setLoading(false);
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

  const limitTitleLength = (title, limit = 20) => {
    return title.length > limit ? `${title.substring(0, limit)}...` : title;
  };

  return (
    <div className="pt-40">
      <h2 className="text-center text-lg font-bold mt-4">All Exhibitions</h2>
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <img
            src="https://cdn.pixabay.com/animation/2022/10/11/03/16/03-16-39-160_512.gif"
            alt="Loading..."
            className="w-20 h-20"
          />
          <p className="text-lg mt-4">Loading exhibitions, please wait...</p>
        </div>
      ) : exhibitions.length > 0 ? (
        <div className="exhibitions-list grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {exhibitions.map((exhibition) => (
            <div
              key={exhibition.id}
              className="exhibition-card border p-4 rounded-md shadow-sm bg-white relative h-[500px] w-[300px] mx-auto"
              style={{
                backgroundImage: `url(${exhibition.background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                fontFamily: exhibition.font || "sans-serif",
              }}
            >
              <div className="absolute top-0 left-0 right-0 text-center p-4 bg-opacity-75 bg-black text-white rounded-t-md">
                <h3 className="font-bold">{exhibition.title}</h3>
                {curators[exhibition.id] && (
                  <p className="italic">
                    by {curators[exhibition.id]} at {exhibition.location}
                  </p>
                )}
                <p className="text-sm">
                  on {new Date(exhibition.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col justify-center items-center h-full text-white mt-20">
                {artworks[exhibition.id]?.[0] && (
                  <div className="flex items-center w-full px-2">
                    <img
                      src={artworks[exhibition.id][0].image}
                      alt={artworks[exhibition.id][0].title}
                      className="w-1/2 h-auto max-h-40 object-contain"
                    />
                    <p className="w-1/2 text-center font-semibold ml-2">
                      {limitTitleLength(artworks[exhibition.id][0].title)}
                    </p>
                  </div>
                )}
                {artworks[exhibition.id]?.[1] && (
                  <div className="flex items-center w-full px-2 mt-4">
                    <p className="w-1/2 text-center font-semibold mr-2">
                      {limitTitleLength(artworks[exhibition.id][1].title)}
                    </p>
                    <img
                      src={artworks[exhibition.id][1].image}
                      alt={artworks[exhibition.id][1].title}
                      className="w-1/2 h-auto max-h-40 object-contain"
                    />
                  </div>
                )}
              </div>
              {curatorUser && exhibition.user_id === curatorUser.id && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2 bg-opacity-75 bg-black text-white">
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
