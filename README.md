## Tiny
Tiny is a minimalistic REST service for url shortening, written in TypeScript.

### Requirements
- Node.js v14.15.4+
- MySQL Database

### Configuration
Tiny is configured through `dotenv`.
The configuration files are named `<environment>.env.local`.

The following settings are available:

#### Service related
`SERVICE_PORT` _(default: 8080)_: The port the service is running on.

`SERVICE_DOMAIN` _(default: http://localhost:8080)_: The domain this service is running on.

#### Database related
`DB_HOST`: _(default: localhost)_: The database host.

`DB_PORT`: _(default: localhost)_: The database port.

`DB_USER`: _(default: localhost)_: The database user.

`DB_PASS`: _(default: localhost)_: The database password.

`DB_NAME`: _(default: tiny)_: The database tiny should use.

### License
This project is licensed under the MIT license.