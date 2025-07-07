FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

RUN chmod +x /start.sh

CMD ["/start.sh"]