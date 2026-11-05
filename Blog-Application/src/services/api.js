import axios from 'axios';

// Base API client pointing to JSON Server
const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 8000
});

// Reusable API service functions for Blogs
export const blogService = {
  // GET /blogs - Fetch all blogs (optionally with params for sorting/filtering)
  async getAllBlogs() {
    try {
      const response = await apiClient.get('/blogs');
      return response.data;
    } catch (error) {
      handleApiError(error, 'fetching blogs');
      throw error;
    }
  },

  // GET /blogs/:id - Fetch single blog by ID
  async getBlogById(id) {
    try {
      const response = await apiClient.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `fetching blog #${id}`);
      throw error;
    }
  },

  // POST /blogs - Create new blog
  async createBlog(blogData) {
    try {
      const response = await apiClient.post('/blogs', blogData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'creating blog');
      throw error;
    }
  },

  // PUT /blogs/:id - Update existing blog
  async updateBlog(id, blogData) {
    try {
      const response = await apiClient.put(`/blogs/${id}`, blogData);
      return response.data;
    } catch (error) {
      handleApiError(error, `updating blog #${id}`);
      throw error;
    }
  },

  // DELETE /blogs/:id - Delete a blog
  async deleteBlog(id) {
    try {
      const response = await apiClient.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `deleting blog #${id}`);
      throw error;
    }
  }
};

// Formats user-friendly error messages
function handleApiError(error, operation) {
  if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
    console.error(`[API Network Error] JSON Server appears to be offline on ${API_BASE_URL}. Ensure 'npm run server' is running.`);
  } else {
    console.error(`[API Error] Failed during ${operation}:`, error.response?.data || error.message);
  }
}

export default apiClient;

