// Quiz API functions

export async function getQuizById(baseUrl, quizId) {
  const res = await fetch(`${baseUrl}/quiz/${quizId}`);
  return res.json();
}

export async function getQuizByModuleId(baseUrl, moduleId) {
  const res = await fetch(`${baseUrl}/quiz/module/${moduleId}`);
  return res.json();
}

export async function submitQuiz(baseUrl, quizId, answers) {
  const res = await fetch(`${baseUrl}/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quizId, answers })
  });
  return res.json();
}

export async function getQuizResult(baseUrl, quizId) {
  const res = await fetch(`${baseUrl}/quiz/result/${quizId}`);
  return res.json();
}

export async function getUserQuizResults(baseUrl) {
  const res = await fetch(`${baseUrl}/quiz/results`);
  return res.json();
}

export async function completeQuiz(baseUrl, quizId) {
  const res = await fetch(`${baseUrl}/quiz/completed/${quizId}`);
  return res.json();
} 