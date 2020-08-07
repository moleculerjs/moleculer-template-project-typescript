FROM node:lts-alpine
# Env
ENV NODE_ENV=production
# Create Directory for the Container
WORKDIR /usr/src/app
# Only copy the package.json file to work directory
COPY package.json .
# Only copy the start.sh file to work directory
COPY start.sh .
# lets you run the script
RUN chmod +x ./start.sh
# Install all Packages
RUN npm install
# Copy all other source code to work directory
ADD . /usr/src/app
#runs the script
ENTRYPOINT ["sh","-c","./start.sh"]
# Start
CMD ["sh","-c","./start.sh"]
