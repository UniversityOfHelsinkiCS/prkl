FROM node:12

# Set timezone to Europe/Helsinki
RUN echo "Europe/Helsinki" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

WORKDIR /usr/src/app
COPY . .

WORKDIR /usr/src/app/server
RUN npm ci
RUN npm run build

EXPOSE 3001

CMD npm run serve
