FROM alpine/git AS gitstage

WORKDIR /src

# Le contexte local contient déjà les sous-modules initialisés
COPY . .

FROM nginxinc/nginx-unprivileged:1.29-alpine3.23

COPY --from=gitstage /src /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]