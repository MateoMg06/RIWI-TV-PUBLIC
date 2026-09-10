FROM node:20-alpine

# Definir directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json antes que el código
COPY package*.json ./

# Instalar dependencias de forma reproducible
RUN npm ci

# Exponer el puerto
EXPOSE 5001

# Comando por defecto
CMD ["npm", "run", "dev"]
