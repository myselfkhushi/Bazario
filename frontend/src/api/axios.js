import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    // 60-second timeout to gracefully handle Render free-tier cold-start delays
    timeout: 60000,
});

// Request Interceptor: Attach Bearer JWT Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Cold-Start Timeouts & 401 Token Expiry
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 1. Handle Render Server Cold-Start Timeout
        if (error.code === "ECONNABORTED" || error.message?.toLowerCase().includes("timeout")) {
            console.warn("[Bazario Network] Server cold-start delay exceeded timeout limit.");
            return Promise.reject({
                ...error,
                response: {
                    ...error.response,
                    data: {
                        message: "The server is waking up from sleep. Please refresh in a few moments.",
                    },
                },
            });
        }

        // 2. Handle 401 Unauthorized / Token Expiration
        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || "";
            const isProfileCheck = requestUrl.includes("/auth/me");

            // Clean up stale/expired token
            localStorage.removeItem("token");

            const currentPath = window.location.pathname;
            const isPublicPage =
                ["/", "/shop", "/login", "/register", "/about", "/contact"].includes(currentPath) ||
                currentPath.startsWith("/product/");

            // Only redirect to login if user is on a protected route or action (not on initial guest visit)
            if (!isProfileCheck && !isPublicPage && currentPath !== "/login" && currentPath !== "/register") {
                console.warn("[Bazario Auth] Session expired. Redirecting to login...");
                window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
