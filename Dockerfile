# 최신 LTS 버전의 Node.js를 사용합니다.
FROM node:18

# 앱 디렉토리 생성
WORKDIR /usr/src/app

# 앱 의존성 설치
COPY package*.json ./
RUN npm install

# sharp 모듈 설치
RUN npm install --platform=linux --arch=arm64 sharp

# 앱 소스 복사
COPY . .

# 애플리케이션 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["npm", "start"]
