const API_BASE_URL = "https://creative33-9f884-default-rtdb.firebaseio.com/";

async function fetchData(endpoint = "") {
  const response = await fetch(`${API_BASE_URL}${endpoint}.json`);
  return await response.json();
}

async function submitData(endpoint = "", payload = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await response.json();
}

async function updateData(endpoint = "", payload = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await response.json();
}

async function removeData(endpoint = "") {
  const response = await fetch(`${API_BASE_URL}${endpoint}.json`, {
    method: "DELETE",
  });
  return await response.json();
}
