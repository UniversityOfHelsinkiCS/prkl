FROM node:16.2

COPY ./ /usr/src/app/frontend
WORKDIR /usr/src/app/frontend

EXPOSE 3000

# If node_modules do not exist, install before starting.  
CMD [ -d "node_modules" ] && npm start || npm ci && npm start

