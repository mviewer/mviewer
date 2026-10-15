FROM alpine/git AS gitstage

WORKDIR /src

# Le contexte local contient déjà les sous-modules initialisés
COPY . .

FROM nginxinc/nginx-unprivileged:1.29-alpine3.23

# Override the OCI labels inherited from the nginx base image, so that tools
# such as Renovate or Dependabot link to mviewer instead of docker-nginx-unprivileged
LABEL org.opencontainers.image.title="mviewer" \
      org.opencontainers.image.description="Visualiseur géographique thématique basé sur OpenLayers et Bootstrap" \
      org.opencontainers.image.source="https://github.com/mviewer/mviewer" \
      org.opencontainers.image.url="https://mviewer.github.io/fr/" \
      org.opencontainers.image.licenses="GPL-3.0"

COPY --from=gitstage /src /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]