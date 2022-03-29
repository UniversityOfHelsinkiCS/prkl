FROM node:12.16

# Set timezone to Europe/Helsinki
RUN echo "Europe/Helsinki" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

WORKDIR /usr/src/app
COPY . .

WORKDIR /usr/src/app/server

EXPOSE 3001

# If node_modules do not exist, install before starting.  
CMD [ -d "node_modules" ] && npm run start:dev || npm ci && npm run start:dev