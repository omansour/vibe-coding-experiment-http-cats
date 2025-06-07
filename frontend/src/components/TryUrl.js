import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Header,
  FormField,
  Input,
  Select,
  Button,
  SpaceBetween,
  Tabs,
  Table,
  Box,
  CodeEditor,
  Alert,
  Spinner,
  ColumnLayout,
  TextContent
} from '@cloudscape-design/components';

function TryUrl({ config }) {
  const [method, setMethod] = useState({ value: 'GET' });
  const [endpoint, setEndpoint] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [queryParams, setQueryParams] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [timeout, setTimeout] = useState('30');
  
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const methodOptions = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'HEAD', label: 'HEAD' },
    { value: 'OPTIONS', label: 'OPTIONS' }
  ];

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleRemoveHeader = (index) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const handleAddQueryParam = () => {
    setQueryParams([...queryParams, { key: '', value: '' }]);
  };

  const handleQueryParamChange = (index, field, value) => {
    const newQueryParams = [...queryParams];
    newQueryParams[index][field] = value;
    setQueryParams(newQueryParams);
  };

  const handleRemoveQueryParam = (index) => {
    const newQueryParams = [...queryParams];
    newQueryParams.splice(index, 1);
    setQueryParams(newQueryParams);
  };

  const handleSubmit = async () => {
    if (!endpoint) {
      setError('Endpoint URL is required');
      return;
    }

    if (!config) {
      setError('Configuration not loaded');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      // Prepare headers
      const headersObj = {};
      headers.forEach(header => {
        if (header.key && header.value) {
          headersObj[header.key] = header.value;
        }
      });

      // Prepare query parameters
      const queryParamsObj = {};
      queryParams.forEach(param => {
        if (param.key && param.value) {
          queryParamsObj[param.key] = param.value;
        }
      });

      // Prepare request payload
      const payload = {
        method: method.value,
        endpoint: endpoint,
        headers: Object.keys(headersObj).length > 0 ? headersObj : undefined,
        queryParams: Object.keys(queryParamsObj).length > 0 ? queryParamsObj : undefined,
        body: body || undefined,
        timeout: timeout ? parseInt(timeout, 10) : undefined
      };

      // Make API call
      const apiResponse = await axios.post(
        `${config.apiEndpoint}/http_execute_call`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey
          }
        }
      );

      setResponse(apiResponse.data);
    } catch (err) {
      console.error('Error executing HTTP call:', err);
      setError(`Failed to execute HTTP call: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      header={
        <Header variant="h1">Try a URL</Header>
      }
    >
      <SpaceBetween size="l">
        <ColumnLayout columns={2}>
          <FormField label="Method">
            <Select
              selectedOption={method}
              onChange={({ detail }) => setMethod(detail.selectedOption)}
              options={methodOptions}
            />
          </FormField>
          
          <FormField label="Timeout (seconds)">
            <Input
              value={timeout}
              onChange={({ detail }) => setTimeout(detail.value)}
              type="number"
            />
          </FormField>
        </ColumnLayout>

        <FormField label="Endpoint URL" errorText={!endpoint && error ? 'Endpoint URL is required' : null}>
          <Input
            value={endpoint}
            onChange={({ detail }) => setEndpoint(detail.value)}
            placeholder="https://example.com/api"
          />
        </FormField>

        <Tabs
          tabs={[
            {
              id: 'headers',
              label: 'Headers',
              content: (
                <SpaceBetween size="s">
                  <Table
                    items={headers}
                    columnDefinitions={[
                      {
                        id: 'key',
                        header: 'Key',
                        cell: (item, index) => (
                          <Input
                            value={item.key}
                            onChange={({ detail }) => handleHeaderChange(index, 'key', detail.value)}
                          />
                        )
                      },
                      {
                        id: 'value',
                        header: 'Value',
                        cell: (item, index) => (
                          <Input
                            value={item.value}
                            onChange={({ detail }) => handleHeaderChange(index, 'value', detail.value)}
                          />
                        )
                      },
                      {
                        id: 'actions',
                        header: 'Actions',
                        cell: (_, index) => (
                          <Button onClick={() => handleRemoveHeader(index)}>Remove</Button>
                        )
                      }
                    ]}
                  />
                  <Box textAlign="right">
                    <Button onClick={handleAddHeader}>Add Header</Button>
                  </Box>
                </SpaceBetween>
              )
            },
            {
              id: 'queryParams',
              label: 'Query Parameters',
              content: (
                <SpaceBetween size="s">
                  <Table
                    items={queryParams}
                    columnDefinitions={[
                      {
                        id: 'key',
                        header: 'Key',
                        cell: (item, index) => (
                          <Input
                            value={item.key}
                            onChange={({ detail }) => handleQueryParamChange(index, 'key', detail.value)}
                          />
                        )
                      },
                      {
                        id: 'value',
                        header: 'Value',
                        cell: (item, index) => (
                          <Input
                            value={item.value}
                            onChange={({ detail }) => handleQueryParamChange(index, 'value', detail.value)}
                          />
                        )
                      },
                      {
                        id: 'actions',
                        header: 'Actions',
                        cell: (_, index) => (
                          <Button onClick={() => handleRemoveQueryParam(index)}>Remove</Button>
                        )
                      }
                    ]}
                  />
                  <Box textAlign="right">
                    <Button onClick={handleAddQueryParam}>Add Query Parameter</Button>
                  </Box>
                </SpaceBetween>
              )
            },
            {
              id: 'body',
              label: 'Body',
              content: (
                <CodeEditor
                  language="json"
                  value={body}
                  onChange={({ detail }) => setBody(detail.value)}
                  preferences={{ theme: 'light' }}
                  height="300px"
                />
              )
            }
          ]}
        />

        <Box textAlign="right">
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Execute Request
          </Button>
        </Box>

        {error && (
          <Alert type="error" header="Error">
            {error}
          </Alert>
        )}

        {loading && (
          <Box textAlign="center" padding="l">
            <Spinner size="large" />
            <Box variant="p" padding={{ top: 's' }}>
              Executing request...
            </Box>
          </Box>
        )}

        {response && (
          <Container
            header={
              <Header variant="h2">
                Response
              </Header>
            }
          >
            <SpaceBetween size="l">
              <TextContent>
                <h3>Status: {response.statusCode}</h3>
              </TextContent>

              <Tabs
                tabs={[
                  {
                    id: 'responseHeaders',
                    label: 'Headers',
                    content: (
                      <Table
                        items={Object.entries(response.headers).map(([key, value]) => ({ key, value }))}
                        columnDefinitions={[
                          {
                            id: 'key',
                            header: 'Key',
                            cell: item => item.key
                          },
                          {
                            id: 'value',
                            header: 'Value',
                            cell: item => item.value
                          }
                        ]}
                      />
                    )
                  },
                  {
                    id: 'responseBody',
                    label: 'Body',
                    content: (
                      <Box>
                        <pre style={{ 
                          whiteSpace: 'pre-wrap', 
                          wordWrap: 'break-word',
                          backgroundColor: '#f5f5f5',
                          padding: '16px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontFamily: 'monospace',
                          maxHeight: '400px',
                          overflow: 'auto'
                        }}>
                          {response.body || '(Empty response body)'}
                        </pre>
                      </Box>
                    )
                  }
                ]}
              />
            </SpaceBetween>
          </Container>
        )}
      </SpaceBetween>
    </Container>
  );
}

export default TryUrl;
