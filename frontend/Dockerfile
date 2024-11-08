# Usa la imagen oficial de Node.js para construir la app React
FROM node:18 AS build

# Define el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del frontend
COPY . .

# Construye la aplicación React para producción
RUN npm run build

# Usa una imagen ligera para servir el contenido estático
FROM nginx:alpine

# Copia los archivos generados en la etapa de build al contenedor de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Inicia Nginx cuando el contenedor se ejecute
CMD ["nginx", "-g", "daemon off;"]
