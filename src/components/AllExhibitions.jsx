import React, { useEffect, useState, useMemo } from "react";
import {
  fetchAllExhibitions,
  fetchCuratorusersById,
  fetchHarvardArtworkById,
  fetchArtInstituteArtworkById,
} from "../services/api";
import { useNavigate } from "react-router-dom";

const AllExhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [curators, setCurators] = useState({});
  const [loading, setLoading] = useState(true);
  const [artworks, setArtworks] = useState({});
  const navigate = useNavigate();

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
    const artworkPromises = exhibitions.map((exhibition) =>
      Promise.all(exhibition.exhibitions.map(fetchArtwork))
    );

    const allFetchedArtworks = await Promise.all(artworkPromises);
    const artworksMap = {};

    exhibitions.forEach((exhibition, index) => {
      artworksMap[exhibition.id] = allFetchedArtworks[index];
    });

    setArtworks(artworksMap);
  };

  useEffect(() => {
    const getAllExhibitions = async () => {
      setLoading(true);
      try {
        const fetchedExhibitions = await fetchAllExhibitions();
        const curatorPromises = fetchedExhibitions.map((exhibition) =>
          fetchCuratorForExhibition(exhibition.user_id)
        );

        const fetchedCurators = await Promise.all(curatorPromises);

        const exhibitionCurators = fetchedExhibitions.reduce(
          (acc, exhibition, index) => {
            acc[exhibition.id] =
              fetchedCurators[index]?.nickname || "Unknown Curator";
            return acc;
          },
          {}
        );
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

  const limitTitleLength = (title, limit = 20) => {
    return title.length > limit ? `${title.substring(0, limit)}...` : title;
  };

  const artworkMemo = useMemo(() => artworks, [artworks]);

  return (
    <div className="pt-40">
      <h2 className="text-center text-lg font-bold mt-4">All Exhibitions</h2>
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
              className="exhibition-card border p-4 rounded-md shadow-sm bg-white relative h-[500px] w-[300px] mx-auto"
              style={{
                backgroundImage: `url(${exhibition.background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                fontFamily: exhibition.font || "sans-serif",
              }}
              onClick={() => navigate(`/exhibition/${exhibition.id}`)}
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
                {artworkMemo[exhibition.id]?.[0] && (
                  <div className="flex items-center w-full px-2">
                    <img
                      src={artworkMemo[exhibition.id][0].image}
                      alt={artworkMemo[exhibition.id][0].title}
                      className="w-1/2 h-auto max-h-40 object-contain"
                    />
                    <p className="w-1/2 text-center font-semibold ml-2">
                      {limitTitleLength(artworkMemo[exhibition.id][0].title)}
                    </p>
                  </div>
                )}
                {artworkMemo[exhibition.id]?.[1] && (
                  <div className="flex items-center w-full px-2 mt-4">
                    <p className="w-1/2 text-center font-semibold mr-2">
                      {limitTitleLength(artworkMemo[exhibition.id][1].title)}
                    </p>
                    <img
                      src={artworkMemo[exhibition.id][1].image}
                      alt={artworkMemo[exhibition.id][1].title}
                      className="w-1/2 h-auto max-h-40 object-contain"
                    />
                  </div>
                )}
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

export default AllExhibitions;
