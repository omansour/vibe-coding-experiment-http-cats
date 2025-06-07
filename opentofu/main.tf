provider "aws" {
  region = "eu-west-1"
}

# API Gateway
module "api_gateway" {
  source = "./modules/api_gateway"
}

# Lambda functions
module "lambda_http_code_info" {
  source                       = "./modules/lambda/http_code_info"
  api_gateway_id               = module.api_gateway.api_id
  api_gateway_execution_arn    = module.api_gateway.execution_arn
  api_gateway_root_resource_id = module.api_gateway.root_resource_id
}

module "lambda_http_execute_call" {
  source                       = "./modules/lambda/http_execute_call"
  api_gateway_id               = module.api_gateway.api_id
  api_gateway_execution_arn    = module.api_gateway.execution_arn
  api_gateway_root_resource_id = module.api_gateway.root_resource_id
}

# Frontend infrastructure
module "s3" {
  source = "./modules/s3"
  bucket_prefix = "http-codes-app-"
}

module "cloudfront" {
  source = "./modules/cloudfront"
  bucket_id = module.s3.bucket_id
  bucket_arn = module.s3.bucket_arn
  bucket_regional_domain_name = module.s3.bucket_regional_domain_name
}

# Outputs
output "api_endpoint" {
  value = module.api_gateway.invoke_url
}

output "api_key" {
  value = module.api_gateway.api_key
  sensitive = true
}

output "frontend_url" {
  value = module.cloudfront.cloudfront_domain_name
}
