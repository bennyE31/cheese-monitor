const API_HOST = process.env.REACT_APP_API_HOST || "http://localhost:3001"

let authHeader = null;

export function setAuth(username, password) {
  authHeader = "Basic " + btoa(username + ":" + password);
}

async function apiFetch(endpoint, request) {
    if (!authHeader) throw new Error("Not authenticated");
    request.headers["Authorization"] = authHeader;
    return await fetch(`${API_HOST}${endpoint}`, request);
}

export async function getLamp(lamp) {
    console.log("GET LAMP!!!!")
    const request = {
    method: "GET",
    headers: { "Content-Type": "application/json"}
    };
    const request_url = "/lamp/" + lamp;

    try {
        const res = await apiFetch(request_url, request);
        console.log(res);
        const j = await res.json();
        console.log(j);

        return j.val === 1;
    } catch {
        console.error("failed to get lamp " + lamp)
        return null
    }
}

export async function toggleLamp(lamp) {
    const request = {
    method: "PUT",
    headers: { "Content-Type": "application/json"}
    };
    try {
        const res = await apiFetch(`/lamp/${lamp}/toggle`, request);
        console.log(res);
        const j = await res.json();
        console.log(j);

        return j.val===1;
    } catch {
        console.error("failed to toggle lamp " + lamp)
        return null
    }
}

export async function setLamp(lamp, val) {
    const request = {
    method: "PUT",
    headers: { "Content-Type": "application/json"}
    };
    try {
        const res = await apiFetch(`/lamp/${lamp}/set/${val ? 1 : 0}`, request);
        console.log(res);
        const j = await res.json();
        console.log(j);

        return j.val === 1;
    } catch {
        console.error("failed to set lamp " + lamp)
        return null
    }
}

export async function getTemp() {
    const request = {
        method: "GET",
        headers: { "Content-Type": "application/json"}
    };
    const request_url = "/temp";
    console.log("fetching from",request_url);
    try {
        const res = await apiFetch(request_url, request)
        console.log(res);
        const j = await res.json();
        console.log(j);
        return j.temp.toFixed(2);
    } catch {
        return null
    }
}

const api = {
    getLamp,
    toggleLamp,
    setLamp,
    getTemp
};

export default api;