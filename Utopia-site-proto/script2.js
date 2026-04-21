/* =============================================
   ASSERO · script2.js
   ============================================= */

'use strict';

/* ── 유틸: 요소 선택 ─────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =============================================
   1. 헤더 스크롤 효과
   ============================================= */
(function initHeader() {
  const header = $('#site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* =============================================
   2. 햄버거 메뉴 (모바일)
   ============================================= */
(function initHamburger() {
  const btn = $('#hamburger');
  const nav = $('#main-nav');

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  // 링크 클릭 시 메뉴 닫기
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });

  // 외부 클릭 시 닫기
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    }
  });
})();

/* =============================================
   3. 네비게이션 Active 하이라이트 (Scroll Spy)
   ============================================= */
(function initScrollSpy() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-60px 0px -40% 0px',
    threshold: 0
  });

  sections.forEach(s => observer.observe(s));
})();

/* =============================================
   4. 스크롤 등장 애니메이션 (Reveal)
   ============================================= */
(function initReveal() {
  // 애니메이션 대상에 클래스 추가
  const targets = $$(
    '.section-tag, .section-title, .section-lead, ' +
    '.about-grid, .board-item, .career-card, ' +
    '.contact-card, .request-form'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 5) * 0.07}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
})();

/* =============================================
   5. 숫자 카운트업 (Home Stats)
   ============================================= */
(function initCountUp() {
  const nums = $$('.stat-num[data-target]');
  if (!nums.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateNum = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNum(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(el => observer.observe(el));
})();

/* =============================================
   6. 게시판 탭 전환
   ============================================= */
(function initBoardTabs() {
  const tabs    = $$('.tab-btn');
  const panels  = $$('.board-list');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', false);
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', true);

      panels.forEach(panel => {
        const isTarget = panel.id === `tab-${target}`;
        panel.classList.toggle('hidden', !isTarget);
      });
    });
  });
})();

/* =============================================
   7. 모달
   ============================================= */
const modalData = {
  apply: {
    title: '채용 면접 신청',
    body:  '채용 면접 신청을 해주셔서 감사합니다.\n\n' +
           '담당자가 영업일 기준 3일 이내에 등록하신 연락처로 연락드립니다.\n' +
           '지원 관련 문의: asseroofiicial@aagmail.com'
  },
  tour: {
    title: '정기 견학 접수',
    body:  '사내 정기 견학 접수를 받았습니다.\n\n' +
           '견학일 1주일 전 확인 연락을 드립니다.\n' +
           '문의: asseroofiicial@aagmail.com · 123-456-7890'
  }
};

function openModal(type) {
  const overlay = $('#modal-overlay');
  const title   = $('#modal-title');
  const body    = $('#modal-body');
  const data    = modalData[type];
  if (!data) return;

  title.textContent    = data.title;
  body.style.whiteSpace = 'pre-line';
  body.textContent     = data.body;
  overlay.hidden       = false;
  document.body.style.overflow = 'hidden';

  // 포커스 접근성
  setTimeout(() => $('#modal-close').focus(), 50);
}

function closeModal() {
  const overlay = $('#modal-overlay');
  overlay.hidden = true;
  document.body.style.overflow = '';
}

(function initModal() {
  $('#modal-close').addEventListener('click', closeModal);
  $('#modal-confirm').addEventListener('click', closeModal);

  // 배경 클릭 닫기
  $('#modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // ESC 키 닫기
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$('#modal-overlay').hidden) closeModal();
  });
})();

/* =============================================
   8. 의뢰 접수 폼 유효성 검사 + 제출
   ============================================= */
(function initRequestForm() {
  const form = $('#request-form');
  if (!form) return;

  const fields = {
    'req-name':   { errorId: 'err-name',   msg: '성함을 입력해 주세요.' },
    'req-phone':  { errorId: 'err-phone',  msg: '연락처를 입력해 주세요.' },
    'req-type':   { errorId: 'err-type',   msg: '의뢰 분류를 선택해 주세요.' },
    'req-detail': { errorId: 'err-detail', msg: '상세 내용을 입력해 주세요.' },
  };

  const phoneRE = /^[0-9\-+\s]{7,20}$/;

  function validateField(id) {
    const el    = $(`#${id}`);
    const info  = fields[id];
    const errEl = $(`#${info.errorId}`);
    let msg = '';

    if (!el.value.trim()) {
      msg = info.msg;
    } else if (id === 'req-phone' && !phoneRE.test(el.value.trim())) {
      msg = '올바른 연락처 형식을 입력해 주세요. (예: 010-1234-5678)';
    } else if (id === 'req-detail' && el.value.trim().length < 10) {
      msg = '상세 내용을 10자 이상 입력해 주세요.';
    }

    errEl.textContent = msg;
    el.classList.toggle('error', !!msg);
    return !msg;
  }

  // 실시간 유효성 (blur)
  Object.keys(fields).forEach(id => {
    $(`#${id}`)?.addEventListener('blur', () => validateField(id));
    $(`#${id}`)?.addEventListener('input', () => {
      if ($(`#${id}`).classList.contains('error')) validateField(id);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const allValid = Object.keys(fields).map(id => validateField(id)).every(Boolean);
    if (!allValid) {
      // 첫 번째 에러 필드로 포커스 이동
      const firstErr = $$('.form-group input.error, .form-group select.error, .form-group textarea.error')[0];
      firstErr?.focus();
      return;
    }

    // --- 제출 성공 처리 ---
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.textContent = '처리 중...';
    submitBtn.disabled    = true;

    setTimeout(() => {
      // 알림창
      alert('✅ 의뢰가 정상적으로 접수되었습니다.\n\n담당 히어로가 빠른 시간 내에 연락드리겠습니다.\n아세로를 믿어주셔서 감사합니다.');

      // 폼 초기화
      form.reset();
      Object.keys(fields).forEach(id => {
        $(`#${id}`).classList.remove('error');
        $(`#${fields[id].errorId}`).textContent = '';
      });

      submitBtn.textContent = '의뢰 접수하기';
      submitBtn.disabled    = false;
    }, 600);
  });
})();

/* =============================================
   9. 전역 노출 (HTML onclick 용)
   ============================================= */
window.openModal  = openModal;
window.closeModal = closeModal;
