import axios from "axios";

// "http://waysbucks-by-faequl.up.railway.app/api/v1"
// "http://localhost:5000/api/v1"

export const API = axios.create({
   baseURL: "process.env.REACT_APP_BASEURL",
});

export const setAuthToken = (token) => {
   if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
   } else {
      delete API.defaults.headers.commin["Authorization"];
   }
};