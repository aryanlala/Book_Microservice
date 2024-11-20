import React, { useState, useEffect } from 'react';
import { Container, Tab, Tabs, Card, Badge, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ExchangeManagement.css';

const ExchangeManagement = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const response = await axios.get('/api/exchanges/my-exchanges');
      setExchanges(response.data);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (exchangeId, newStatus) => {
    try {
      await axios.put(`/api/exchanges/${exchangeId}/status`, { status: newStatus });
      fetchExchanges();
    } catch (error) {
      console.error('Error updating exchange status:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      await axios.post(`/api/exchanges/${selectedExchange._id}/messages`, {
        content: message
      });
      setMessage('');
      setShowMessageModal(false);
      fetchExchanges();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'warning',
      accepted: 'success',
      rejected: 'danger',
      completed: 'info',
      cancelled: 'secondary'
    };
    return <Badge bg={badges[status]}>{status}</Badge>;
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Exchanges</h2>
      
      <div className="exchange-navigation-buttons">
        <button 
          className="nav-button"
          onClick={() => navigate('/active-exchanges')}
        >
          View Active Exchanges
        </button>
        <button 
          className="nav-button"
          onClick={() => navigate('/completed-exchanges')}
        >
          View Completed Exchanges
        </button>
      </div>


      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMessageModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSendMessage}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ExchangeManagement; 