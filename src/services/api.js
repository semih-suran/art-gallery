import axios from "axios";

const HARVARD_API_BASE_URL = import.meta.env.VITE_HARVARD_API_BASE_URL;
const HARVARD_API_KEY = import.meta.env.VITE_HARVARD_API;
const CHICAGO_API_BASE_URL = import.meta.env.VITE_CHICAGO_API_BASE_URL;
const BASE_URL = import.meta.env.VITE_SEMIH_BASE_URL;

// Local Test URL as follows
// const BASE_URL = "http://localhost:9090/api";

export const fetchHarvardArt = async (query, limit = 10) => {
  try {
    const response = await axios.get(`${HARVARD_API_BASE_URL}/object`, {
      params: {
        apikey: HARVARD_API_KEY,
        q: query,
        size: limit,
        hasimage: 1,
        fields: "id,title,primaryimageurl,dated,people,objectnumber",
      },
    });

    const artworks = response.data.records.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.primaryimageurl,
      artist: item.people?.[0]?.name || "Unknown Artist",
      date: item.dated,
      objectNumber: item.objectnumber,
      source: "h",
    }));

    return artworks;
  } catch (error) {
    console.error("Error fetching Harvard Art Museums data:", error);
    return [];
  }
};

export const fetchArtInstitute = async (query, limit = 10) => {
  try {
    const response = await axios.get(
      `${CHICAGO_API_BASE_URL}/artworks/search`,
      {
        params: {
          q: query,
          limit,
          fields: "id,title,image_id,artist_display,date_display",
        },
      }
    );

    const artworks = response.data.data.map((item) => ({
      id: item.id,
      title: item.title,
      image: `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`,
      artist: item.artist_display,
      date: item.date_display,
      source: "c",
    }));

    return artworks;
  } catch (error) {
    console.error("Error fetching Art Institute of Chicago data:", error);
    return [];
  }
};

export const fetchHarvardArtworkById = async (id) => {
  try {
    const response = await axios.get(`${HARVARD_API_BASE_URL}/object/${id}`, {
      params: {
        apikey: HARVARD_API_KEY,
      },
    });

    const artwork = response.data;
    return {
      id: artwork.id,
      title: artwork.title,
      image: artwork.primaryimageurl,
      artist: artwork.people?.[0]?.name || "Unknown Artist",
      date: artwork.dated,
      description: artwork.description,
    };
  } catch (error) {
    console.error("Error fetching specific Harvard artwork:", error);
    return null;
  }
};

export const fetchArtInstituteArtworkById = async (id) => {
  try {
    const response = await axios.get(`${CHICAGO_API_BASE_URL}/artworks/${id}`);

    const artwork = response.data.data;
    return {
      id: artwork.id,
      title: artwork.title,
      image: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
      artist: artwork.artist_display,
      date: artwork.date_display,
      description: artwork.thumbnail?.alt_text || "No description available.",
    };
  } catch (error) {
    console.error("Error fetching specific Chicago artwork:", error);
    return null;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/curator-users`, {
      first_name: userData.first_name,
      last_name: userData.last_name,
      nickname: userData.nickname,
      email: userData.email,
      verified: userData.verified,
      password: userData.password,
      picture: userData.picture,
      mobile_phone: userData.mobile_phone,
      street: userData.street,
      city: userData.city,
      state: userData.state,
      zipCode: userData.zipCode,
      country: userData.country,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/curator-login`, credentials);
    return response;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error;
  }
};

export const fetchCuratorusersById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/curator-users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user by ID ${id}:`, error);
    throw error;
  }
};

export const fetchAllCuratorusers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/curator-users`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user by ID ${id}:`, error);
    throw error;
  }
};

export const updateUserNickname = async (id, nicknameData) => {
  try {
    await axios.patch(`${BASE_URL}/curator-users/${id}/nickname`, nicknameData);
  } catch (error) {
    console.error("Error updating nickname:", error);
    throw error;
  }
};

export const updateUserAddress = async (id, addressData) => {
  try {
    await axios.patch(`${BASE_URL}/curator-users/${id}/address`, addressData);
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

export const saveExhibition = async (exhibitionData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/curator-exhibitions`,
      exhibitionData
    );
    return response.data;
  } catch (error) {
    console.error("Error saving exhibition:", error);
    throw error;
  }
};

export const fetchExhibitionsByUser = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/curator-exhibitions/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching exhibitions for user ${userId}:`, error);
    throw error;
  }
};

export const deleteExhibition = async (exhibitionId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/curator-exhibitions/${exhibitionId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting exhibition ${exhibitionId}:`, error);
    throw error;
  }
};

export const updateExhibition = async (exhibitionId, exhibitionData) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/curator-exhibitions/${exhibitionId}`,
      exhibitionData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating exhibition ${exhibitionId}:`, error);
    throw error;
  }
};

export const fetchExhibitionById = async (exhibitionId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/curator-exhibitions/${exhibitionId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching exhibition ${exhibitionId}:`, error);
    throw error;
  }
};

export const fetchAllExhibitions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/curator-exhibitions/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exhibitions:`, error);
    throw error;
  }
};
