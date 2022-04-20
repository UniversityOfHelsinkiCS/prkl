FROM node:16.14.2
# Install netcat for wait-for script
RUN apt-get update && apt-get install -y netcat


# Configure frontend url via --build-arg.
ARG PUBLIC_URL=/
ENV PUBLIC_URL=$PUBLIC_URL

# Set build time NODE_ENV.
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG REACT_APP_CUSTOM_NODE_ENV=production
ENV REACT_APP_CUSTOM_NODE_ENV=$REACT_APP_CUSTOM_NODE_ENV

# Set timezone to Europe/Helsinki
RUN echo "Europe/Helsinki" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

# Install frontend dependencies
WORKDIR /usr/src/app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci

# Install backend dependencies
WORKDIR /usr/src/app/server
COPY server/package.json server/package-lock.json ./
ENV NODE_ENV=""
RUN npm ci
ENV NODE_ENV=$NODE_ENV

# Build frontend.
WORKDIR /usr/src/app
COPY client client/
WORKDIR /usr/src/app/client
RUN npm run build
RUN cp -r build/ ../server/public

# Build backend
WORKDIR /usr/src/app
COPY server server/
COPY ./wait-for /usr/src/app/server
WORKDIR /usr/src/app/server
RUN ["chmod", "+x", "./wait-for"]

RUN npm run build

EXPOSE 3001

CMD npm run start:prod
