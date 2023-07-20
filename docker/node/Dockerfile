FROM node:16-alpine as pnpm

RUN npm i -g pnpm

FROM pnpm as builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

USER node

WORKDIR /home/node/app

COPY --chown=node:node ./package.json ./pnpm-lock.yaml ./

RUN pnpm install

COPY --chown=node:node . .

RUN pnpm run install:ui

RUN pnpm run build

FROM pnpm

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --from=builder /home/node/app/package.json /home/node/app/pnpm-lock.yaml .

COPY --from=builder --chown=node:node /home/node/app/dist ./dist

RUN mv /home/node/app/dist/jobs ./jobs

RUN pnpm install -P

CMD [ "npm", "run", "serve" ]
