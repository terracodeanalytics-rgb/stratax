FROM nginx:stable-alpine
COPY cloud-run.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/
EXPOSE 8080
