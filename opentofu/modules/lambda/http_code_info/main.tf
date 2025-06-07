module "http_code_info_lambda" {
  source        = "../"
  function_name = "http_code_info"
  handler       = "http_code_info"
  zip_file      = "../build/lambda/http_code_info.zip"
  api_gateway_id = var.api_gateway_id
  api_gateway_execution_arn = var.api_gateway_execution_arn
  api_gateway_root_resource_id = var.api_gateway_root_resource_id
  http_method   = "GET"
  resource_path = "http_code_info/{http_code}"
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
  description = "ARN of the HTTP code info Lambda function"
  value       = module.http_code_info_lambda.function_arn
}

output "function_name" {
  description = "Name of the HTTP code info Lambda function"
  value       = module.http_code_info_lambda.function_name
}

output "invoke_arn" {
  description = "Invoke ARN of the HTTP code info Lambda function"
  value       = module.http_code_info_lambda.invoke_arn
}
