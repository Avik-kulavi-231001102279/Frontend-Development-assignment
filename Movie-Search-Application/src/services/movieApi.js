import axios from 'axios';

const BASE_URL = 'https://www.omdbapi.com/';

// Read API key from environment variable (Never hardcoded in source)
const getApiKey = () => {
  return import.meta.env.VITE_OMDB_API_KEY || '';
};

// Create axios instance with timeout
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Search movies with query, pagination, and optional type/year filters
 * @param {Object} params
 * @param {string} params.query - Movie title search term (minimum 2 chars)
 * @param {number} [params.page=1] - Page number (1-based, 10 items/page)
 * @param {string} [params.type=''] - 'movie', 'series', 'episode', or '' for all
 * @param {string} [params.year=''] - 4-digit release year (e.g. '2024')
 * @param {AbortSignal} [params.signal] - AbortSignal for request cancellation
 */
export const searchMovies = async ({
  query,
  page = 1,
  type = '',
  year = '',
  signal,
}) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('OMDb API key is missing. Please add VITE_OMDB_API_KEY to your .env file.');
  }

  const trimmedQuery = query?.trim();
  if (!trimmedQuery || trimmedQuery.length < 2) {
    return {
      movies: [],
      totalResults: 0,
      totalPages: 0,
      page: 1,
    };
  }

  const requestParams = {
    apikey: apiKey,
    s: trimmedQuery,
    page: Math.max(1, Number(page) || 1),
  };

  if (type && type !== 'all') {
    requestParams.type = type.toLowerCase();
  }

  if (year && year.trim().length === 4) {
    requestParams.y = year.trim();
  }

  try {
    const response = await apiClient.get('', {
      params: requestParams,
      signal,
    });

    const data = response.data;

    if (data.Response === 'True') {
      const totalResults = parseInt(data.totalResults, 10) || 0;
      return {
        movies: data.Search || [],
        totalResults,
        totalPages: Math.ceil(totalResults / 10),
        page: Number(page),
      };
    } else {
      // Specific OMDb errors handled gracefully
      const errorMessage = data.Error || 'No movies found matching your query.';
      return {
        movies: [],
        totalResults: 0,
        totalPages: 0,
        page: Number(page),
        error: errorMessage,
      };
    }
  } catch (error) {
    if (axios.isCancel(error) || error.name === 'CanceledError') {
      // Intentionally canceled by new search request, rethrow so caller can distinguish
      throw error;
    }
    const message = error.response?.data?.Error || error.message || 'Failed to fetch movies. Please check your internet connection.';
    throw new Error(message);
  }
};

/**
 * Retrieve individual movie details by IMDb ID
 * @param {string} imdbId - e.g. 'tt0372784'
 * @param {string} [plot='full'] - 'short' or 'full'
 */
export const getMovieDetailsById = async (imdbId, plot = 'full') => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('OMDb API key is missing. Please add VITE_OMDB_API_KEY to your .env file.');
  }

  if (!imdbId) {
    throw new Error('Valid IMDb ID is required.');
  }

  try {
    const response = await apiClient.get('', {
      params: {
        apikey: apiKey,
        i: imdbId.trim(),
        plot,
      },
    });

    const data = response.data;

    if (data.Response === 'True') {
      return data;
    } else {
      throw new Error(data.Error || 'Movie details not found.');
    }
  } catch (error) {
    const message = error.response?.data?.Error || error.message || 'Failed to load movie details.';
    throw new Error(message);
  }
};

/**
 * Curated list of popular movies for Hero showcase and discovery section
 */
export const CURATED_FEATURED_IDS = [
  'tt1375666', // Inception
  'tt0816692', // Interstellar
  'tt0468569', // The Dark Knight
  'tt0111161', // The Shawshank Redemption
  'tt1160419', // Dune (2021)
  'tt0137523', // Fight Club
  'tt0109830', // Forrest Gump
  'tt0133093', // The Matrix
];

/**
 * Fetch a list of curated movies by their IMDb IDs
 */
export const getCuratedMovies = async () => {
  try {
    const promises = CURATED_FEATURED_IDS.map((id) =>
      getMovieDetailsById(id, 'short').catch(() => null)
    );
    const results = await Promise.all(promises);
    return results.filter(Boolean);
  } catch (error) {
    console.error('Error fetching curated movies:', error);
    return [];
  }
};

