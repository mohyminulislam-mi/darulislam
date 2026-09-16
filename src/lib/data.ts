import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://darulislam-server-v2.vercel.app/api",
});

export const getAllCourses = async () => {
  try {
    const { data } = await api.get("/courses/education", {
      params: {
        t: Date.now(),
      },
    });
    return data;
  } catch (error) {
    console.error("Error propagating education directory payload:", error);
    throw error;
  }
};