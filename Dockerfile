FROM nginx:1.17

VOLUME ["/usr/share/nginx/html/apps"]

COPY . /usr/share/nginx/html/
