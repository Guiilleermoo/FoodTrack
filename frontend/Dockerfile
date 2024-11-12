# build environment
FROM node:18-alpine as build

WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package.json yarn.lock ./

# Install Yarn globally in the build stage
RUN npm install -g yarn --force

# Verifica si Yarn está instalado
RUN yarn --version

# Instala las dependencias
RUN yarn install --frozen-lockfile

# Verificar el contenido de la carpeta antes de hacer el build
RUN ls -l

# Copia el resto de los archivos (fuentes de la aplicación)
COPY . ./

# Ejecuta la construcción
RUN yarn build

# Usar Nginx para servir la aplicación construida
FROM nginx:stable-alpine

COPY --from=build app/build /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Inicia Nginx cuando el contenedor se ejecute
CMD ["nginx", "-g", "daemon off;"]
