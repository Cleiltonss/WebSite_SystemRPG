# Build da aplicação
FROM node:20 AS builder

WORKDIR /app

COPY . .

RUN npm install && npm run build

# Servidor NGINX leve para produção
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Remove o default.conf e adiciona o nosso (opcional)
RUN rm /etc/nginx/conf.d/default.conf

# Serve diretamente sem fallback
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
