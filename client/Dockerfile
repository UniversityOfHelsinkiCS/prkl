FROM node:16.2

COPY ./ /usr/src/app/frontend
WORKDIR /usr/src/app/frontend

RUN npm i

EXPOSE 3000

CMD ["npm", "start"]