import axios from 'axios';

const url = 'https://api-dev.knights.app';

export const api = axios.create({
  baseURL: url,
});
