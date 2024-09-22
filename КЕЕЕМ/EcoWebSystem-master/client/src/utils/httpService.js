import axios from 'axios';

async function post(url, body) {
  return axios.post(url, body);
}

async function get(url) {
  return axios.get(url);
}

async function put(url, body) {
  return axios.put(url, body);
}

async function deleteRequest(url, body) {
  return axios.delete(url);
}

export { post, get, put, deleteRequest };
