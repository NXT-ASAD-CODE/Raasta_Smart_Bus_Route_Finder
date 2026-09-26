const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api";

const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,

            // Important for admin authentication cookie
            credentials: "include",

            headers: {
                "Content-Type": "application/json",
                ...options.headers
            }
        }
    );

    const contentType =
        response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        const text = await response.text();

        console.error(
            "API returned non-JSON response:",
            text
        );

        throw new Error(
            `Server returned ${response.status} instead of JSON. Check that the backend is running on port 5000.`
        );
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong"
        );
    }

    return data;
};


// =========================
// Cities
// =========================

export const getCities = async () => {
    return apiRequest("/cities");
};

export const createCity = async (cityData) => {
    return apiRequest("/cities", {
        method: "POST",
        body: JSON.stringify(cityData)
    });
};

export const updateCity = async (cityId, cityData) => {
    return apiRequest(`/cities/${cityId}`, {
        method: "PATCH",
        body: JSON.stringify(cityData)
    });
};

export const deactivateCity = async (cityId) => {
    return apiRequest(
        `/cities/${cityId}/deactivate`,
        {
            method: "PATCH"
        }
    );
};

export const reactivateCity = async (cityId) => {
    return apiRequest(
        `/cities/${cityId}/reactivate`,
        {
            method: "PATCH"
        }
    );
};
// =========================
// Stops
// =========================

export const getStops = async () => {
    return apiRequest("/stops");
};

export const createStop = async (stopData) => {
    return apiRequest("/stops", {
        method: "POST",
        body: JSON.stringify(stopData)
    });
};


// =========================
// Route Search
// =========================

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


// =========================
// Routes
// =========================

export const getRoutes = async () => {
    return apiRequest("/routes");
};

export const createRoute = async (routeData) => {
    return apiRequest("/routes", {
        method: "POST",
        body: JSON.stringify(routeData)
    });
};


// =========================
// Admin Authentication
// =========================

export const adminLogin = async (
    email,
    password,
    mobile
) => {
    return apiRequest("/admin/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
            mobile
        })
    });
};

export const verifyAdmin = async () => {
    return apiRequest("/admin/verify", {
        method: "GET"
    });
};