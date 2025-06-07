variable "function_name" {
  description = "Name of the Lambda function"
  type        = string
}

variable "handler" {
  description = "Handler for the Lambda function"
  type        = string
}

variable "zip_file" {
  description = "Path to the zip file containing the Lambda function code"
  type        = string
}

variable "api_gateway_id" {
  description = "ID of the API Gateway"
  type        = string
}

variable "api_gateway_execution_arn" {
  description = "Execution ARN of the API Gateway"
  type        = string
}

variable "api_gateway_root_resource_id" {
  description = "Root resource ID of the API Gateway"
  type        = string
}

variable "http_method" {
  description = "HTTP method for the API Gateway resource"
  type        = string
}

variable "resource_path" {
  description = "Path for the API Gateway resource"
  type        = string
}
