FROM node:17-alpine3.15

RUN apk update && apk add bash

COPY ./ /usr/src/app/algorithm
WORKDIR /usr/src/app/algorithm

EXPOSE 3004

# If node_modules do not exist, install before starting.  
CMD [ -d "node_modules" ] && npm run dev || npm ci && npm run dev