import { Investor } from '../types';
import { INITIAL_INVESTORS } from '../constants';

const API_BASE_URL = 'http://localhost:3001/api';

export const pipelineApi = {
  /**
   * Fetch all investors from backend.
   */
  fetchInvestors: async (): Promise<Investor[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/investors`);
      if (!response.ok) {
        throw new Error('Failed to fetch from backend');
      }
      return await response.json();
    } catch (error) {
      console.error("Backend connection failed:", error);
      // Fallback only if backend is down, to prevent app crashing completely
      // In a real scenario, you might want to show an error state instead
      console.warn("Falling back to initial data (Read-Only Mode). Ensure backend is running on port 3001.");
      return INITIAL_INVESTORS; 
    }
  },

  /**
   * Create or Update an investor via backend.
   */
  saveInvestor: async (investor: Investor): Promise<Investor[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/investors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investor),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save to backend');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to save investor", error);
      alert("Failed to save changes. Is the backend server running on localhost:3001?");
      throw error;
    }
  },

  /**
   * Delete an investor by ID via backend.
   */
  deleteInvestor: async (id: string): Promise<Investor[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/investors/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete from backend');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to delete investor", error);
      alert("Failed to delete. Is the backend server running on localhost:3001?");
      throw error;
    }
  }
};