import axios from "axios";
const BASE_URL = "https://aqueous-headland-76339.herokuapp.com/api";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
