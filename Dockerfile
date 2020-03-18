FROM nginx:1.17

VOLUME ["/usr/share/nginx/html/apps",     \
        "/usr/share/nginx/html/config/"]

COPY . /usr/share/nginx/html/
COPY config-sample.xml /usr/share/nginx/html/config/default.xml
