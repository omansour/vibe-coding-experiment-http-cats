package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// APICallParameters defines the structure for API call parameters
type APICallParameters struct {
	// Required fields
	Method   string `json:"method"`   // HTTP method (GET, POST, PUT, DELETE, etc.)
	Endpoint string `json:"endpoint"` // API endpoint URL or path

	// Optional fields
	Headers     map[string]string `json:"headers,omitempty"`     // HTTP headers
	QueryParams map[string]string `json:"queryParams,omitempty"` // URL query parameters
	Body        string            `json:"body,omitempty"`        // Request body (for POST, PUT, etc.)
	Timeout     int               `json:"timeout,omitempty"`     // Request timeout in seconds
}

// APICallResponse defines the structure for API call response
type APICallResponse struct {
	StatusCode int               `json:"statusCode"` // HTTP status code
	Headers    map[string]string `json:"headers"`    // Response headers
	Body       string            `json:"body"`       // Response body
}

// Handler is the lambda handler
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// CORS headers for all responses
	corsHeaders := map[string]string{
		"Content-Type":                     "application/json",
		"Access-Control-Allow-Origin":      "*",
		"Access-Control-Allow-Methods":     "GET,POST,PUT,DELETE,OPTIONS",
		"Access-Control-Allow-Headers":     "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,x-api-key",
		"Access-Control-Allow-Credentials": "false",
	}

	// Parse request body
	var params APICallParameters
	err := json.Unmarshal([]byte(request.Body), &params)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    corsHeaders,
			Body:       fmt.Sprintf("Error parsing request body: %v", err),
		}, nil
	}

	// Validate required parameters
	if params.Method == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    corsHeaders,
			Body:       "Method is required",
		}, nil
	}
	if params.Endpoint == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    corsHeaders,
			Body:       "Endpoint is required",
		}, nil
	}

	// Make API call
	response, err := makeAPICall(params)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    corsHeaders,
			Body:       fmt.Sprintf("Error making API call: %v", err),
		}, nil
	}

	// Convert response to JSON
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    corsHeaders,
			Body:       fmt.Sprintf("Error creating JSON response: %v", err),
		}, nil
	}

	// Return response
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    corsHeaders,
		Body:       string(jsonResponse),
	}, nil
}

// makeAPICall makes an API call with the given parameters
func makeAPICall(params APICallParameters) (APICallResponse, error) {
	// Parse endpoint URL
	parsedURL, err := url.Parse(params.Endpoint)
	if err != nil {
		return APICallResponse{}, fmt.Errorf("invalid endpoint URL: %v", err)
	}

	// Add query parameters
	if len(params.QueryParams) > 0 {
		query := parsedURL.Query()
		for key, value := range params.QueryParams {
			query.Add(key, value)
		}
		parsedURL.RawQuery = query.Encode()
	}

	// Create request
	var bodyReader io.Reader
	if params.Body != "" {
		bodyReader = bytes.NewBufferString(params.Body)
	}
	req, err := http.NewRequest(params.Method, parsedURL.String(), bodyReader)
	if err != nil {
		return APICallResponse{}, fmt.Errorf("error creating request: %v", err)
	}

	// Add headers
	for key, value := range params.Headers {
		req.Header.Add(key, value)
	}

	// Set default timeout if not provided
	timeout := 30
	if params.Timeout > 0 {
		timeout = params.Timeout
	}

	// Create HTTP client with timeout
	client := &http.Client{
		Timeout: time.Duration(timeout) * time.Second,
	}

	// Make request
	resp, err := client.Do(req)
	if err != nil {
		return APICallResponse{}, fmt.Errorf("error making request: %v", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return APICallResponse{}, fmt.Errorf("error reading response body: %v", err)
	}

	// Convert response headers
	headers := make(map[string]string)
	for key, values := range resp.Header {
		if len(values) > 0 {
			headers[key] = values[0]
		}
	}

	// Create response
	response := APICallResponse{
		StatusCode: resp.StatusCode,
		Headers:    headers,
		Body:       string(body),
	}

	return response, nil
}

func main() {
	lambda.Start(Handler)
}
