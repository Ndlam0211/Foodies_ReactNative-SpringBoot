// apiService.js
import { MMKV } from "react-native-mmkv";
import axiosInstance from "./apiConfig";

const storage = new MMKV();

export const getToken = () => storage.getString("token");
export const setAccessToken = (token:string) => storage.set("token", token);
export const getUserId = () => storage.getNumber("userId");
export const setUserId = (userId: number) => storage.set("userId", userId);
export const clearToken = () => storage.delete("token");
export const clearUserId = () => storage.delete("userId");
export const clearStorage = () => storage.clearAll();
// Function to call API
function callApi(endpoint: any, method = "GET", body?: any, params?: string | string[][] | Record<string, string> | URLSearchParams | undefined) {
  const token = getToken();
  const queryString = new URLSearchParams(params).toString();
  let url;
  if (queryString) {
    url = `${endpoint}?${queryString}`;
  }else {
    url = endpoint;
  }

  const config = {
    method,
    url,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    data: body ? JSON.stringify(body) : null,
  };

  console.log("callApi url: ", url);

  return axiosInstance(config)
    .then((response) => response.data)
    .catch((error) => {
      console.log("API call error:", error.response?.message);
      throw error;
    });
}



// Xử lý refresh token tự động khi accessToken hết hạn
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const refreshToken = getRefreshToken();
//         const { data } = await axios.post(
//           "http://10.18.0.210:8080/api/auth/refresh",
//           {
//             refreshToken,
//           }
//         );

//         await setTokens(data.accessToken, data.refreshToken);
//         api.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
//         processQueue(null, data.accessToken);

//         return api(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export const authService = {
//   login: async (email: string, password: string) => {
//     await api
//       .post("login", { email, password })
//       .then((response: { data: any; }) => response.data)
//       .catch((error: { response: { data: any; }; }) => {
//         throw error.response.data;
//       });
//   },

//   login2: async ({ email, password }: any) => {
//     api.post("login", {email, password})
//     .then((response: { data: { token: any; }; }) => {
//         const token = response.data.token;
//         if (token) {
//             storage.set("accessToken", token);
//             resetAndNavigate("UserBottomTab");
//         } else {
//             console.log("Token not found in response");
//         }
//     })
//     .catch(console.error);
//   },

//   signup: async ({ email, password }: any) => {
//     try {
//       const { data } = await api.post("signup", { email, password });
//       if (data) {
//         const token = data["token"];
//         if (token) {
//           await storage.set("accessToken", token);
//           resetAndNavigate("UserBottomTab");
//         } else {
//           console.log("Token not found in response");
//         }
//       } else {
//         console.log("Signup response is missing data");
//       }
//     } catch (error) {
//       console.log("Signup failed: ", error);
//     }
//   },

//   logout: async () => {
//     await storage.delete("accessToken");
//   },
// };

// CRUD tổng quát
export const crudService = {
  getAll: ({ resource, params } : any) => callApi(resource, "GET", null, params),
  get: (resource : any) => callApi(resource, "GET"),
  getById:  ({ resource, id } : any) => callApi(`${resource}/${id}`, "GET"),
  create: ( resource : string, payload : any) => callApi(resource, "POST", payload),
  update: (resource : string, payload : any) => callApi(resource, "PUT", payload),
  remove: (resource : string) => callApi(resource, "DELETE"),
  removeById: ({ resource, id } : any) => callApi(`${resource}/${id}`, "DELETE"),
  delete: (resource : string, payload : any) => callApi(resource, "DELETE", payload),
};
