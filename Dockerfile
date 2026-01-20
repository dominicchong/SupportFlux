# The code is updated at https://github.com/dominicchong/SupportFlux/tree/docker

# Setup Frontend
FROM node:20-slim AS build-frontend
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install 

COPY frontend/ ./
RUN npm run build

# Setup Backend 
FROM node:20-slim
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

COPY backend/ ./backend/
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start", "--prefix", "backend"]