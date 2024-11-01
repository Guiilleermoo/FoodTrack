CREATE DATABASE IF NOT EXISTS microservicioDB;
USE microservicioDB;
GRANT ALL PRIVILEGES ON microservicioDB.* TO 'python'@'%' IDENTIFIED BY 'python';
FLUSH PRIVILEGES;
