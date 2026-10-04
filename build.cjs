// guide.md → index.html (PolarisOS Web Doc 디자인 시스템 v1.0 · 핸즈온 변형)
const fs = require("fs");
let body = fs.readFileSync("body.html", "utf8");

// 제목 블록(h1 + 첫 blockquote)은 헤더로 대체
body = body.replace(/^<h1[^>]*>[\s\S]*?<\/h1>\s*<blockquote>[\s\S]*?<\/blockquote>\s*<hr \/>\s*/, "");
// 체크박스를 실제로 누를 수 있게 + 고유 id (pandoc: <li><label><input type="checkbox" />텍스트</label></li>)
let n = 0;
body = body.replace(/<li><label><input type="checkbox"[^>]*\/>([\s\S]*?)<\/label><\/li>/g, (m, inner) => {
  const id = "c" + (++n);
  return `<li class="task"><label><input type="checkbox" id="${id}"><span class="tick"><svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="t">${inner.trim()}</span></label></li>`;
});
// pandoc의 task-list 클래스 유지, 표는 스크롤 래퍼
body = body.replace(/<table>/g, '<div class="tbl"><table>').replace(/<\/table>/g, "</table></div>");
// 섹션 라벨 스타일: h2 앞의 hr 제거
body = body.replace(/<hr \/>\s*(?=<h2)/g, "");
// "하지 말 것" / "주의" 강조문 → note
body = body.replace(/<p><strong>하지 말 것:<\/strong>([\s\S]*?)<\/p>/g, '<div class="note warn"><span class="mark"></span><div><b>하지 말 것</b>$1</div></div>');
body = body.replace(/<p><strong>강사에게 보낼 것:<\/strong>([\s\S]*?)<\/p>/g, '<div class="note info"><span class="mark"></span><div><b>강사에게 보낼 것</b>$1</div></div>');
body = body.replace(/<p><strong>됐는지 확인:<\/strong>([\s\S]*?)<\/p>/g, '<div class="note ok"><span class="mark"></span><div><b>됐는지 확인</b>$1</div></div>');

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>코덱스 까만창 에러 핸즈온 — 블로그 자동화 수강생용</title>
<meta name="description" content="블로그 자동 발행 앱의 Codex CLI(까만창) 에러를 유형별로 직접 고치는 체크리스트. 바이브코딩 특별반 수강생용.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#eef4f2">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23102234'/%3E%3Cpath d='M16 22l12 10-12 10M32 42h16' stroke='%2341cec4' stroke-width='6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
<style>
  :root{--bg:#eef4f2;--paper:#fbfdfc;--surface:#ffffff;--ink:#12263a;--ink-2:#344e63;--muted:#6d8192;--navy:#173a5d;--navy-2:#0f2a45;--teal:#089aa2;--teal-deep:#066c72;--teal-soft:#e1f3f3;--coral:#ef674f;--coral-soft:#fdebe6;--amber:#c98712;--amber-soft:#fbf0d9;--green:#17996a;--green-soft:#e0f2e9;--blue:#315f9f;--blue-soft:#e6edf7;--line:#d9e5e2;--line-2:#c2d2cf;--code-bg:#102234;--code-ink:#d9e8eb;--mono:ui-monospace,SFMono-Regular,Menlo,monospace;--shadow:0 1px 2px rgba(18,38,58,.04),0 12px 28px -18px rgba(18,38,58,.28);--shadow-lg:0 2px 8px rgba(18,38,58,.06),0 24px 52px -28px rgba(18,38,58,.34)}
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR","Segoe UI",sans-serif;background:linear-gradient(135deg,rgba(8,154,162,.08) 0 1px,transparent 1px 52px),linear-gradient(45deg,rgba(239,103,79,.06) 0 1px,transparent 1px 64px),var(--bg);color:var(--ink);line-height:1.68;-webkit-font-smoothing:antialiased;overflow-x:hidden;word-break:keep-all;overflow-wrap:break-word}
  body::after{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:linear-gradient(180deg,rgba(251,253,252,.62),rgba(238,244,242,.2) 36%,rgba(238,244,242,.82))}
  .wrap{position:relative;z-index:1;max-width:920px;margin:0 auto;padding:0 22px 100px}
  .topbar{position:fixed;inset:0 0 auto 0;height:5px;z-index:30}
  .topbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--teal),#34c4bc,var(--green));box-shadow:0 0 14px rgba(8,154,162,.5);transition:width .35s ease}
  header{position:relative;padding:64px 0 26px}
  header::before{content:"";position:absolute;right:0;top:70px;width:118px;height:118px;z-index:-1;opacity:.16;background:linear-gradient(90deg,var(--teal) 0 18px,transparent 18px 32px,var(--coral) 32px 50px,transparent 50px),linear-gradient(0deg,var(--navy) 0 18px,transparent 18px 32px,var(--teal) 32px 50px,transparent 50px);background-size:50px 50px;clip-path:polygon(32% 0,100% 0,100% 68%,68% 100%,0 100%,0 32%)}
  .kicker{display:inline-flex;align-items:center;gap:9px;font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--teal-deep);background:var(--teal-soft);border:1px solid rgba(8,154,162,.2);border-radius:999px;padding:7px 13px;font-weight:700}
  .dot{width:7px;height:7px;border-radius:50%;background:var(--teal);box-shadow:0 0 0 5px rgba(8,154,162,.12)}
  h1{font-size:clamp(30px,5.2vw,48px);line-height:1.1;letter-spacing:-.02em;margin-top:22px;font-weight:800}
  h1 .hl{position:relative;white-space:nowrap}
  h1 .hl::after{content:"";position:absolute;left:-3px;right:-3px;bottom:7px;height:28%;background:rgba(239,103,79,.22);border-radius:4px;z-index:-1}
  .lede{font-size:17px;color:var(--ink-2);max-width:66ch;margin-top:16px;font-weight:350}
  .lede b{color:var(--ink);font-weight:700}
  .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
  .chip{display:inline-flex;align-items:center;gap:8px;background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:8px 12px;color:var(--ink-2);font-size:13.5px;box-shadow:var(--shadow)}
  .miniicon{width:17px;height:17px;border-radius:5px;background:var(--teal-soft);border:1px solid rgba(8,154,162,.26);display:inline-block;position:relative;flex:none}
  .miniicon::after{content:"";position:absolute;inset:4px;border-radius:2px;background:var(--teal)}
  .miniicon.coral{background:var(--coral-soft);border-color:rgba(239,103,79,.28)} .miniicon.coral::after{background:var(--coral)}
  .miniicon.amber{background:var(--amber-soft);border-color:rgba(201,135,18,.28)} .miniicon.amber::after{background:var(--amber)}
  .progress-card{margin-top:26px;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:16px 18px;display:flex;gap:16px;align-items:center;box-shadow:var(--shadow)}
  .ring{position:relative;width:64px;height:64px;flex:none}
  .ring svg{transform:rotate(-90deg)}
  .ring .bg{stroke:var(--line-2)} .ring .fg{stroke:var(--teal);stroke-linecap:round;transition:stroke-dashoffset .45s ease}
  .ring b{position:absolute;inset:0;display:grid;place-items:center;font-family:var(--mono);font-size:14px;color:var(--teal-deep)}
  .progress-card strong{display:block;font-size:15px}
  .progress-card span{display:block;color:var(--muted);font-size:13px;margin-top:2px}
  .reset{margin-left:auto;border:1px solid var(--line-2);background:var(--paper);border-radius:8px;padding:7px 11px;font-family:var(--mono);font-size:11px;color:var(--ink-2);cursor:pointer}
  .quicknav{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
  .quicknav a{font-family:var(--mono);font-size:11.5px;font-weight:800;letter-spacing:.04em;background:var(--teal-soft);color:var(--teal-deep);border-radius:7px;padding:5px 9px;text-decoration:none}
  .quicknav a.c{background:var(--coral-soft);color:#a93b29}
  article h2{font-size:clamp(21px,3vw,26px);line-height:1.25;letter-spacing:-.01em;margin:54px 0 12px;padding-top:14px;border-top:2px solid var(--teal);scroll-margin-top:24px}
  article h2::before{content:"// ";color:var(--teal);font-family:var(--mono);font-size:14px;letter-spacing:.1em;vertical-align:middle}
  article h3{font-size:18.5px;line-height:1.35;letter-spacing:-.01em;margin:34px 0 10px;padding:14px 16px;background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--teal);border-radius:8px;box-shadow:var(--shadow);scroll-margin-top:24px}
  article p{color:var(--ink-2);font-size:15.5px;margin-top:10px}
  article p strong,article li strong{color:var(--ink);font-weight:800}
  article ul,article ol{margin:10px 0 0 22px;color:var(--ink-2);font-size:15.2px}
  article li{margin-top:5px}
  article ul.task-list,article ul:has(> li.task){list-style:none;margin-left:0;display:flex;flex-direction:column;gap:8px;margin-top:12px}
  li.task{margin:0}
  li.task label{display:flex;gap:11px;align-items:flex-start;background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:11px 13px;color:var(--ink-2);font-size:14.6px;cursor:pointer;transition:background .2s}
  li.task label:hover{background:var(--surface)}
  li.task input{display:none}
  li.task .tick{width:19px;height:19px;border:2px solid var(--line-2);border-radius:6px;display:grid;place-items:center;flex:none;margin-top:3px;background:var(--surface)}
  li.task input:checked~.tick{background:var(--teal);border-color:var(--teal)}
  li.task svg{opacity:0;transform:scale(.6);transition:.2s}
  li.task input:checked~.tick svg{opacity:1;transform:scale(1)}
  li.task input:checked~.t{color:var(--muted);text-decoration:line-through;text-decoration-color:var(--line-2)}
  blockquote{margin-top:14px;border-left:4px solid var(--amber);background:var(--amber-soft);border-radius:0 8px 8px 0;padding:12px 15px;color:#73500b;font-size:14.6px}
  blockquote p{color:inherit;margin:0;font-size:inherit}
  .note{display:flex;gap:12px;margin-top:14px;border-radius:8px;padding:13px 15px;font-size:14.4px;line-height:1.6}
  .note .mark{flex:none;width:20px;height:20px;border-radius:6px;margin-top:2px}
  .note b{font-weight:800;display:block;margin-bottom:2px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;font-family:var(--mono)}
  .note.warn{background:var(--coral-soft);border:1px solid rgba(239,103,79,.25);color:#873224}.note.warn .mark{background:var(--coral)}
  .note.info{background:var(--blue-soft);border:1px solid rgba(49,95,159,.22);color:#284f84}.note.info .mark{background:var(--blue)}
  .note.ok{background:var(--green-soft);border:1px solid rgba(23,153,106,.25);color:#0f6b4a}.note.ok .mark{background:var(--green)}
  .tbl{overflow-x:auto;margin-top:14px;background:var(--surface);border:1px solid var(--line);border-radius:8px;box-shadow:var(--shadow)}
  table{width:100%;border-collapse:collapse;font-size:14.2px;min-width:520px}
  td,th{border-bottom:1px solid var(--line);padding:10px 12px;text-align:left;vertical-align:top}
  th{font-size:11.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-family:var(--mono);background:var(--paper)}
  tr:last-child td{border-bottom:0}
  td code,p code,li code{font-family:var(--mono);background:var(--teal-soft);color:var(--teal-deep);padding:2px 6px;border-radius:6px;font-size:12.6px}
  pre{margin-top:14px;background:var(--code-bg);border-radius:8px;padding:14px 16px;overflow-x:auto;font-family:var(--mono);font-size:13px;line-height:1.75;color:var(--code-ink);box-shadow:inset 0 0 0 1px rgba(255,255,255,.05);position:relative}
  pre code{background:none;color:inherit;padding:0;font-size:inherit}
  .copy{position:absolute;right:9px;top:8px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);color:#d4e7e8;border-radius:7px;padding:5px 9px;font-family:var(--mono);font-size:11px;cursor:pointer}
  .copy.ok{background:var(--green);border-color:var(--green);color:#fff}
  hr{border:0;border-top:1px solid var(--line);margin:30px 0}
  footer{margin-top:56px;padding-top:22px;border-top:1px solid var(--line);color:var(--muted);font-size:13px}
  footer a{color:var(--teal-deep)}
  .totop{position:fixed;right:18px;bottom:18px;z-index:20;width:46px;height:46px;border:0;border-radius:8px;background:var(--ink);color:#fff;box-shadow:var(--shadow-lg);cursor:pointer;opacity:0;transform:translateY(12px);pointer-events:none;transition:.25s;font-size:18px}
  .totop.show{opacity:1;transform:none;pointer-events:auto}
  @media(max-width:760px){.wrap{padding:0 16px 84px}header{padding-top:46px}.progress-card{flex-wrap:wrap}.reset{margin-left:0}article h3{padding:12px 13px}}
</style>
</head>
<body>
<div class="topbar"><i id="topfill"></i></div>
<div class="wrap">
  <header>
    <span class="kicker"><span class="dot"></span>바이브코딩 특별반 · 수강생 핸즈온</span>
    <h1>코덱스 까만창 에러,<br><span class="hl">유형별로</span> 직접 고치기</h1>
    <p class="lede">블로그 자동 발행 앱이 멈췄을 때 보는 문서예요. <b>에러 메시지의 마지막 구체적인 한 줄</b>이 어느 유형인지 알려줍니다. 0장부터 순서대로, 체크하면서 따라오세요. 체크 상태는 이 폰·PC 브라우저에 저장됩니다.</p>
    <div class="chips">
      <span class="chip"><span class="miniicon"></span>에러 유형 12개</span>
      <span class="chip"><span class="miniicon coral"></span>재로그인·재설치 전에 먼저 읽기</span>
      <span class="chip"><span class="miniicon amber"></span>2026-10-04 · 챗사피엔스</span>
    </div>
    <div class="progress-card">
      <div class="ring"><svg width="64" height="64" viewBox="0 0 64 64"><circle class="bg" cx="32" cy="32" r="27" fill="none" stroke-width="6"></circle><circle id="ringfg" class="fg" cx="32" cy="32" r="27" fill="none" stroke-width="6" stroke-dasharray="169.6" stroke-dashoffset="169.6"></circle></svg><b id="ringpct">0%</b></div>
      <div><strong id="ptext">체크 0 / ${n}</strong><span>내 에러 유형에 해당하는 항목만 체크해도 됩니다</span></div>
      <button class="reset" id="resetbtn">RESET</button>
    </div>
    <nav class="quicknav" id="quicknav"></nav>
  </header>
  <article>
${body}
  </article>
  <footer>챗사피엔스 이석구 · 바이브코딩 특별반 · 근거: 앱 오류 기록 28건(2026-09-06~10-03) + 소스 대조 · 디자인: PolarisOS Web Doc v1.0</footer>
</div>
<button class="totop" id="totop" aria-label="맨 위로">↑</button>
<script>
(function(){
  const KEY='codex_handson_2026_10_04';
  const boxes=[...document.querySelectorAll('li.task input')];
  const total=boxes.length, CIRC=169.6;
  const ring=document.getElementById('ringfg'), pct=document.getElementById('ringpct'), ptext=document.getElementById('ptext'), fill=document.getElementById('topfill');
  let done=new Set();
  try{done=new Set(JSON.parse(localStorage.getItem(KEY)||'[]'));}catch(e){}
  function render(){const k=done.size;ring.style.strokeDashoffset=CIRC-(CIRC*k/total);pct.textContent=Math.round(k/total*100)+'%';ptext.textContent='체크 '+k+' / '+total;fill.style.width=(k/total*100)+'%';}
  boxes.forEach(b=>{b.checked=done.has(b.id);b.addEventListener('change',()=>{b.checked?done.add(b.id):done.delete(b.id);try{localStorage.setItem(KEY,JSON.stringify([...done]));}catch(e){}render();});});
  render();
  document.getElementById('resetbtn').addEventListener('click',()=>{if(!confirm('체크를 모두 지울까요?'))return;done.clear();boxes.forEach(b=>b.checked=false);try{localStorage.removeItem(KEY);}catch(e){}render();});
  // 빠른 이동: h3 중 "3-X." 로 시작하는 것
  const nav=document.getElementById('quicknav');
  document.querySelectorAll('article h3').forEach(h=>{const m=h.textContent.match(/^3-([A-L])\\./);if(!m)return;const a=document.createElement('a');a.href='#'+h.id;a.textContent=m[1];if(m[1]==='C')a.className='c';nav.appendChild(a);});
  const first=document.createElement('a');first.href='#'+(document.querySelector('article h2')||{}).id;first.textContent='0 시작';nav.prepend(first);
  // 코드 복사
  document.querySelectorAll('pre').forEach(p=>{const b=document.createElement('button');b.className='copy';b.textContent='복사';b.addEventListener('click',()=>{const t=p.querySelector('code')?p.querySelector('code').innerText:p.innerText;const ok=()=>{b.textContent='복사됨';b.classList.add('ok');setTimeout(()=>{b.textContent='복사';b.classList.remove('ok');},1300);};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok).catch(()=>{});}});p.appendChild(b);});
  const totop=document.getElementById('totop');
  window.addEventListener('scroll',()=>totop.classList.toggle('show',window.scrollY>520));
  totop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
})();
</script>
</body>
</html>`;
fs.writeFileSync("index.html", html);
console.log("index.html", html.length, "bytes · tasks:", n);
