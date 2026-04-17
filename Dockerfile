# Get source code ans subodule
FROM alpine/git AS gitstage

WORKDIR /src
RUN git clone --recurse-submodules https://github.com/mviewer/mviewer.git -b master .

# Final nginx image
FROM nginxinc/nginx-unprivileged:1.29-alpine3.23

# Copy content and submodule
COPY --from=gitstage /src /usr/share/nginx/html

# config nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
