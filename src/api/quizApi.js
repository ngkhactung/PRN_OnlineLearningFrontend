// Quiz API functions

function getToken() {
  return localStorage.getItem("token");
}

export async function getQuizById(baseUrl, quizId) {
  const token = getToken();
  const res = await fetch(`${baseUrl}/quiz/${quizId}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.json();
}

export async function getQuizByModuleId(baseUrl, moduleId) {
  const token = getToken();
  const res = await fetch(`${baseUrl}/quiz/module/${moduleId}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.json();
}

export async function submitQuiz(baseUrl, quizId, answers) {
  const token = getToken();
  const res = await fetch(`${baseUrl}/quiz/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ quizId, answers })
  });
  return res.json();
}

export async function getQuizResult(baseUrl, quizId) {
  const token = getToken();
  const res = await fetch(`${baseUrl}/quiz/result/${quizId}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.json();
}

export async function getUserQuizResults(baseUrl) {
  const token = getToken();
  const res = await fetch(`${baseUrl}/quiz/results`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.json();
}

export async function completeQuiz(baseUrl, quizId) {
  const token = getToken();
  const res = await fetch(`${baseUrl}/quiz/completed/${quizId}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.json();
} 