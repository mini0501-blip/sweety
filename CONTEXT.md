# Sweety 프로젝트 컨텍스트

## 목적
- Figma 기반 모바일 화면 퍼블리싱 (순수 HTML/CSS/JS)
- 기준 아트보드: 402 x 874

## 현재 파일 구조
- `index.html`: 스플래시 화면
- `home-screen.html`: 스플래시 이후 홈 화면
- `assets/css/main.css`: 공통 + 홈 화면 스타일 통합 관리
- `assets/js/main.js`: 스플래시(로고 마스크 원 채움) 로직
- `assets/js/home-screen.js`: 홈 화면 스케일/전환 로직
- `assets/image/logo.svg`: 스플래시 로고 마스크 원본
- `assets/image/home/*`: 홈 화면 상단/배경 자산
- `assets/image/tabs/*`: 하단 탭 아이콘 SVG
- `server.js`: 로컬 정적 서버 (http://localhost:5500)

## 핵심 동작
1. 스플래시에서 로고 마스크 채움 애니메이션 실행
2. 홈 화면에서 진입 시 스플래시 오버레이가 3초 유지
3. 이후 0.5초 동안 로고 페이드아웃 후 제거

## 디자인/구현 규칙
- 폰트: Pretendard (영문/국문 공통)
- 상태바/홈 인디케이터: UI는 그리지 않고 safe-area 기반으로 레이아웃 처리
- 하단 탭바:
  - 기본 높이 72px
  - iPhone에서는 `env(safe-area-inset-bottom)`만큼 추가되어 약 93px 체감
  - 탭 버튼 5개 간격 12px

## 개발 규칙 (합의사항)
- 화면별 CSS 파일 추가하지 않고 `assets/css/main.css`에 통합
- 실제 작업 파일명은 `home-screen.html` 사용 (오타 파일 사용 금지)

## 실행 방법
1. 프로젝트 루트에서 서버 실행
   - `node server.js`
2. 브라우저 접속
   - `http://localhost:5500/index.html`
   - `http://localhost:5500/home-screen.html`

## 다음 작업 시 참고
- Figma에서 반드시 "전체 프레임" 선택 후 추출
- 탭/아이콘 변경 시 `assets/image/tabs`의 SVG 교체
- 로고 형태 변경 시 `assets/image/logo.svg` 교체

## 체크리스트

### 작업 시작 전
- [ ] Figma에서 작업 대상이 "전체 프레임"으로 선택되어 있는지 확인
- [ ] 수정 대상 파일이 `home-screen.html`인지 확인 (`hoem-screen.html` 사용 금지)
- [ ] 새 스타일은 별도 CSS 파일 생성 없이 `assets/css/main.css`에 추가
- [ ] 아이콘/이미지 교체 시 `assets/image/...` 경로 규칙 유지
- [ ] 로컬 서버(`node server.js`) 실행 상태 확인 후 `http://localhost:5500`에서 검수

### 배포 전
- [ ] `index.html` → `home-screen.html` 전환 타이밍(3초 + 0.5초) 동작 확인
- [ ] iPhone safe-area 반영 확인 (`env(safe-area-inset-top/bottom)`)
- [ ] 탭바 높이 규칙 확인 (기본 72px + iPhone 하단 inset)
- [ ] 탭 버튼 간격 12px, 아이콘/레이블 정렬 확인
- [ ] 콘솔 에러/404 없는지 확인 (특히 SVG 경로)
- [ ] 실제 사용 파일만 남겼는지 확인 (오타/중복 파일 제거)
