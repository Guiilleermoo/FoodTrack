# Etapa de construcción de la aplicación React
FROM node:12-alpine3.12 AS build
WORKDIR /app

# Copiar el package.json y package-lock.json (si existe)
COPY package.json ./
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

COPY openapi*.yaml ./

# Construir la aplicación React
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:1.19.0-alpine AS prod-stage

# Copiar los archivos de la construcción al directorio adecuado de Nginx
COPY --from=build /app/build /usr/share/nginx/html

COPY --from=build /app/openapiFlask.yaml /app/openapiNode.yaml /usr/share/nginx/html/

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx cuando se ejecute el contenedor
CMD [ "nginx", "-g", "daemon off;" ]
