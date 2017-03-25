FROM mongo:3.4.2
LABEL maintainer "yigitcan@hotmail.com.tr"

ADD ./seeds /seeds
# Seed with test data to test out seeding.
CMD mongoimport --host database --db bigez --collection users --type json --file /seeds/users.json --jsonArray && \
    mongoimport --host database --db bigez --collection markers --type json --file /seeds/markers.json --jsonArray && \
    mongoimport --host database --db bigez --collection routes --type json --file /seeds/routes.json --jsonArray
