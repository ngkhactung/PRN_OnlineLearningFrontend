
const baseURL = import.meta.env.VITE_API_BASE_URL;
function getToken(){
  return localStorage.getItem("token");
}
export async function fetchCourseData(courseId) {
  const token = getToken();
  if (!token) return false;
  const res = await fetch(`${baseURL}/courses/learning/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
}

export async function fetchProgress(courseId) {
  const token = getToken();
  if (!token) return false;
  const res = await fetch(`${baseURL}/courses/progress/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
}

export async function markLessonAsCompleted(lessonId) {
  const token = getToken();
  if (!token) return false;
  const res = await fetch(`${baseURL}/courses/mark-as-completed/${lessonId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function checkEnrollment(courseId) {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${baseURL}/courses/enrollment/${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resData = await res.json();
    return resData.data; // <-- trả về đúng boolean
  } catch (err) {
    console.error("Error checking enrollment:", err);
    return false;
  }
}

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

export async function fetchCoursesEnroll(tab) {
  const token = getToken();
  if (!token) return { success: false, data: [], error: "No token found" };
  
  try {
    const response = await fetch(
      `${baseURL}/courses/my-learning/${tab}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.ok) {
      return { success: false, data: [], error: "Failed to fetch courses" };
    }
    
    const responseData = await response.json();
    return { success: true, data: responseData.data || [], error: null };
  } catch (error) {
    return { success: false, data: [], error: error.message };
  }
}
