FROM nginxinc/nginx-unprivileged:alpine

VOLUME ["/usr/share/nginx/html/apps"]

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY . /usr/share/nginx/html/
