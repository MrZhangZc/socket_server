FROM keymetrics/pm2:14-jessie

WORKDIR /app

COPY package.json yarn.lock index.js /app/
COPY app/ /app/app

RUN yarn install \
    && yarn cache clean \
    && yarn build

COPY up.yml /app/

CMD [ "yarn", "run", "pm2-docker-prod" ]