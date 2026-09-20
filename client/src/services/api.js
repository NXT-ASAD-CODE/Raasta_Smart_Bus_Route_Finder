const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api";

const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            },
            ...options
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong"
        );
    }

    return data;
};

export const getCities = async () => {
    return apiRequest("/cities");
};

export const createCity = async (cityData) => {
    return apiRequest("/cities", {
        method: "POST",
        body: JSON.stringify(cityData)
    });
};

export const getStops = async () => {
    return apiRequest("/stops");
};

export const searchRoutes = async (
    fromStop,
    toStop
) => {
    return apiRequest("/search", {
        method: "POST",
        body: JSON.stringify({
            fromStop,
            toStop
        })
    });
};