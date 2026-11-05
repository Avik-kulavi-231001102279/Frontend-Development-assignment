import { useState, useEffect, useCallback } from 'react';
import { blogService } from '../services/api';

export function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsOffline(false);
    try {
      const data = await blogService.getAllBlogs();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setIsOffline(true);
        setError('Cannot connect to JSON Server at http://localhost:3000. Please start it using "npm run server".');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch blogs');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const removeBlog = useCallback(async (id) => {
    try {
      await blogService.deleteBlog(id);
      setBlogs(prev => prev.filter(b => String(b.id) !== String(id)));
      return true;
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    blogs,
    setBlogs,
    loading,
    error,
    isOffline,
    fetchBlogs,
    removeBlog
  };
}

