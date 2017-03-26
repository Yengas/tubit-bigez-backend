# bigez-backend
Backend application written with Node.JS. It uses environment variables to be configured and run.

# Deployment
You can use docker to deploy this application. There are two Dockerfiles to be used to deploy this project. One for development and one for production. Please see [Development.Dockerfile](./Dockerfile) and [Dockerfile](./Dockerfile) respectively.

For production, you could either use an `.env` file to run this project bare-metal, or use `docker-compose` or container runtimes set the environment variables from a dynamic source.

 # Configuration
 Most of the business logic and the environment dependent configurations of the application is stored in the [config.js](./application/src/config). This configuration file may be configured using environment variables. Example environment variables can be found at the [example.env](./application/example.env) file. You can also see some deployment specific configurations by taking look at the `docker-compose` configurations.
 
 You can also use a `.env` file stored at the root of your application folder. Running the `bin/index.js` script will make the `.env` variables load and take effect. However please note that you will need to install nodejs and dependent libraries to configure the project this way.
 
 ## Environment Variables
 Below are some of the environment variables and what they do.
 ```
 PORT=8080 # The port which the application will listen on
 FACEBOOK_APP_ID=192380281250599 # App id of the facebook application to be used for login
 FACEBOOK_APP_SECRET=<<redacted>>
 FRONTEND_ORIGIN=http://localhost:2000 # Which origin to allow for the cross origin requests
 DATABASE_CONFIGURATION=mongodb://database/bigez # database connection url and selected database
 REDIS=cache # host name of the redis cache server
 REDIS_PORT=6379
 AUTH_STORAGE_KEY=auth # which prefix to use while storing the authentication tokens
 AUTH_TOKEN_SECRET=<<redacted>> # secret to use while signing the hmac tokens
 TOKEN_HEADER=x-bigez-token # which header will be used to retrieve tokens from the client
 GMAIL_PASSWORD=<<redacted>> # Gmail info to use while mailing the users
 GMAIL_ADDRESS=yengas07@gmail.com
 ```
 
 # Endpoints
 Most of the endpoint calls are authenticated with the access token sent by the clients. This access token is signed by the server using hmac and is stored in redis for a set amount of time, before it expires permanently.
 
 ### Login Related
 - /login/facebook [GET] { redirect_uri: String }
 - /login/facebook/callback [GET] { redirect_uri: String, code: String }
 
 ### Markers
 - /markers [GET]
 - /markers [POST] { point: Array, distance: Number }
 
 ### Routes
 - /routes/:id [GET]
 - /routes/:id/match [GET]
 - /routes/:id/accept [GET]


