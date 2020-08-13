FROM node:lts-alpine
RUN apk add --no-cache inotify-tools
# Env
ENV NODE_ENV=production
# Create Directory for the Container
WORKDIR /usr/src/app
# Only copy the package.json file to work directory
COPY package.json .

# Install all Packages
RUN npm install
# Copy all other source code to work directory
ADD . /usr/src/app
RUN chmod a+x ./start.sh
#runs the script
ENTRYPOINT ["sh","-c","./start.sh"]
# Start
CMD ["sh","-c","./start.sh"]
