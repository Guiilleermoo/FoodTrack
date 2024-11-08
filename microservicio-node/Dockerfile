FROM node:16

WORKDIR /app

COPY package.json .
RUN npm install
RUN npm install mongoose
RUN npm install winston


COPY . .

EXPOSE 3000

CMD ["node", "--trace-warnings", "app.js"]