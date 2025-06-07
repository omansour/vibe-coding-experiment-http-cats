variable "api_name" {
  description = "Name of the API Gateway"
  type        = string
  default     = "http-codes-api"
}

variable "api_description" {
  description = "Description of the API Gateway"
  type        = string
  default     = "API for HTTP Codes Educational App"
}

variable "stage_name" {
  description = "Name of the API Gateway stage"
  type        = string
  default     = "prod"
}
