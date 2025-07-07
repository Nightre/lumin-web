#!/bin/sh
set -e

if [ -z "$DOMAIN" ]; then
  echo "Error: DOMAIN environment variable is not set."
  exit 1
fi

envsubst '${DOMAIN}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'