# Proyecto de Seguimiento de Alimentación (FoodTrack)

Este proyecto tiene como objetivo desarrollar una aplicación web que permita a los usuarios registrar y hacer un seguimiento de los alimentos que consumen a lo largo del día. Los usuarios podrán visualizar todos sus registros, su progreso y obtener análisis personalizados para mejorar su bienestar nutricional. Además, podrán recibir recomendaciones personalizadas basadas en datos confiables de portales de nutrición abiertos, como Open Food Facts.

## 0) Software que se necesita instalar

- **Docker**: [Descargar Docker](https://www.docker.com/get-started) (incluye Docker Compose).
- **Git** (opcional, si necesitas clonar el repositorio): [Descargar Git](https://git-scm.com/downloads).

## 1) Servicios que hay que arrancar

- **Flask Service**: Microservicio en Python para manejar la lógica de usuarios y los alimentos consumidos.
- **Express Service**: Microservicio en Node.js para manejar los datos estadísticos.
- **Frontend**: Aplicación web en React que interactúa con los servicios de backend.
- **Base de Datos MySQL**: Usada por el servicio Flask para almacenamiento de usuarios y alimentos.
- **Base de Datos MongoDB**: Usada por el servicio Express para almacenamiento de datos estadísticos.

## 2) Dependencias que hay que instalar

Las dependencias necesarias están gestionadas dentro de cada servicio mediante sus respectivos archivos `Dockerfile` y `docker-compose.yml`. 

#### **Microservicio Flask (Python)**
- Flask
- SQLAlchemy
- MySQL-python (para conexión con MySQL)

#### **Microservicio Express (Node.js)**
- Express.js
- mongoose

#### **Frontend (React)**
- React.js

#### **Base de Datos**
- MySQL y MongoDB gestionados mediante Docker.

## 3) Cómo arrancar la parte servidora

### Paso 1: Clonar el repositorio

Si aún no has clonado el repositorio, puedes hacerlo con el siguiente comando:

```bash
git clone <url-del-repositorio>
cd <directorio-del-repositorio>
```

### Paso 2: Construir y levantar los servicios con Docker Compose

En el directorio raíz del proyecto, donde se encuentra el archivo docker-compose.yml, ejecuta el siguiente comando:

```bash
docker-compose up --build
```

Para detener los servicios, usa:

```bash
docker-compose down
```

### Paso 3: Verificar que todo esté funcionando


- **Flask Service**: El servidor Flask estará corriendo en el puerto 5000 (usualmente http://localhost:5000).
- **Express Service**: El servidor Express estará corriendo en el puerto 3000 (usualmente http://localhost:3000).
- **Frontend**: El frontend estará accesible en el puerto 8000 (usualmente http://localhost:8000).

## 4) Cómo acceder a la parte cliente

El frontend de la aplicación estará disponible en el puerto 8000. Para acceder a él, abre tu navegador y visita:

```bash
http://localhost:8000
```
