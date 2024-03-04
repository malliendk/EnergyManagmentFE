FROM nginx:latest
WORKDIR usr/local/app
COPY dist/energy-management-fe /usr/share/nginx/html
EXPOSE 80
