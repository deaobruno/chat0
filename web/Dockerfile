FROM node:20-alpine AS build
WORKDIR /usr/web
COPY . .
RUN npm install --no-progress && \
  npm run build && \
  rm -rf src/ tsconfig.json

FROM node:20-alpine AS production
WORKDIR /usr/web
COPY --from=build ./usr/web ./
RUN npm ci --omit=dev
CMD ["npm", "start"]
