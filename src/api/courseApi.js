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