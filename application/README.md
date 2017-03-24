# bigez-backend
Backend application written with Node.JS. It uses environment variables to be configured and run.

## Environment Variables
Below are environment variables that may be used to configure the runtime logic of this application. Please see [.env.example](./.env.example) for the default values of this application.
- `PORT` the port which this application runs on. Default: 8080

## Backend Endpoints
Below are backend endpoints which are accepted by this application.

## Deployment
You can use docker to deploy this application. There are two Dockerfiles to be used to deploy this project. One for development and one for production. Please see [Development.Dockerfile](./Dockerfile) and [Dockerfile](./Dockerfile) respectively.

For production, you could either use an `.env` file to run this project bare-metal, or use `docker-compose` or container runtimes set the environment variables from a dynamic source.
