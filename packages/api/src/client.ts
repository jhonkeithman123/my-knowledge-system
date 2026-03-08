const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "API request failed");
  }

  return data.data;
}

export const mobileApi = {
  // Topics
  getTopics: () => fetchAPI("/topics"),
  getTopic: (id: string) => fetchAPI(`/topics/${id}`),
  getSubtopics: (id: string) => fetchAPI(`/topics/${id}/subtopics`),
  createTopic: (data: any) =>
    fetchAPI("/topics", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTopic: (id: string, data: any) =>
    fetchAPI(`/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteTopic: (id: string) =>
    fetchAPI(`/topics/${id}`, {
      method: "DELETE",
    }),

  // Concepts
  getConcepts: (topicId: string) => fetchAPI(`/topics/${topicId}/concepts`),
  getConcept: (id: string) => fetchAPI(`/concepts/${id}`),
  createConcept: (data: any) =>
    fetchAPI("/concepts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateConcept: (id: string, data: any) =>
    fetchAPI(`/concepts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteConcept: (id: string) =>
    fetchAPI(`/concepts/${id}`, {
      method: "DELETE",
    }),

  // Search
  search: (query: string) => fetchAPI(`/search?q=${encodeURIComponent(query)}`),
  searchConcepts: (query: string) =>
    fetchAPI(`/search/concepts?q=${encodeURIComponent(query)}`),
};
