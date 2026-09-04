FROM node:20-alpine

# Definir directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json antes que el código
COPY package*.json ./

# Instalar dependencias de forma reproducible
RUN npm ci

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
# Usar npm run dev ejecuta el hook "predev", que corre las migraciones antes de arrancar la API
CMD ["npm", "run", "dev"]
