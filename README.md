# HTTP Codes Educational App

An educational application to learn HTTP status codes with two main features:
- HTTP code list with detailed information and illustrations
- URL testing tool to experiment with HTTP requests

## Project Structure

```
.
├── backend/           # Go backend code
│   ├── http_code_info/    # Lambda for HTTP code information
│   └── http_execute_call/ # Lambda for executing HTTP calls
├── frontend/          # React frontend code
├── opentofu/          # OpenTofu infrastructure code
└── Makefile           # Build and deployment scripts
```

## Features

### HTTP Code List
- Browse all HTTP status codes
- View detailed information from MDN Web Docs
- See illustrations from http.cat

### Try a URL
- Configure and execute HTTP requests
- Set method, headers, query parameters, and body
- View response status, headers, and body

## Technology Stack

- **Frontend**: React v19.1 with Cloudscape UI components
- **Backend**: Go v1.24.1
- **Infrastructure**: AWS (Lambda, API Gateway, S3, CloudFront)
- **IaC**: OpenTofu

## AWS Region

This application is deployed in the `eu-west-1` region.

## Development

### Prerequisites
- Go v1.24.1
- Node.js and npm
- OpenTofu
- AWS CLI configured for eu-west-1

### Building and Deploying
Use the Makefile for building and deploying:

```bash
# Build everything
make build

# Deploy everything
make deploy

# Build specific components
make build-frontend
make build-lambda-http-code-info
make build-lambda-http-execute-call

# Deploy specific components
make deploy-frontend
make deploy-lambda-http-code-info
make deploy-lambda-http-execute-call
```
