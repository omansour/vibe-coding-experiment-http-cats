package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// Response is the structure returned by the lambda
type Response struct {
	Code        string `json:"code"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Image       string `json:"image"`
	MDNLink     string `json:"mdnLink"`
}

// HTTP code information
var httpCodeInfo = map[string]Response{
	"100": {Code: "100", Name: "Continue", Description: "The server has received the request headers and the client should proceed to send the request body.", Category: "Informational", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100"},
	"101": {Code: "101", Name: "Switching Protocols", Description: "The requester has asked the server to switch protocols and the server has agreed to do so.", Category: "Informational", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/101"},
	"102": {Code: "102", Name: "Processing", Description: "The server has received and is processing the request, but no response is available yet.", Category: "Informational", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/102"},
	"103": {Code: "103", Name: "Early Hints", Description: "Used to return some response headers before final HTTP message.", Category: "Informational", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103"},
	
	"200": {Code: "200", Name: "OK", Description: "The request has succeeded. The meaning of the success depends on the HTTP method.", Category: "Success", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200"},
	"201": {Code: "201", Name: "Created", Description: "The request has been fulfilled, resulting in the creation of a new resource.", Category: "Success", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201"},
	"202": {Code: "202", Name: "Accepted", Description: "The request has been accepted for processing, but the processing has not been completed.", Category: "Success", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202"},
	"203": {Code: "203", Name: "Non-Authoritative Information", Description: "The server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version.", Category: "Success", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/203"},
	"204": {Code: "204", Name: "No Content", Description: "The server successfully processed the request and is not returning any content.", Category: "Success", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204"},
	"205": {Code: "205", Name: "Reset Content", Description: "The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.", Category: "Success", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/205"},
	"206": {Code: "206", Name: "Partial Content", Description: "The server is delivering only part of the resource due to a range header sent by the client.", Category: "Success", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206"},
	"207": {Code: "207", Name: "Multi-Status", Description: "The message body that follows is by default an XML message and can contain a number of separate response codes.", Category: "Success", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/207"},
	"208": {Code: "208", Name: "Already Reported", Description: "The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response.", Category: "Success", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/208"},
	"226": {Code: "226", Name: "IM Used", Description: "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.", Category: "Success", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/226"},
	
	"300": {Code: "300", Name: "Multiple Choices", Description: "Indicates multiple options for the resource from which the client may choose.", Category: "Redirection", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/300"},
	"301": {Code: "301", Name: "Moved Permanently", Description: "This and all future requests should be directed to the given URI.", Category: "Redirection", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301"},
	"302": {Code: "302", Name: "Found", Description: "Tells the client to look at (browse to) another URL.", Category: "Redirection", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302"},
	"303": {Code: "303", Name: "See Other", Description: "The response to the request can be found under another URI using the GET method.", Category: "Redirection", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303"},
	"304": {Code: "304", Name: "Not Modified", Description: "Indicates that the resource has not been modified since the version specified by the request headers.", Category: "Redirection", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304"},
	"305": {Code: "305", Name: "Use Proxy", Description: "The requested resource is available only through a proxy, the address for which is provided in the response.", Category: "Redirection", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/305"},
	"307": {Code: "307", Name: "Temporary Redirect", Description: "The request should be repeated with another URI; however, future requests should still use the original URI.", Category: "Redirection", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307"},
	"308": {Code: "308", Name: "Permanent Redirect", Description: "The request and all future requests should be repeated using another URI.", Category: "Redirection", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308"},
	
	"400": {Code: "400", Name: "Bad Request", Description: "The server cannot or will not process the request due to an apparent client error.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400"},
	"401": {Code: "401", Name: "Unauthorized", Description: "Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401"},
	"402": {Code: "402", Name: "Payment Required", Description: "Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402"},
	"403": {Code: "403", Name: "Forbidden", Description: "The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403"},
	"404": {Code: "404", Name: "Not Found", Description: "The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404"},
	"405": {Code: "405", Name: "Method Not Allowed", Description: "A request method is not supported for the requested resource.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405"},
	"406": {Code: "406", Name: "Not Acceptable", Description: "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406"},
	"407": {Code: "407", Name: "Proxy Authentication Required", Description: "The client must first authenticate itself with the proxy.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407"},
	"408": {Code: "408", Name: "Request Timeout", Description: "The server timed out waiting for the request.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408"},
	"409": {Code: "409", Name: "Conflict", Description: "Indicates that the request could not be processed because of conflict in the request.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409"},
	"410": {Code: "410", Name: "Gone", Description: "Indicates that the resource requested is no longer available and will not be available again.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410"},
	"411": {Code: "411", Name: "Length Required", Description: "The request did not specify the length of its content, which is required by the requested resource.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/411"},
	"412": {Code: "412", Name: "Precondition Failed", Description: "The server does not meet one of the preconditions that the requester put on the request.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412"},
	"413": {Code: "413", Name: "Payload Too Large", Description: "The request is larger than the server is willing or able to process.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413"},
	"414": {Code: "414", Name: "URI Too Long", Description: "The URI provided was too long for the server to process.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414"},
	"415": {Code: "415", Name: "Unsupported Media Type", Description: "The request entity has a media type which the server or resource does not support.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415"},
	"416": {Code: "416", Name: "Range Not Satisfiable", Description: "The client has asked for a portion of the file, but the server cannot supply that portion.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416"},
	"417": {Code: "417", Name: "Expectation Failed", Description: "The server cannot meet the requirements of the Expect request-header field.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417"},
	"418": {Code: "418", Name: "I'm a teapot", Description: "This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418"},
	"421": {Code: "421", Name: "Misdirected Request", Description: "The request was directed at a server that is not able to produce a response.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/421"},
	"422": {Code: "422", Name: "Unprocessable Entity", Description: "The request was well-formed but was unable to be followed due to semantic errors.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422"},
	"423": {Code: "423", Name: "Locked", Description: "The resource that is being accessed is locked.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/423"},
	"424": {Code: "424", Name: "Failed Dependency", Description: "The request failed because it depended on another request and that request failed.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/424"},
	"425": {Code: "425", Name: "Too Early", Description: "Indicates that the server is unwilling to risk processing a request that might be replayed.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425"},
	"426": {Code: "426", Name: "Upgrade Required", Description: "The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426"},
	"428": {Code: "428", Name: "Precondition Required", Description: "The origin server requires the request to be conditional.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/428"},
	"429": {Code: "429", Name: "Too Many Requests", Description: "The user has sent too many requests in a given amount of time.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429"},
	"431": {Code: "431", Name: "Request Header Fields Too Large", Description: "The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431"},
	"451": {Code: "451", Name: "Unavailable For Legal Reasons", Description: "A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource.", Category: "Client Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451"},
	
	"500": {Code: "500", Name: "Internal Server Error", Description: "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.", Category: "Server Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500"},
	"501": {Code: "501", Name: "Not Implemented", Description: "The server either does not recognize the request method, or it lacks the ability to fulfil the request.", Category: "Server Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501"},
	"502": {Code: "502", Name: "Bad Gateway", Description: "The server was acting as a gateway or proxy and received an invalid response from the upstream server.", Category: "Server Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502"},
	"503": {Code: "503", Name: "Service Unavailable", Description: "The server is currently unavailable (because it is overloaded or down for maintenance).", Category: "Server Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503"},
	"504": {Code: "504", Name: "Gateway Timeout", Description: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.", Category: "Server Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504"},
	"505": {Code: "505", Name: "HTTP Version Not Supported", Description: "The server does not support the HTTP protocol version used in the request.", Category: "Server Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505"},
	"506": {Code: "506", Name: "Variant Also Negotiates", Description: "Transparent content negotiation for the request results in a circular reference.", Category: "Server Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/506"},
	"507": {Code: "507", Name: "Insufficient Storage", Description: "The server is unable to store the representation needed to complete the request.", Category: "Server Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/507"},
	"508": {Code: "508", Name: "Loop Detected", Description: "The server detected an infinite loop while processing the request.", Category: "Server Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508"},
	"510": {Code: "510", Name: "Not Extended", Description: "Further extensions to the request are required for the server to fulfil it.", Category: "Server Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510"},
	"511": {Code: "511", Name: "Network Authentication Required", Description: "The client needs to authenticate to gain network access.", Category: "Server Error", MDNLink: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511"},
}

// Handler is the lambda handler
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// CORS headers for all responses
	corsHeaders := map[string]string{
		"Content-Type":                     "application/json",
		"Access-Control-Allow-Origin":      "*",
		"Access-Control-Allow-Methods":     "GET,OPTIONS",
		"Access-Control-Allow-Headers":     "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,x-api-key",
		"Access-Control-Allow-Credentials": "false",
	}

	// Extract HTTP code from path parameters
	httpCode, ok := request.PathParameters["http_code"]
	if !ok {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Headers:    corsHeaders,
			Body:       "Missing HTTP code parameter",
		}, nil
	}

	// Get HTTP code information
	info, exists := httpCodeInfo[httpCode]
	if !exists {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusNotFound,
			Headers:    corsHeaders,
			Body:       fmt.Sprintf("HTTP code %s not found", httpCode),
		}, nil
	}

	// Add image URL
	info.Image = fmt.Sprintf("https://http.cat/images/%s.jpg", httpCode)

	// Convert response to JSON
	jsonResponse, err := json.Marshal(info)
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

func main() {
	lambda.Start(Handler)
}
