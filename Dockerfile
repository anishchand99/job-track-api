#get the node image from the docker hub
FROM node:14.11.0

#make a working directory
WORKDIR /usr/src/job-track-api

#copy package.json and package-lock.json
COPY package*.json ./

#do npm install
RUN npm install

#copy the files to the directory
COPY . .

#the port container should expose [for doc purposes only]
EXPOSE 3005

#launch shell when done
CMD ["/bin/bash"]
