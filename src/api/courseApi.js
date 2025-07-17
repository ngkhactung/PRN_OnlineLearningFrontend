import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const checkEnrollment = async (courseId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;
  try {
    const res = await axios.get(
      `${baseUrl}/courses/enrollment/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    return false;
  }
};