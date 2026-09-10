const BASE_URL = 'http://localhost:5000/api/searches';

export const getRecentSearches = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch recent searches');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    return []; // Return empty array on failure so it doesn't break the app
  }
};

export const saveSearch = async (city, country) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city, country }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save search');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving search:', error);
    // We don't want to break the UI if the backend fails to save
  }
};
