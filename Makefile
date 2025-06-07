.PHONY: help build build-frontend build-lambda-http-code-info build-lambda-http-execute-call deploy deploy-frontend deploy-lambda-http-code-info deploy-lambda-http-execute-call clean

# Build directories
BUILD_DIR := build
LAMBDA_BUILD_DIR := $(BUILD_DIR)/lambda
FRONTEND_BUILD_DIR := $(BUILD_DIR)/frontend

# Lambda directories
LAMBDA_HTTP_CODE_INFO_DIR := backend/http_code_info
LAMBDA_HTTP_EXECUTE_CALL_DIR := backend/http_execute_call

# Default target
.DEFAULT_GOAL := help

# Help target
help:
	@echo "HTTP Codes Educational App - Build and Deploy Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  help                         Show this help message"
	@echo "  build                        Build all components"
	@echo "  build-frontend               Build frontend only"
	@echo "  build-lambda-http-code-info  Build HTTP code info lambda only"
	@echo "  build-lambda-http-execute-call Build HTTP execute call lambda only"
	@echo "  deploy                       Deploy all components"
	@echo "  deploy-frontend              Deploy frontend only"
	@echo "  deploy-lambda-http-code-info Deploy HTTP code info lambda only"
	@echo "  deploy-lambda-http-execute-call Deploy HTTP execute call lambda only"
	@echo "  clean                        Clean build artifacts"

# Create build directories
create-dirs:
	mkdir -p $(LAMBDA_BUILD_DIR)
	mkdir -p $(FRONTEND_BUILD_DIR)

# Build targets
build: create-dirs build-frontend build-lambda-http-code-info build-lambda-http-execute-call

build-frontend: create-dirs
	@echo "Building frontend..."
	cd frontend && npm install && npm run build
	cp -r frontend/build/* $(FRONTEND_BUILD_DIR) || echo "No frontend build files to copy yet"
	@echo "Extracting API Gateway endpoint and key from OpenTofu outputs..."
	# Use mock output for development if real output doesn't exist
	if [ -f opentofu/mock-output.json ] && ! opentofu -chdir=opentofu output -json > /dev/null 2>&1; then \
		cp opentofu/mock-output.json $(FRONTEND_BUILD_DIR)/config.json; \
		echo "Using mock OpenTofu output for development"; \
	else \
		cd opentofu && opentofu output -json > ../$(FRONTEND_BUILD_DIR)/config.json || echo "Warning: OpenTofu output failed, config.json may be missing"; \
	fi

build-lambda-http-code-info: create-dirs
	@echo "Building HTTP code info lambda..."
	cd $(LAMBDA_HTTP_CODE_INFO_DIR) && GOPROXY=direct GOOS=linux GOARCH=amd64 go build -o $(CURDIR)/$(LAMBDA_BUILD_DIR)/http_code_info main.go
	cd $(LAMBDA_BUILD_DIR) && zip http_code_info.zip http_code_info

build-lambda-http-execute-call: create-dirs
	@echo "Building HTTP execute call lambda..."
	cd $(LAMBDA_HTTP_EXECUTE_CALL_DIR) && GOPROXY=direct GOOS=linux GOARCH=amd64 go build -o $(CURDIR)/$(LAMBDA_BUILD_DIR)/http_execute_call main.go
	cd $(LAMBDA_BUILD_DIR) && zip http_execute_call.zip http_execute_call

# Deploy targets
deploy: deploy-frontend deploy-lambda-http-code-info deploy-lambda-http-execute-call

deploy-frontend:
	@echo "Deploying frontend..."
	cd opentofu && opentofu apply -target=module.frontend -auto-approve

deploy-lambda-http-code-info:
	@echo "Deploying HTTP code info lambda..."
	cd opentofu && opentofu apply -target=module.lambda_http_code_info -auto-approve

deploy-lambda-http-execute-call:
	@echo "Deploying HTTP execute call lambda..."
	cd opentofu && opentofu apply -target=module.lambda_http_execute_call -auto-approve

# Clean target
clean:
	rm -rf $(BUILD_DIR)
	rm -rf frontend/node_modules frontend/build
	rm -rf backend/vendor
