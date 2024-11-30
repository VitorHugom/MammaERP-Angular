FROM node:21 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
WORKDIR /etc/nginx
COPY --from=builder /app/dist/mamma-erp/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/nginx.template
COPY mime.types /etc/nginx/mime.types

# Adiciona o script para substituir variáveis de ambiente
RUN apk add --no-cache gettext

EXPOSE 80

CMD ["sh", "-c", "envsubst '${PORT}' < /etc/nginx/templates/nginx.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
