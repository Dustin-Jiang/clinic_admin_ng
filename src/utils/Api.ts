import axios from "axios";

const Api = axios.create({
  withCredentials: true
});

export default Api;