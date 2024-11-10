import axios from "axios";

const API_KEY = import.meta.env.REACT_APP_GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1';

export async function getLivros(query:string) {
  try {
    const response = await api.get('/volumes', {
      params: {
        q: query,
        maxResults: 40
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar livros:", error);
    throw error;
  }
}
export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY
  }
});

