import { Investor } from '../types';
import { INITIAL_INVESTORS } from '../constants';

const API_BASE_URL = 'http://localhost:3001/api';
const LOCAL_STORAGE_KEY = 'glorang_investors';

// Helper: Get data from LocalStorage or default to constants
const getLocalData = (): Investor[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_INVESTORS;
  } catch (e) {
    console.error("LocalStorage error:", e);
    return INITIAL_INVESTORS;
  }
};

// Helper: Save data to LocalStorage
const setLocalData = (data: Investor[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("LocalStorage write error:", e);
  }
};

export const pipelineApi = {
  /**
   * Fetch all investors.
   * Tries Backend first. If fails, falls back to LocalStorage.
   */
  fetchInvestors: async (): Promise<Investor[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/investors`);
      if (!response.ok) {
        throw new Error('Backend response not ok');
      }
      const data = await response.json();
      
      // Sync backend data to local storage for future offline use
      setLocalData(data);
      
      return data;
    } catch (error) {
      console.warn("Backend unreachable. Switching to LocalStorage mode.", error);
      return getLocalData();
    }
  },

  /**
   * Create or Update an investor.
   * Tries Backend first. If fails, updates LocalStorage.
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
        throw new Error('Backend response not ok');
      }
      
      const newData = await response.json();
      setLocalData(newData);
      return newData;
    } catch (error) {
      console.warn("Backend unreachable. Saving to LocalStorage.", error);
      
      // LocalStorage Fallback Logic
      const currentData = getLocalData();
      const index = currentData.findIndex(i => i.id === investor.id);
      
      let newData;
      if (index >= 0) {
        // Update existing
        newData = currentData.map(i => i.id === investor.id ? investor : i);
      } else {
        // Create new
        newData = [...currentData, investor];
      }
      
      setLocalData(newData);
      return newData;
    }
  },

  /**
   * Delete an investor by ID.
   * Tries Backend first. If fails, updates LocalStorage.
   */
  deleteInvestor: async (id: string): Promise<Investor[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/investors/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Backend response not ok');
      }
      
      const newData = await response.json();
      setLocalData(newData);
      return newData;
    } catch (error) {
      console.warn("Backend unreachable. Deleting from LocalStorage.", error);
      
      // LocalStorage Fallback Logic
      const currentData = getLocalData();
      const newData = currentData.filter(i => i.id !== id);
      
      setLocalData(newData);
      return newData;
    }
  }
};