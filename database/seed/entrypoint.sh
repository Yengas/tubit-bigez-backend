#!/usr/bin/env bash
# File to touch after restoring the database for the first time.
# This prevents the mongodb database to try to restore database after every container start.
RESTORE_CHECK_FILE=/.mongo_restore_flag

echo "Seeding operation will stall until Mongo becomes avaliable"

# Wait indefinitely for mongo on the virtual network. Print when it finishes.
wait-for-it database:27017 -t 0 -- echo "Mongo is up and running!"

# Wait for mongodb to initialize.
until mongo mongodb://database --eval "{ ping: 1 }"; do !!; done

# Seed with test data to test out seeding.
if [ ! -f $RESTORE_CHECK_FILE ]; then
    # No need to gzip atm.
    # mongorestore -h database --gzip /dump
    mongorestore -h database /dump
    touch $RESTORE_CHECK_FILE
fi
