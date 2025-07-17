import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
export async function fetchCourseData(courseId) {
  const res = await fetch(`${baseURL}/courses/learning/${courseId}`);
  return res.json();
}

export async function fetchProgress(courseId) {
  const res = await fetch(`${baseURL}/courses/progress/${courseId}`);
  return res.json();
}

export async function markLessonAsCompleted(lessonId) {
  const res = await fetch(`${baseURL}/courses/mark-as-completed/${lessonId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

export const checkEnrollment = async (courseId) => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const res = await axios.get(
      `${baseURL}/courses/enrollment/${courseId}`,
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

  const response = await fetch(`${baseURL}/courses/filter?${queryParams.toString()}`);
  const result = await response.json();
  if (result.success) {
    return result.data.dataPaginated;
  }
  return [];
};
