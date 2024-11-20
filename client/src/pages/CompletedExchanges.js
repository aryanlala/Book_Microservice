import React from 'react';
import { exchangeData } from '../data/exchangeData';
import '../styles/Exchanges.css';

const CompletedExchanges = () => {
    return (
        <div className="exchanges-container">
            <h2>Completed Exchanges</h2>
            <div className="exchanges-grid">
                {exchangeData.completed.map(exchange => (
                    <div key={exchange.id} className="exchange-card">
                        <h3>{exchange.book}</h3>
                        <div className="exchange-details">
                            <p><strong>Requested By:</strong> {exchange.requestedBy}</p>
                            <p><strong>Requested From:</strong> {exchange.requestedFrom}</p>
                            <p><strong>Status:</strong> <span className={`status ${exchange.status}`}>{exchange.status}</span></p>
                            <p><strong>Exchange Date:</strong> {exchange.exchangeDate}</p>
                            <p><strong>Return Date:</strong> {exchange.returnDate}</p>
                            <p><strong>Location:</strong> {exchange.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompletedExchanges; 