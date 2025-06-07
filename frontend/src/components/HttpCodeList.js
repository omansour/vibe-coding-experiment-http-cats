import React, { useState } from 'react';
import axios from 'axios';
import {
  Cards,
  Box,
  SpaceBetween,
  TextFilter,
  Header,
  Container,
  Button,
  Modal,
  Spinner,
  Alert,
  Link
} from '@cloudscape-design/components';

// HTTP status codes grouped by category
const httpCodes = [
  // 1xx - Informational
  { code: '100', name: 'Continue', category: 'Informational' },
  { code: '101', name: 'Switching Protocols', category: 'Informational' },
  { code: '102', name: 'Processing', category: 'Informational' },
  { code: '103', name: 'Early Hints', category: 'Informational' },
  
  // 2xx - Success
  { code: '200', name: 'OK', category: 'Success' },
  { code: '201', name: 'Created', category: 'Success' },
  { code: '202', name: 'Accepted', category: 'Success' },
  { code: '203', name: 'Non-Authoritative Information', category: 'Success' },
  { code: '204', name: 'No Content', category: 'Success' },
  { code: '205', name: 'Reset Content', category: 'Success' },
  { code: '206', name: 'Partial Content', category: 'Success' },
  { code: '207', name: 'Multi-Status', category: 'Success' },
  { code: '208', name: 'Already Reported', category: 'Success' },
  { code: '226', name: 'IM Used', category: 'Success' },
  
  // 3xx - Redirection
  { code: '300', name: 'Multiple Choices', category: 'Redirection' },
  { code: '301', name: 'Moved Permanently', category: 'Redirection' },
  { code: '302', name: 'Found', category: 'Redirection' },
  { code: '303', name: 'See Other', category: 'Redirection' },
  { code: '304', name: 'Not Modified', category: 'Redirection' },
  { code: '305', name: 'Use Proxy', category: 'Redirection' },
  { code: '307', name: 'Temporary Redirect', category: 'Redirection' },
  { code: '308', name: 'Permanent Redirect', category: 'Redirection' },
  
  // 4xx - Client Error
  { code: '400', name: 'Bad Request', category: 'Client Error' },
  { code: '401', name: 'Unauthorized', category: 'Client Error' },
  { code: '402', name: 'Payment Required', category: 'Client Error' },
  { code: '403', name: 'Forbidden', category: 'Client Error' },
  { code: '404', name: 'Not Found', category: 'Client Error' },
  { code: '405', name: 'Method Not Allowed', category: 'Client Error' },
  { code: '406', name: 'Not Acceptable', category: 'Client Error' },
  { code: '407', name: 'Proxy Authentication Required', category: 'Client Error' },
  { code: '408', name: 'Request Timeout', category: 'Client Error' },
  { code: '409', name: 'Conflict', category: 'Client Error' },
  { code: '410', name: 'Gone', category: 'Client Error' },
  { code: '411', name: 'Length Required', category: 'Client Error' },
  { code: '412', name: 'Precondition Failed', category: 'Client Error' },
  { code: '413', name: 'Payload Too Large', category: 'Client Error' },
  { code: '414', name: 'URI Too Long', category: 'Client Error' },
  { code: '415', name: 'Unsupported Media Type', category: 'Client Error' },
  { code: '416', name: 'Range Not Satisfiable', category: 'Client Error' },
  { code: '417', name: 'Expectation Failed', category: 'Client Error' },
  { code: '418', name: 'I\'m a teapot', category: 'Client Error' },
  { code: '421', name: 'Misdirected Request', category: 'Client Error' },
  { code: '422', name: 'Unprocessable Entity', category: 'Client Error' },
  { code: '423', name: 'Locked', category: 'Client Error' },
  { code: '424', name: 'Failed Dependency', category: 'Client Error' },
  { code: '425', name: 'Too Early', category: 'Client Error' },
  { code: '426', name: 'Upgrade Required', category: 'Client Error' },
  { code: '428', name: 'Precondition Required', category: 'Client Error' },
  { code: '429', name: 'Too Many Requests', category: 'Client Error' },
  { code: '431', name: 'Request Header Fields Too Large', category: 'Client Error' },
  { code: '451', name: 'Unavailable For Legal Reasons', category: 'Client Error' },
  
  // 5xx - Server Error
  { code: '500', name: 'Internal Server Error', category: 'Server Error' },
  { code: '501', name: 'Not Implemented', category: 'Server Error' },
  { code: '502', name: 'Bad Gateway', category: 'Server Error' },
  { code: '503', name: 'Service Unavailable', category: 'Server Error' },
  { code: '504', name: 'Gateway Timeout', category: 'Server Error' },
  { code: '505', name: 'HTTP Version Not Supported', category: 'Server Error' },
  { code: '506', name: 'Variant Also Negotiates', category: 'Server Error' },
  { code: '507', name: 'Insufficient Storage', category: 'Server Error' },
  { code: '508', name: 'Loop Detected', category: 'Server Error' },
  { code: '510', name: 'Not Extended', category: 'Server Error' },
  { code: '511', name: 'Network Authentication Required', category: 'Server Error' }
];

function HttpCodeList({ config }) {
  const [filterText, setFilterText] = useState('');
  const [selectedCode, setSelectedCode] = useState(null);
  const [codeInfo, setCodeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredItems = httpCodes.filter(
    item => 
      item.code.includes(filterText) || 
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.category.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleInfoClick = async (code) => {
    if (!config) {
      setError('Configuration not loaded');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSelectedCode(code);

      const response = await axios.get(
        `${config.apiEndpoint}/http_code_info/${code}`,
        {
          headers: {
            'x-api-key': config.apiKey
          }
        }
      );

      setCodeInfo(response.data);
    } catch (err) {
      console.error('Error fetching HTTP code info:', err);
      setError(`Failed to fetch information for HTTP ${code}: ${err.message}`);
      setCodeInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const closeSidebar = () => {
    setSelectedCode(null);
    setCodeInfo(null);
    setError(null);
  };

  return (
    <SpaceBetween size="l">
      <TextFilter
        filteringText={filterText}
        filteringPlaceholder="Find HTTP code"
        filteringAriaLabel="Filter HTTP codes"
        onChange={({ detail }) => setFilterText(detail.filteringText)}
      />
      
      {['Informational', 'Success', 'Redirection', 'Client Error', 'Server Error'].map(category => {
        const categoryItems = filteredItems.filter(item => item.category === category);
        
        if (categoryItems.length === 0) {
          return null;
        }
        
        return (
          <Container 
            key={category}
            header={
              <Header variant="h2">
                {category} ({categoryItems.length})
              </Header>
            }
          >
            <Cards
              items={categoryItems}
              cardDefinition={{
                header: item => (
                  <div 
                    onClick={() => handleInfoClick(item.code)} 
                    style={{ cursor: 'pointer', padding: '8px' }}
                  >
                    {`${item.code} ${item.name}`}
                  </div>
                ),
                sections: [
                  {
                    id: 'image',
                    content: item => (
                      <div 
                        onClick={() => handleInfoClick(item.code)} 
                        style={{ cursor: 'pointer', textAlign: 'center' }}
                      >
                        <img 
                          src={`https://http.cat/images/${item.code}.jpg`} 
                          alt={`HTTP ${item.code}`}
                          style={{ maxWidth: '100%', height: 'auto', maxHeight: '150px' }}
                        />
                      </div>
                    )
                  }
                ]
              }}
              cardsPerRow={[
                { cards: 1 },
                { minWidth: 500, cards: 2 },
                { minWidth: 992, cards: 3 }
              ]}
              trackBy="code"
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No HTTP codes found</b>
                  <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                    No HTTP codes match the filter criteria.
                  </Box>
                </Box>
              }
            />
          </Container>
        );
      })}

      {/* Modal for HTTP Code Details */}
      <Modal
        onDismiss={closeSidebar}
        visible={!!selectedCode}
        header={`HTTP ${selectedCode} Details`}
        size="large"
      >
        <SpaceBetween size="m">
          {loading && (
            <Box textAlign="center">
              <Spinner size="large" />
              <Box variant="p" padding={{ top: 's' }}>
                Loading HTTP code information...
              </Box>
            </Box>
          )}

          {error && (
            <Alert type="error" header="Error">
              {error}
            </Alert>
          )}

          {codeInfo && (
            <SpaceBetween size="l">
              <Box>
                <Box variant="h3">HTTP {selectedCode}</Box>
                <Box variant="p">
                  {httpCodes.find(code => code.code === selectedCode)?.name}
                </Box>
              </Box>

              <Box textAlign="center">
                <img 
                  src={codeInfo.image} 
                  alt={`HTTP ${selectedCode}`}
                  style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }}
                />
              </Box>

              {codeInfo.description && (
                <Box>
                  <Box variant="h4">Description</Box>
                  <Box variant="p">
                    {codeInfo.description}
                  </Box>
                </Box>
              )}

              {codeInfo.category && (
                <Box>
                  <Box variant="h4">Category</Box>
                  <Box variant="p">
                    {codeInfo.category}
                  </Box>
                </Box>
              )}

              <Box>
                <Box variant="h4">Learn More</Box>
                <Box variant="p">
                  <Link 
                    href={codeInfo.mdnLink || `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${selectedCode}`}
                    external
                  >
                    View on MDN Web Docs
                  </Link>
                </Box>
              </Box>
            </SpaceBetween>
          )}
        </SpaceBetween>
      </Modal>
    </SpaceBetween>
  );
}

export default HttpCodeList;
