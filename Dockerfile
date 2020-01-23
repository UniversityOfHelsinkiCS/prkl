FROM node:12

# Set timezone to Europe/Helsinki
RUN echo "Europe/Helsinki" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

WORKDIR /usr/src/app
COPY . .

# Build frontend.
WORKDIR /usr/src/app/client
ENV PUBLIC_URL=/prkl
RUN npm ci
RUN npm run build
RUN cp -r build/ ../server/public

# Build backend.
WORKDIR /usr/src/app/server
RUN npm ci

EXPOSE 3001

CMD npm start
