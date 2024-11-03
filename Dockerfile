FROM node:16-alpine

WORKDIR /usr/blog

COPY package.json ./
RUN npm install

COPY . ./

CMD ["npm", "run", "start"]
