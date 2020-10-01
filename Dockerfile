#get the node image from the docker hub
FROM node:14.11.0

#make a working directory
WORKDIR /usr/src/job-track-api

#copy the files to the directory
COPY . .

#do npm install
RUN npm install

#the port container should expose [for doc purposes only]
EXPOSE 3005

#launch shell when done
CMD ["/bin/bash"]
