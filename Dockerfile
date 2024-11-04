FROM nginxinc/nginx-unprivileged:alpine

VOLUME ["/usr/share/nginx/html/apps"]

COPY . /usr/share/nginx/html/
