# software

## Coding conventions
- All comments and code variables must be written in English
- Follow standard Go formatting guidelines for backend code
- Use camelCase for JavaScript variables and PascalCase for React components

## backend 
* Use golang version 1.24.1
* Try to minimize the use of external libraries
* Backend files are organized under ./backend/

## frontend
* Use react v19.1
* Use Cloudscape for the UI
* Frontend files are organized under ./frontend/

# infrastructure

## AWS
* AWS region: eu-west-1
* authorized services: Lambda, S3, API Gateway
* while using the use_aws tools, if you encounter an authentication problem, run:
```
xxxSecretxxx
```

## Tooling

### OpenToFu
* opentofu files are organised under ./opentofu/
* Create idempotent OpenToFu configuration files and consider the order of resource creation and destruction
* Follow security best practices, especially for IAM roles and security groups
* Create a module per aws service. If a module contains several entities (like different lambdas), create a different tf file per entities.
