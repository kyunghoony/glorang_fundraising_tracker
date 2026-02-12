# Glorang Fundraising Tracker

글로랑 펀드레이징 파이프라인을 추적하는 대시보드 애플리케이션입니다.

## 주요 기능

- **투자자 파이프라인 관리**: 투자자별 상태(Verbal, HighInterest, InProgress, Dropped) 추적
- **확률 가중 목표 계산**: 투자 확률 기반 목표 금액 자동 계산
- **AI 어시스턴트**: Google Gemini API 기반 투자 분석 지원
- **데이터 시각화**: 파이차트, 바차트를 통한 파이프라인 현황 시각화
- **데이터 영속성**: Vercel Postgres 기반 데이터 저장

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | React 19 + TypeScript |
| 빌드 도구 | Vite 6 |
| 스타일링 | Tailwind CSS |
| 차트 | Recharts |
| 아이콘 | Lucide React |
| 백엔드 | Express.js |
| 데이터베이스 | Vercel Postgres |
| AI | Google Gemini API |

## 프로젝트 구조

```
├── App.tsx                 # 메인 앱 컴포넌트
├── index.tsx               # React 엔트리 포인트
├── index.html              # HTML 엔트리 포인트
├── types.ts                # TypeScript 타입 정의
├── constants.ts            # 상수 (투자자 초기 데이터)
├── components/
│   ├── AssistantPanel.tsx   # AI 어시스턴트 채팅 패널
│   ├── InvestorModal.tsx    # 투자자 추가/수정 모달
│   ├── PipelineTable.tsx    # 파이프라인 테이블
│   └── StatsCard.tsx        # 통계 카드
├── api/
│   ├── investor.ts          # 단일 투자자 API
│   ├── investors.ts         # 투자자 목록 API
│   └── setup.ts             # DB 설정 API
├── server/
│   └── index.js             # Express 서버
└── services/
    ├── api.ts               # 프론트엔드 API 클라이언트
    └── geminiService.ts     # Gemini AI 서비스
```

## 시작하기

### 사전 요구사항

- Node.js (v18 이상 권장)
- npm
- Google Gemini API Key
- Vercel Postgres 데이터베이스 (선택사항)

### 설치 및 실행

1. **리포지토리 클론**
   ```bash
   git clone <repository-url>
   cd glorang_fundraising_tracker
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   cp .env.example .env.local
   ```
   `.env.local` 파일을 열어 API 키를 설정합니다.

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000`으로 접속합니다.

### 빌드

```bash
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 환경 변수

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `GEMINI_API_KEY` | Google Gemini API 키 | O |
| `POSTGRES_URL` | Vercel Postgres 연결 URL | 선택 |
