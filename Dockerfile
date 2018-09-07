FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
ENV PORT=8000
EXPOSE 8000
CMD ["npm", "start"]
