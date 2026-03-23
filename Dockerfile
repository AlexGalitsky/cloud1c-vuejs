# Сборка
FROM node:20-alpine AS build-stage
# Принимаем аргументы от Kaniko/Docker
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG VITE_API_URL
ARG VITE_CLUSTER_ADDRESS
ARG VITE_IB_USER_PASS_REQUIRED
ARG VITE_CLUSTER_WEB_URL
# Устанавливаем их как переменные окружения для npm
ENV http_proxy=$HTTP_PROXY
ENV https_proxy=$HTTPS_PROXY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLUSTER_ADDRESS=$VITE_CLUSTER_ADDRESS
ENV VITE_IB_USER_PASS_REQUIRED=$VITE_IB_USER_PASS_REQUIRED
ENV VITE_CLUSTER_WEB_URL=$VITE_CLUSTER_WEB_URL

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Продакшн (Nginx)
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Копируем конфиг, чтобы Vue Router не выдавал 404 при обновлении страницы
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
