FROM cypress/browsers:latest

COPY package.json package-lock.json /tmp/
WORKDIR /tmp
RUN CI=true npm ci
RUN CI=true /tmp/node_modules/.bin/cypress install
RUN mkdir /e2e && cp -a /tmp/node_modules /e2e/
ENV CYPRESS_responseTimeout=90000
WORKDIR /e2e
COPY cypress.json .

CMD ./node_modules/.bin/cypress run --headless
