FROM mongo:3.4.2
LABEL maintainer "yigitcan@hotmail.com.tr"

ADD ./seeds /seeds
# Seed with test data to test out seeding.
CMD mongoimport --host database --db bigez --collection testCollection --type json --file /seeds/test.json --jsonArray
