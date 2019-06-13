FROM node:10.13.0

# Fix for Bcrypt issue
RUN apt-get update && apt-get install -y build-essential && apt-get install -y python

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install -g typescript && npm install && tsc

COPY . /usr/src/app

EXPOSE 5000

CMD [ "npm", "start" ]