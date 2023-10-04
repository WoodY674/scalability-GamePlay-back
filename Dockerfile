# Utilisez une image Node.js comme image de base
FROM node:18
# Répertoire de travail
WORKDIR /app
# Copiez les fichiers package.json et package-lock.json
COPY package*.json ./
# Installez les dépendances
RUN npm install
# Copiez le reste des fichiers de l'application
COPY . /app
# Port sur lequel votre application écoute
EXPOSE 3000
# Commande pour démarrer l'application
CMD ["npm", "start"]
