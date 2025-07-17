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
    console.error("Error checking enrollment:", err);
    return false;
  }
};

export const fetchSpecialCourses = async () => {
  const queryParams = new URLSearchParams();
  queryParams.append("Page", "1");
  queryParams.append("PageSize", "3");
  queryParams.append("SortBy", "Popular");
  queryParams.append("SortOrder", "desc");

  const response = await fetch(`${baseUrl}/courses/filter?${queryParams.toString()}`);
  const result = await response.json();
  if (result.success) {
    return result.data.dataPaginated;
  }
  return [];
};