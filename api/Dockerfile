FROM node:20-alpine
WORKDIR /usr/src/api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
