import apiClient from "./apiService";

const API_URL = "/api/users"; // Base URL for user-related API endpoints

export default {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await apiClient.get(API_URL);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
      throw error;
    }
  },

  // Block a user (Admin Only)
  blockUser: async (id) => {
    try {
      const response = await apiClient.put(`${API_URL}/block/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error blocking user with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Unblock a user (Admin Only)
  unblockUser: async (id) => {
    try {
      const response = await apiClient.put(`${API_URL}/unblock/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error unblocking user with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Get a single user by ID
  getUserById: async (id) => {
    try {
      const response = await apiClient.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a user by ID (Admin Only)
  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
};
