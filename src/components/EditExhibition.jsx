import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchExhibitionById, updateExhibition } from "../services/api";

const EditExhibition = () => {
  const { id: exhibitionId } = useParams();
  const navigate = useNavigate();

  const [exhibitionData, setExhibitionData] = useState({
    user_id: "",
    title: "",
    date: "",
    location: "",
    description: "",
    font: "",
    background: "",
    exhibitions: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await fetchExhibitionById(exhibitionId);
        const formattedDate = fetchedData.date
          ? new Date(fetchedData.date).toISOString().split("T")[0]
          : "";

        setExhibitionData({ ...fetchedData, date: formattedDate });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching exhibition data:", err);
        setError("Failed to fetch exhibition data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [exhibitionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExhibitionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateExhibition(exhibitionId, exhibitionData);
      navigate(`/my-exhibitions/${exhibitionData.user_id}`);
    } catch (err) {
      console.error("Error updating exhibition:", err);
      setError("Failed to update the exhibition.");
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="pt-40 p-4 mx-auto"
      style={{
        backgroundImage: `url(${exhibitionData.background})`,
        fontFamily: exhibitionData.font || "inherit",
        width: "375px",
        backgroundSize: "cover",
      }}
    >
      <div className="p-4 bg-white bg-opacity-70 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Exhibition</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={exhibitionData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block font-semibold">Date</label>
            <input
              type="date"
              name="date"
              value={exhibitionData.date}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block font-semibold">Location</label>
            <input
              type="text"
              name="location"
              value={exhibitionData.location}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block font-semibold">Description</label>
            <textarea
              name="description"
              value={exhibitionData.description}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block font-semibold">Font</label>
            <select
              name="font"
              value={exhibitionData.font}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a Font</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'Open Sans', sans-serif">Open Sans</option>
              <option value="'Lora', serif">Lora</option>
              <option value="'Merriweather', serif">Merriweather</option>
              <option value="'Montserrat', sans-serif">Montserrat</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Background URL</label>
            <input
              type="text"
              name="background"
              value={exhibitionData.background}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block font-semibold">Exhibitions</label>
            <textarea
              name="exhibitions"
              value={exhibitionData.exhibitions}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 border border-black rounded-md bg-white hover:bg-gray-100"
            >
              Update Exhibition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExhibition;
