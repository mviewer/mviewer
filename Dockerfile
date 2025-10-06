# Étape 1 : récupération du code et des sous-modules
FROM alpine/git AS gitstage

WORKDIR /src
RUN git clone --recurse-submodules https://github.com/mviewer/mviewer.git -b develop-lite .

# Étape 2 : image finale Nginx servant mviewer
FROM nginx:alpine

# Copie du contenu du dépôt cloné (y compris sous-modules)
COPY --from=gitstage /src /usr/share/nginx/html

# Configuration de Nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]