# Node 18 이미지 사용
FROM node:18

# 작업 디렉토리 생성
WORKDIR /app

# package.json, lock 파일 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 전체 소스 복사
COPY . .

# NestJS 빌드
RUN npm run build

# 애플리케이션 실행 (start:prod 스크립트 기준)
CMD ["npm", "run", "start:prod"]
