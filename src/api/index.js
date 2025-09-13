const API_HOST = process.env.REACT_APP_API_HOST || "http://localhost:3001"

function apiFetch(endpoint, request) {
    return fetch(`${API_HOST}${endpoint}`, request);
}

export function getLamp(lamp) {
    const request = {
    method: "GET",
    headers: { "Content-Type": "application/json"}
    };
    const request_url = "/lamp/" + lamp;

    
    apiFetch(request_url, request)
    .then(r => r.json())
    .then(j => {
        return j.val===1;
    });

    return null;
}

export function toggleLamp(lamp) {
    const request = {
    method: "PUT",
    headers: { "Content-Type": "application/json"}
    };
    apiFetch(`/lamp/${lamp}/toggle`, request)
    .then(r => r.json())
    .then(j => {
        return j.val===1;
    });
    return null;
}

export function setLamp(lamp, val) {
    const request = {
    method: "PUT",
    headers: { "Content-Type": "application/json"}
    };
    apiFetch(`/lamp/${lamp}/set/${val ? 1 : 0}`, request)
    .then(r => r.json())
    .then(j => {
        return j.val===1;
    });
    return null;
}

export function getTemp() {
    const request = {
        method: "GET",
        headers: { "Content-Type": "application/json"}
    };
    const request_url = "/temp";
    console.log("fetching from",request_url);
    fetch(request_url, request)
        .then(r => r.json())
        .then(j => {
            return j.temp.toFixed(2);
        });
    return null;
}

const api = {
    getLamp,
    toggleLamp,
    setLamp,
    getTemp
};

export default api;