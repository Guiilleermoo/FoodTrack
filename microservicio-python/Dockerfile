# Usa una imagen base de Python
FROM python:3.9

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY requirements.txt requirements.txt

# Instala las dependencias
RUN pip install -r requirements.txt

# Copia el resto del código de tu aplicación
COPY . .

# Comando para ejecutar la aplicación
CMD ["python3", "app.py"]
