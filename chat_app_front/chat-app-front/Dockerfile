FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


# RUN npm run build

# FROM nginx:alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# PORT of Vite
EXPOSE 5173 


CMD ["npm", "run", "dev", "--", "--host"]