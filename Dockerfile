FROM registry.access.redhat.com/ubi8/nodejs-12

ENV TZ="Europe/Helsinki"

WORKDIR /opt/app-root/src

ARG PUBLIC_URL=/
ENV PUBLIC_URL=$PUBLIC_URL

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG REACT_APP_CUSTOM_NODE_ENV=production
ENV REACT_APP_CUSTOM_NODE_ENV=$REACT_APP_CUSTOM_NODE_ENV

# Install dependencies
COPY --chown=777 . .
RUN cd client && npm ci
RUN cd server && npm ci

# Build frontend.
RUN cd client && npm run build && cp -r build/ ../server/public

# Build backend
RUN npm install -g typescript && cd server && npm run build

EXPOSE 3001

CMD npm run start:prod
