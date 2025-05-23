import React, { useEffect, useState } from 'react';
import { fetchStocks, fetchStockDetails, fetchStockCorrelation } from './services/api';
import './App.css';

function App() {
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [correlation, setCorrelation] = useState(null);

    // Fetch all stocks on load
    useEffect(() => {
        const getStocks = async () => {
            try {
                const data = await fetchStocks();
                setStocks(data.stocks || []);
            } catch (error) {
                console.error('Failed to fetch stocks');
            }
        };
        getStocks();
    }, []);

    // Fetch stock details
    const handleStockClick = async (ticker) => {
        try {
            const data = await fetchStockDetails(ticker);
            console.log('Fetched Stock Details:', data); // Debugging: Log the fetched data
            setSelectedStock(data);
        } catch (error) {
            console.error('Failed to fetch stock details:', error.message);
        }
    };

    // Fetch stock correlation
    const handleCorrelation = async (stock1, stock2) => {
        try {
            const data = await fetchStockCorrelation(stock1, stock2);
            setCorrelation(data);
        } catch (error) {
            console.error('Failed to fetch stock correlation');
        }
    };

    return (
        <div className="App">
            <h1>Stock Aggregation Service</h1>

            {/* Stock List */}
            <h2>Available Stocks</h2>
            <ul>
                {Object.entries(stocks).map(([name, ticker]) => (
                    <li key={ticker} onClick={() => handleStockClick(ticker)}>
                        {name} ({ticker})
                    </li>
                ))}
            </ul>

            {/* Stock Details */}
            {selectedStock && (
                <div>
                    <h2>Stock Details</h2>
                    <pre>{JSON.stringify(selectedStock, null, 2)}</pre>
                </div>
            )}

            {/* Correlation */}
            <div>
                <h2>Stock Correlation</h2>
                <button onClick={() => handleCorrelation('NVDA', 'PYPL')}>
                    Get Correlation (NVDA & PYPL)
                </button>
                {correlation && (
                    <pre>{JSON.stringify(correlation, null, 2)}</pre>
                )}
            </div>
        </div>
    );
}

export default App;