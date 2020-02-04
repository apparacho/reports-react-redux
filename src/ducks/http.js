import axios from "axios/index"

const baseUrl = process.env.REACT_APP_BASE_URL;

export function setHttpRequestsDefault() {
    axios.defaults.baseURL = baseUrl;
    axios.defaults.headers.post['Accept'] = 'application/json'
    axios.defaults.headers.post['Content-Type'] = 'application/json'
}
