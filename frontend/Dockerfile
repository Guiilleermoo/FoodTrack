# Etapa 1: Construcción de la aplicación React
FROM node:18 AS build-stage

# Crear directorio de trabajo y copiar el código fuente
RUN mkdir app
WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build-stage /app/build .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]