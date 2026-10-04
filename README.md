# 코덱스 까만창 에러 핸즈온 (수강생용)

블로그 자동 발행 앱의 Codex CLI(까만창) 에러를 유형별로 직접 고치는 체크리스트 페이지.
바이브코딩 특별반 수강생 배포용 · 챗사피엔스

- **라이브**: https://ninestonelee.github.io/codex-error-handson/
- 원고: `guide.md` (마크다운 정본) → `node build.cjs` 로 `index.html` 생성 (pandoc 필요)
- 디자인: PolarisOS Web Doc 디자인 시스템 v1.0 핸즈온 변형 (체크 상태는 브라우저 localStorage에만 저장, 서버 전송 없음)

## 갱신 방법
1. `guide.md` 수정
2. `pandoc guide.md -f gfm -t html5 --wrap=none -o body.html && node build.cjs`
3. `git commit` 후 `main`에 push → 1~2분 내 반영
