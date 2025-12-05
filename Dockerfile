
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./ 

RUN npm install

COPY . .

RUN npm run build 


FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

COPY package.json .

ENV PORT=3000
EXPOSE ${PORT}

CMD [ "npm", "start" ]