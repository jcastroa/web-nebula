FROM node:20-alpine

WORKDIR /app

# Copiar package.json actualizado
COPY package.json package-lock.json* ./

# Instalar todas las dependencias
RUN npm install

# Copiar el resto del código
COPY . .

EXPOSE 3000

CMD ["npm", "start"]