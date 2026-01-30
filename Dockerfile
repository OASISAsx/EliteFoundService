FROM node:18

WORKDIR /app

# copy package files
COPY package.json package-lock.json ./

# 👉 copy prisma schema มาก่อน
COPY prisma ./prisma

# install dependencies (prisma generate จะเจอ schema แล้ว)
RUN npm install

# copy source code ที่เหลือ
COPY . .

EXPOSE 8081

CMD ["npm", "start"]
