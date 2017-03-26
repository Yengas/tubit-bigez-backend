#!/usr/bin/env bash

echo "Seeding operation will stall until Mongo becomes avaliable"

# Wait indefinitely for mongo on the virtual network. Print when it finishes.
wait-for-it database:27017 -t 0 -- echo "Mongo is up and running!"

# Seed with test data to test out seeding.
mongoimport --host database --db bigez --collection users --type json --file /seeds/users.json --jsonArray
mongoimport --host database --db bigez --collection markers --type json --file /seeds/markers.json --jsonArray
mongoimport --host database --db bigez --collection routes --type json --file /seeds/routes.json --jsonArray
