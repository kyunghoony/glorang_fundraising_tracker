import { Investor } from '../types';
import { INITIAL_INVESTORS } from '../constants';

const DB_KEY = 'glorang_fundraising_db_v1';

// Simulate network delay to mimic real server interaction
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const pipelineApi = {
  /**
   * Fetch all investors.
   * If no data exists, seeds the DB with INITIAL_INVESTORS.
   */
  fetchInvestors: async (): Promise<Investor[]> => {
    await delay(500); // Simulate network latency
    
    try {
      const storedData = localStorage.getItem(DB_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
      
      // Initialize DB with seed data
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_INVESTORS));
      return INITIAL_INVESTORS;
    } catch (error) {
      console.error("Failed to fetch data", error);
      return INITIAL_INVESTORS;
    }
  },

  /**
   * Create or Update an investor.
   */
  saveInvestor: async (investor: Investor): Promise<Investor[]> => {
    await delay(300); // Simulate saving delay
    
    const storedData = localStorage.getItem(DB_KEY);
    const currentList: Investor[] = storedData ? JSON.parse(storedData) : INITIAL_INVESTORS;
    
    const index = currentList.findIndex(i => i.id === investor.id);
    let newList;
    
    if (index >= 0) {
      // Update existing
      newList = currentList.map(i => i.id === investor.id ? investor : i);
    } else {
      // Create new
      newList = [...currentList, investor];
    }
    
    localStorage.setItem(DB_KEY, JSON.stringify(newList));
    return newList;
  },

  /**
   * Delete an investor by ID.
   */
  deleteInvestor: async (id: string): Promise<Investor[]> => {
    await delay(300); // Simulate network delay
    
    const storedData = localStorage.getItem(DB_KEY);
    const currentList: Investor[] = storedData ? JSON.parse(storedData) : INITIAL_INVESTORS;
    
    const newList = currentList.filter(i => i.id !== id);
    
    localStorage.setItem(DB_KEY, JSON.stringify(newList));
    return newList;
  }
};
