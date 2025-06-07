module "http_execute_call_lambda" {
  source        = "../"
  function_name = "http_execute_call"
  handler       = "http_execute_call"
  zip_file      = "../build/lambda/http_execute_call.zip"
  api_gateway_id = var.api_gateway_id
  api_gateway_execution_arn = var.api_gateway_execution_arn
  api_gateway_root_resource_id = var.api_gateway_root_resource_id
  http_method   = "POST"
  resource_path = "http_execute_call"
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

output "function_arn" {
  description = "ARN of the HTTP execute call Lambda function"
  value       = module.http_execute_call_lambda.function_arn
}

output "function_name" {
  description = "Name of the HTTP execute call Lambda function"
  value       = module.http_execute_call_lambda.function_name
}

output "invoke_arn" {
  description = "Invoke ARN of the HTTP execute call Lambda function"
  value       = module.http_execute_call_lambda.invoke_arn
}
