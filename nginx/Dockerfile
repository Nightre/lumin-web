FROM nginx:latest

COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY start.sh /start.sh

EXPOSE 80

RUN chmod +x /start.sh && chmod 644 /etc/nginx/conf.d/default.conf.template

CMD ["/start.sh"]