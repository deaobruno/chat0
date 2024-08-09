FROM node:20-alpine AS build
WORKDIR /usr/api
COPY . .
RUN npm install --progress=false && \
  npm run build && \
  rm -rf src/ tsconfig.json

FROM node:20-alpine AS production
WORKDIR /usr/api
COPY --from=build ./usr/api ./
RUN npm ci --omit=dev
CMD ["npm", "start"]
