import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; 


export const fetchStocks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stocks`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stocks:', error.message);
        throw error;
    }
};


export const fetchStockDetails = async (ticker) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stocks/${ticker}`);
        
        return response.data;
    } catch (error) {
        console.error('Error fetching stock details:', error.message);
        throw error;
    }
};


export const fetchStockCorrelation = async (stock1, stock2) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stockcorrelation`, {
            params: { stock1, stock2 }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching stock correlation:', error.message);
        throw error;
    }
};