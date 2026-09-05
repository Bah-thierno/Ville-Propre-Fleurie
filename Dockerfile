FROM nginx:alpine

# Copy the custom Nginx configuration (with API proxy to backend:3000)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the production build directly into Nginx html root
COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
