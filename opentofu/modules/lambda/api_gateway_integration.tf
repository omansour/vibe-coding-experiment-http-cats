# API Gateway resource
resource "aws_api_gateway_resource" "resource" {
  rest_api_id = var.api_gateway_id
  parent_id   = var.api_gateway_root_resource_id
  path_part   = split("/", var.resource_path)[0]
}

# If the resource path has a parameter, create a child resource
resource "aws_api_gateway_resource" "parameter_resource" {
  count       = contains(split("/", var.resource_path), "{http_code}") ? 1 : 0
  rest_api_id = var.api_gateway_id
  parent_id   = aws_api_gateway_resource.resource.id
  path_part   = "{http_code}"
}

# Method for the resource
resource "aws_api_gateway_method" "method" {
  rest_api_id   = var.api_gateway_id
  resource_id   = contains(split("/", var.resource_path), "{http_code}") ? aws_api_gateway_resource.parameter_resource[0].id : aws_api_gateway_resource.resource.id
  http_method   = var.http_method
  authorization = "NONE"
  api_key_required = true
}

# OPTIONS method for CORS
resource "aws_api_gateway_method" "options_method" {
  rest_api_id   = var.api_gateway_id
  resource_id   = contains(split("/", var.resource_path), "{http_code}") ? aws_api_gateway_resource.parameter_resource[0].id : aws_api_gateway_resource.resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
  api_key_required = false
}

# Integration with Lambda
resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = var.api_gateway_id
  resource_id             = aws_api_gateway_method.method.resource_id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda.invoke_arn
}

# OPTIONS integration for CORS
resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id = var.api_gateway_id
  resource_id = aws_api_gateway_method.options_method.resource_id
  http_method = aws_api_gateway_method.options_method.http_method
  type        = "MOCK"
  
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

# OPTIONS method response
resource "aws_api_gateway_method_response" "options_response" {
  rest_api_id = var.api_gateway_id
  resource_id = aws_api_gateway_method.options_method.resource_id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = "200"
  
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# OPTIONS integration response
resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id = var.api_gateway_id
  resource_id = aws_api_gateway_method.options_method.resource_id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = aws_api_gateway_method_response.options_response.status_code
  
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,x-api-key'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*/${var.http_method}/${var.resource_path}"
}
