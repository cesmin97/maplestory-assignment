# 🎯 Nexon Backend Assignment: 이벤트 / 보상 관리 플랫폼

NestJS, MongoDB, Docker 기반의 MSA 아키텍처로 설계된 이벤트 및 보상 관리 플랫폼입니다.  
실제 프로덕션 환경을 고려한 구조로 구현하였으며, JWT 인증 및 역할 기반 권한 제어를 포함합니다.

---

## 🛠️ 기술 스택

- **Node.js**: v18
- **NestJS**: 최신 버전
- **Database**: MongoDB
- **인증**: JWT (AccessToken + RefreshToken)
- **배포/실행**: Docker + Docker Compose
- **언어**: TypeScript

---

## 🗂️ 프로젝트 구조

```
root
├── apps
│   ├── auth-server      # 유저 및 인증 서비스
│   ├── event-server     # 이벤트 및 보상 관리 서비스
│   └── gateway-server   # 인증/권한/프록시 처리 API 게이트웨이
├── postman
│   ├── Auth.postman_collection.json     # Auth 컬렉션
│   ├── Event.postman_collection.json    # Event 컬렉션
│   ├── User.postman_collection.json     # User 컬렉션
│   └── local.postman_environment.json   # 환경 변수
├── docker-compose.yaml
└── README.md
```

---

## ✅ 주요 기능

### 🧑‍💼 Auth Server
- 회원가입 / 로그인 API
- 사용자 생성 API (관리자 전용) — 권한 부여 포함 가능
- 사용자 정보 수정 및 조회
- 사용자 목록 조회 (관리자 전용)
- AccessToken 재발급 (HttpOnly Cookie에 저장된 RefreshToken 기반)
- 토큰 만료 전 강제 로그아웃을 위한 토큰 삭제(Revoke) API 제공
- 사용자 권한 부여 API (`USER`, `OPERATOR`, `AUDITOR`, `ADMIN`)
- 로그인 이력 / 초대 이력 기록

### 🪄 Event Server
- 이벤트 생성 / 목록 / 상세 조회
- 보상 등록 / 조회
- 보상 요청
  - 이벤트 조건 충족 여부 확인
  - 중복 요청 방지
  - 보상 이력 저장
- 보상 이력 조회
  - 본인 이력 조회
  - 전체 이력 조회 (관리자, 감사자)

### 🌐 Gateway Server
- 모든 API 요청의 진입점
- JWT 인증, 역할 기반 권한 제어
- 각 서버(`/auth-api`, `/event-api`)로 요청 라우팅
- 커스텀 헤더 추가 및 불필요한 헤더 필터링

---

## 🔐 인증 및 권한 구조

- **JWT 기반 인증**
  - `AccessToken`: 사용자 ID, 역할 포함
  - `RefreshToken`: 사용자 ID 기반, HttpOnly Cookie 저장
- **역할(Role) 기반 권한 제어**
  - `USER`: 보상 요청 가능
  - `OPERATOR`: 이벤트/보상 등록 가능
  - `AUDITOR`: 보상 이력 조회 가능
  - `ADMIN`: 모든 기능 접근 가능
- NestJS의 `AuthGuard`, `RolesGuard`, `@Roles()` 데코레이터 적용

---

## 🚀 실행 방법 (Docker Compose)

1. `.env` 파일 준비 (각 서버별로 필요)

현재 `.env` 파일은 편의를 위해 GitHub 레포지토리에 포함되어 있습니다.  
따라서 별도로 환경 변수 파일을 준비하지 않아도 바로 실행 가능합니다.

2. Docker 이미지 빌드 및 실행

```bash
docker-compose build
docker-compose up
```

서버 포트:
- `auth-server`: 55100
- `event-server`: 55200
- `gateway-server`: 55000

---

## 🔬 API 테스트 (Postman)

이 프로젝트는 Postman을 활용해 API를 쉽게 테스트할 수 있도록 구성되어 있습니다.

### 🔧 테스트 준비 방법

1. Postman이 설치되어 있지 않다면 [공식 다운로드 페이지](https://www.postman.com/downloads/)에서 설치합니다.
2. 아래 링크에서 공개된 워크스페이스에 접속합니다:  
   👉 [Postman Workspace 바로가기](https://www.postman.com/cesmin/maplestory-assignment)
3. 필요한 컬렉션 및 환경 변수 파일은 레포지토리의 `postman/` 폴더에도 `.json` 형식으로 포함되어 있습니다.
   - `Auth.postman_collection.json`
   - `Event.postman_collection.json`
   - `User.postman_collection.json`
   - `local.postman_environment.json`

### 🧪 테스트 방법

1. 위 json 파일들을 Postman에서 불러와 환경 설정을 적용합니다.
2. 각 서버(`/auth-api`, `/event-api`)에 대해 정의된 API를 순차적으로 실행해 기능을 확인할 수 있습니다.
3. JWT 인증이 필요한 API의 경우, 로그인 후 Header 내 Authorization에 설정이 필요합니다.

### 💾  초기 설정 데이터

서버 실행 시 아래와 같은 사용자 계정들이 자동으로 생성됩니다.

| Email               | Password       | Name     | Role     |
|---------------------|----------------|----------|----------|
| admin@nexon.com     | securepassword | admin    | ADMIN    |
| auditor@nexon.com   | securepassword | auditor  | AUDITOR  |
| operator@nexon.com  | securepassword | operator | OPERATOR |
| user1@nexon.com     | securepassword | user1    | USER     |
| user2@nexon.com     | securepassword | user2    | USER     |
| user3@nexon.com     | securepassword | user3    | USER     |

---

## 🧠 설계 의도 및 고민

- **MSA 구조**를 따르면서도 각 서비스가 독립적으로 실행 가능하도록 설계
- 이벤트 조건 및 보상 로직은 **실제 게임 시스템과 유사한 모델링**을 통해 설계
- JWT 인증을 활용하되, **RefreshToken을 서버에서 관리**해 세션 기반 보안 모델도 고려
- 실제 조건 검증을 위한 로그인/초대 이력 기록 기능도 추가
- Gateway에서 **프록시 처리와 역할 기반 접근 제어**를 통합

---

## 📬 문의

- 작성자: [cesmin97](mailto:cesmin1216@gmail.com)
