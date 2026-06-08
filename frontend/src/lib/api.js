const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const USER_STORAGE_KEY = "agriscan_user";

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function storeUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("agriscan-user-updated"));
}

export function clearStoredUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
  window.dispatchEvent(new Event("agriscan-user-updated"));
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Request failed");
  }

  return response.json();
}

export const api = {
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getMe: () => request("/users/me"),
  getSession: () => request("/auth/me"),
  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),
  updateProfile: (profile) =>
    request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ profile }),
    }),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/users/me/avatar", {
      method: "POST",
      body: formData,
    });
  },
  uploadScan: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/scans", {
      method: "POST",
      body: formData,
    });
  },
  confirmScan: (scanId, isCorrect) =>
    request(`/scans/${scanId}/confirm`, {
      method: "POST",
      body: JSON.stringify({ isCorrect }),
    }),
  getDashboard: () => request("/dashboard"),
  askAi: (question) =>
    request("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
  askVoice: (question) =>
    request("/ai/voice", {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
  getAiMessages: () => request("/ai/chat"),
  getHistory: () => request("/history"),
  exportHistoryUrl: () => `${API_BASE_URL}/history/export`,
};
