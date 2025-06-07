resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    aws_api_gateway_rest_api.api
  ]

  rest_api_id = aws_api_gateway_rest_api.api.id

  lifecycle {
    create_before_destroy = true
  }
}
