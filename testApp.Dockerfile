FROM node:12-slim

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
RUN npm ci

WORKDIR /usr/src/app
COPY client client/

# Build frontend.
WORKDIR /usr/src/app/client
ENV PUBLIC_URL=/
RUN npm run build
RUN cp -r build/ ../server/public

WORKDIR /usr/src/app
COPY server server/

# Build backend
WORKDIR /usr/src/app/server
RUN npm run build

EXPOSE 3001
EXPOSE 4000
EXPOSE 5432
EXPOSE 5431

CMD npm start
