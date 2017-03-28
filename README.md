# tubit-bigez-backend
This is a hackathon project developed for Getir Hackathon. This project is structured so the all of the backend related projects are in one place. Docker is used for development and deployment of this backend project.

Three main folders are the most important parts of this project. The root folder is used to hold development and production deployment configurations like docker-compose files. These three folders are [application](./application), [database](./database), [cache](./cache). To summarize these folders hold:
 
 - `application` backend business logic and nodejs application.
 - `database` the mongodb database to hold business data and development related configurationns.
 - `cache` the redis configuration to hold the cache of development/production deployments.
 
 # Deployment
 Run the [docker-compose.yml](./docker-compose.yml) stored in this folder after creating `.secret.env` files storing your secret configurations of services. For example for the `application` service, this file is called `application.secret.env` and stores the secret for the Facebook app and the token generation secret.
 
 Running `docker-compose up` starts the backend services and seeds the databases to hold the initial values for the deployment.
 
## Note
There is a problem with the mongodump/mongorestore that i couldn't resolve. Mongodump files i try to initialize in the docker-compose file are extracted from a working demo. However when the `docker-compose up` command is run, there is a bug that causes the database-seed operation to fail inconsistently(2 out of 10 times). I have wrote about this issue on [#1](https://github.com/Yengas/tubit-bigez-backend/issues/1).
