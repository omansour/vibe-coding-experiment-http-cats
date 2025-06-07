import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Box,
  Spinner,
  Alert
} from '@cloudscape-design/components';

function HttpCodeDetail({ config }) {
  const { httpCode } = useParams();
  const navigate = useNavigate();
  const [codeInfo, setCodeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCodeInfo = async () => {
      if (!config) {
        setError('Configuration not loaded');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${config.apiEndpoint}/http_code_info/${httpCode}`,
          {
            headers: {
              'x-api-key': config.apiKey
            }
          }
        );
        setCodeInfo(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching HTTP code info:', err);
        setError(`Failed to load information for HTTP code ${httpCode}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCodeInfo();
  }, [httpCode, config]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container
      header={
        <Header
          variant="h1"
          actions={
            <Button onClick={handleBack}>Back to list</Button>
          }
        >
          HTTP {httpCode}
        </Header>
      }
    >
      {loading ? (
        <Box textAlign="center" padding="l">
          <Spinner size="large" />
          <Box variant="p" padding={{ top: 's' }}>
            Loading HTTP code information...
          </Box>
        </Box>
      ) : error ? (
        <Alert type="error" header="Error">
          {error}
        </Alert>
      ) : (
        <SpaceBetween size="l">
          <Box textAlign="center">
            <img
              src={codeInfo.image}
              alt={`HTTP ${httpCode}`}
              style={{ maxWidth: '100%', height: 'auto', maxHeight: '400px' }}
            />
          </Box>
          
          <Box>
            <div dangerouslySetInnerHTML={{ __html: codeInfo.content }} />
          </Box>
        </SpaceBetween>
      )}
    </Container>
  );
}

export default HttpCodeDetail;
