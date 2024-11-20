import React from 'react';
import { exchangeData } from '../data/exchangeData';
import '../styles/Exchanges.css';

const ActiveExchanges = () => {
    return (
        <div className="exchanges-container">
            <h2>Active Exchanges</h2>
            <div className="exchanges-grid">
                {exchangeData.active.map(exchange => (
                    <div key={exchange.id} className="exchange-card">
                        <h3>{exchange.book}</h3>
                        <div className="exchange-details">
                            <p><strong>Requested By:</strong> {exchange.requestedBy}</p>
                            <p><strong>Requested From:</strong> {exchange.requestedFrom}</p>
                            <p><strong>Status:</strong> <span className={`status ${exchange.status}`}>{exchange.status}</span></p>
                            <p><strong>Request Date:</strong> {exchange.requestDate}</p>
                            <p><strong>Location:</strong> {exchange.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveExchanges; 