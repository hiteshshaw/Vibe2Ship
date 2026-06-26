// ═══════════════════════════════════════
//  ARMORY — Premium Interactions Engine
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initCustomCursor();
  initStickyHeader();
  initMobileMenu();
  initHeroWave();
  initTerminal();
  initTickerPause();
  initScrollReveal();
  initMetricBars();
  initWorkflowBoard();
  initBentoAccordion();
  initPricingSwitcher();
  initFaqAccordion();
  initTestimonialsDrag();
  initScrollAndNavHighlight();
  initInteractiveDemo();
});

/* =========================================================================
   1. Custom Magnetic Cursor
   ========================================================================= */
function initCustomCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let rx = 0, ry = 0; // ring position (lagged)
  let mx = 0, my = 0; // mouse position

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  // Smooth ring follow
  function animateCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* =========================================================================
   2. Sticky Header Scroll Effect
   ========================================================================= */
function initStickyHeader() {
  const header = document.querySelector('header.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.style.background    = 'rgba(7,11,13,0.96)';
      header.style.boxShadow     = '0 1px 40px rgba(0,0,0,0.3)';
      header.style.borderBottomColor = 'rgba(217,232,227,0.1)';
    } else {
      header.style.background    = 'rgba(7,11,13,0.65)';
      header.style.boxShadow     = 'none';
      header.style.borderBottomColor = 'rgba(217,232,227,0.07)';
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* =========================================================================
   3. Mobile Menu Toggle
   ========================================================================= */
function initMobileMenu() {
  const header = document.querySelector('header.site-header');
  const toggle = document.querySelector('.menu-toggle');
  if (!toggle || !header) return;

  toggle.addEventListener('click', () => {
    header.classList.toggle('nav-open');
    const path = toggle.querySelector('path');
    if (header.classList.contains('nav-open')) {
      path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    } else {
      path.setAttribute('d', 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5');
    }
  });

  // Close nav when a link is clicked on mobile
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      const path = toggle.querySelector('path');
      path.setAttribute('d', 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5');
    });
  });
}

/* =========================================================================
   4. Hero Particle Wave Canvas
   ========================================================================= */
function initHeroWave() {
  const canvas = document.getElementById('hero-wave-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  const setSize = () => {
    width  = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width  = width  * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  };
  setSize();

  const ROWS = 18, COLS = 24;
  let particles = [];
  let mouse = { x: width * 0.5, y: height * 0.5, tx: width * 0.5, ty: height * 0.5 };

  canvas.parentElement.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = e.clientX - r.left;
    mouse.ty = e.clientY - r.top;
  });

  const build = () => {
    particles = [];
    const gx = width  / (COLS - 1);
    const gy = height / (ROWS - 1);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        particles.push({
          bx: c * gx, by: r * gy,
          x: 0, y: 0,
          sz: 1.2 + (r / ROWS) * 1.8,
          gold: (r + c) % 4 === 0
        });
      }
    }
  };
  build();

  let frame = 0;
  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    frame += 0.012;

    particles.forEach(p => {
      const wx = Math.sin(p.bx * 0.007 + frame) * 30;
      const wy = Math.cos(p.by * 0.009 + frame * 1.3) * 20;
      const dx = mouse.x - p.bx;
      const dy = mouse.y - p.by;
      const dist = Math.hypot(dx, dy);
      const force = dist < 180 ? (1 - dist / 180) * 28 : 0;
      p.x = p.bx + wx * 0.2;
      p.y = p.by + wy + force;

      const alpha = Math.max(0.04, 0.8 - (p.y / height) * 0.4);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(255,200,1,${alpha * 0.65})`
        : `rgba(17,76,90,${alpha})`;
      ctx.fill();
    });

    // Grid lines
    ctx.strokeStyle = 'rgba(217,232,227,0.025)';
    ctx.lineWidth   = 0.5;
    for (let r = 0; r < ROWS; r++) {
      ctx.beginPath();
      for (let c = 0; c < COLS; c++) {
        const p = particles[r * COLS + c];
        c === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  };
  animate();

  window.addEventListener('resize', () => { setSize(); build(); }, { passive: true });
}

/* =========================================================================
   5. Terminal Typewriter
   ========================================================================= */
function initTerminal() {
  const output = document.getElementById('terminal-output');
  if (!output) return;

  const lines = [
    { text: '$ armory init --project "neural-core"', color: '#FFC801', delay: 0 },
    { text: 'Initializing agent runtime...', color: 'rgba(217,232,227,0.5)', delay: 600 },
    { text: '✓ Connected to edge node [us-east-2]', color: '#28C840', delay: 1200 },
    { text: '✓ LLM orchestrator ready [gpt-4o]', color: '#28C840', delay: 1800 },
    { text: '$ armory deploy --agent email-classifier', color: '#FFC801', delay: 2600 },
    { text: 'Compiling workflow graph...', color: 'rgba(217,232,227,0.5)', delay: 3200 },
    { text: '✓ 5 nodes compiled, 3 hooks registered', color: '#28C840', delay: 3800 },
    { text: '✓ Agent deployed at armory.run/api/v1', color: '#28C840', delay: 4400 },
    { text: '$ armory status', color: '#FFC801', delay: 5200 },
    { text: '  ► Throughput:  10,482 req/s', color: 'rgba(217,232,227,0.6)', delay: 5800 },
    { text: '  ► Latency p99: 11.8ms', color: 'rgba(217,232,227,0.6)', delay: 6200 },
    { text: '  ► Token eff:   99.2%', color: '#FF9932', delay: 6600 },
  ];

  const typeChar = (el, text, color, idx, cb) => {
    if (idx >= text.length) { cb && cb(); return; }
    el.innerHTML += `<span style="color:${color}">${text[idx] === ' ' ? '&nbsp;' : text[idx]}</span>`;
    setTimeout(() => typeChar(el, text, color, idx + 1, cb), 28 + Math.random() * 22);
  };

  const renderLine = (lineIdx) => {
    if (lineIdx >= lines.length) return;
    const { text, color, delay } = lines[lineIdx];

    setTimeout(() => {
      const row = document.createElement('div');
      output.appendChild(row);
      typeChar(row, text, color, 0, () => {
        output.appendChild(document.createElement('br'));
        output.scrollTop = output.scrollHeight;
        renderLine(lineIdx + 1);
      });
    }, lineIdx === 0 ? delay + 800 : delay - (lines[lineIdx - 1]?.delay ?? 0));
  };

  renderLine(0);
}

/* =========================================================================
   6. Ticker Tape — pause on hover
   ========================================================================= */
function initTickerPause() {
  const inner = document.getElementById('ticker-inner');
  if (!inner) return;

  inner.addEventListener('mouseenter', () => { inner.style.animationPlayState = 'paused'; });
  inner.addEventListener('mouseleave', () => { inner.style.animationPlayState = 'running'; });
}

/* =========================================================================
   7. Scroll Reveal Observer
   ========================================================================= */
function initScrollReveal() {
  // Add reveal class to sections
  const targets = document.querySelectorAll(
    '.metric-row, .project-item, .bento-node, .testimonial-card, .pricing-card, .faq-item, .hero-proof, .metrics-header, .projects-head, .canvas-header, .bento-header, .testimonials-header, .pricing-header, .faq-text, .cta-inner'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* =========================================================================
   8. Animate Metric Bars on Scroll
   ========================================================================= */
function initMetricBars() {
  const bars = document.querySelectorAll('.metric-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(b => observer.observe(b));
}

/* =========================================================================
   9. Workflow Board Interactions
   ========================================================================= */
function initWorkflowBoard() {
  const board = document.querySelector('.workflow-board');
  const panelBtns = document.querySelectorAll('.panel-btn');
  const nodes = document.querySelectorAll('.wf-node');
  if (!board) return;

  panelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      panelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      board.style.backgroundImage = 'radial-gradient(rgba(255,200,1,0.07) 1.5px, transparent 1.5px)';
      setTimeout(() => {
        board.style.backgroundImage = 'radial-gradient(rgba(217,232,227,0.04) 1.5px, transparent 1.5px)';
      }, 300);
    });
  });

  nodes.forEach(node => {
    node.addEventListener('mousedown', () => {
      node.style.cursor       = 'grabbing';
      node.style.borderColor  = 'var(--color-deep-saffron)';
    });
    node.addEventListener('mouseup', () => {
      node.style.cursor       = 'grab';
      node.style.borderColor  = '';
    });
  });
}

/* =========================================================================
   10. Feature 2: Bento-to-Accordion (Context Lock)
   ========================================================================= */
let activeFeatureIndex = 0;

function initBentoAccordion() {
  const bentoNodes    = document.querySelectorAll('.bento-node');
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!bentoNodes.length || !accordionItems.length) return;

  updateBentoActiveState(activeFeatureIndex);
  updateAccordionActiveState(activeFeatureIndex);

  bentoNodes.forEach((node, index) => {
    node.addEventListener('mouseenter', () => {
      activeFeatureIndex = index;
      updateBentoActiveState(activeFeatureIndex);
    });
    node.addEventListener('focus', () => {
      activeFeatureIndex = index;
      updateBentoActiveState(activeFeatureIndex);
    });
  });

  accordionItems.forEach((item, index) => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      if (item.classList.contains('expanded')) {
        closeAccordionItem(item);
      } else {
        activeFeatureIndex = index;
        updateAccordionActiveState(activeFeatureIndex);
      }
    });
  });

  // Context Lock — viewport transition
  let isMobile = window.innerWidth <= 768;
  window.addEventListener('resize', () => {
    const nowMobile = window.innerWidth <= 768;
    if (nowMobile !== isMobile) {
      isMobile = nowMobile;
      if (isMobile) {
        updateAccordionActiveState(activeFeatureIndex);
      } else {
        updateBentoActiveState(activeFeatureIndex);
      }
    }
  }, { passive: true });
}

function updateBentoActiveState(idx) {
  document.querySelectorAll('.bento-node').forEach((node, i) => {
    if (i === idx) {
      node.classList.add('active');
      node.style.borderColor = 'rgba(255,200,1,0.35)';
      node.style.boxShadow   = '0 10px 40px rgba(255,200,1,0.06)';
      // Restart gauge
      const p = node.querySelector('.dial-progress, .semi-progress');
      if (p) {
        p.style.transition       = 'none';
        const isDial = p.classList.contains('dial-progress');
        p.style.strokeDashoffset = isDial ? '377' : '251.2';
        setTimeout(() => {
          p.style.transition       = 'stroke-dashoffset 900ms var(--ease-snap)';
          p.style.strokeDashoffset = isDial ? '75' : '62.8';
        }, 50);
      }
    } else {
      node.classList.remove('active');
      node.style.borderColor = '';
      node.style.boxShadow   = '';
    }
  });
}

function updateAccordionActiveState(idx) {
  document.querySelectorAll('.accordion-item').forEach((item, i) => {
    i === idx ? expandAccordionItem(item) : closeAccordionItem(item);
  });
}

function expandAccordionItem(item) {
  item.classList.add('expanded');
  const content = item.querySelector('.accordion-content');
  const body    = item.querySelector('.accordion-body');
  content.style.maxHeight = body.offsetHeight + 'px';
}

function closeAccordionItem(item) {
  item.classList.remove('expanded');
  item.querySelector('.accordion-content').style.maxHeight = '0px';
}

/* =========================================================================
   11. Feature 1: Dynamic Pricing Matrix (Zero Re-render)
   ========================================================================= */
const PRICING_MATRIX = {
  baseRates: { starter: 49, pro: 99, enterprise: 249 },
  currencies: {
    USD: { symbol: '$', rate: 1.0 },
    EUR: { symbol: '€', rate: 0.9 },
    INR: { symbol: '₹', rate: 80.0 }
  },
  discount: { annual: 0.8 }
};

let currentCurrency = 'USD';
let currentCycle    = 'monthly';

function initPricingSwitcher() {
  const toggleTrack       = document.getElementById('billing-toggle');
  const monthlyLabel      = document.getElementById('billing-monthly');
  const annualLabel       = document.getElementById('billing-annual');
  const currencyTrigger   = document.getElementById('currency-trigger');
  const currencyDropdown  = document.getElementById('currency-dropdown');
  const currencyOptions   = document.querySelectorAll('.currency-option');
  if (!toggleTrack) return;

  const toggleBilling = () => {
    currentCycle = currentCycle === 'monthly' ? 'annual' : 'monthly';
    const isAnnual = currentCycle === 'annual';
    toggleTrack.classList.toggle('active', isAnnual);
    annualLabel.classList.toggle('active', isAnnual);
    monthlyLabel.classList.toggle('active', !isAnnual);
    calculateAndRenderPrices();
  };

  toggleTrack.addEventListener('click', toggleBilling);
  monthlyLabel.addEventListener('click', () => { if (currentCycle !== 'monthly') toggleBilling(); });
  annualLabel.addEventListener('click',  () => { if (currentCycle !== 'annual')  toggleBilling(); });

  currencyTrigger.addEventListener('click', e => {
    e.stopPropagation();
    currencyTrigger.classList.toggle('open');
    currencyDropdown.classList.toggle('open');
    currencyTrigger.setAttribute('aria-expanded', currencyDropdown.classList.contains('open'));
  });

  document.addEventListener('click', () => {
    currencyTrigger.classList.remove('open');
    currencyDropdown.classList.remove('open');
    currencyTrigger.setAttribute('aria-expanded', 'false');
  });

  currencyOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      currentCurrency = opt.dataset.currency;
      currencyTrigger.querySelector('span').textContent = currentCurrency;
      calculateAndRenderPrices();
    });
  });

  calculateAndRenderPrices();
}

function calculateAndRenderPrices() {
  const isAnnual  = currentCycle === 'annual';
  const meta      = PRICING_MATRIX.currencies[currentCurrency];
  const discount  = isAnnual ? PRICING_MATRIX.discount.annual : 1;
  const period    = isAnnual ? '/yr' : '/mo';

  ['starter', 'pro', 'enterprise'].forEach(tier => {
    const price = Math.round(PRICING_MATRIX.baseRates[tier] * meta.rate * discount);
    const numEl    = document.getElementById(`price-num-${tier}`);
    const symEl    = document.getElementById(`price-sym-${tier}`);
    const periodEl = document.getElementById(`price-period-${tier}`);

    if (numEl)    numEl.textContent    = price.toLocaleString();
    if (symEl)    symEl.textContent    = meta.symbol;
    if (periodEl) periodEl.textContent = period;
  });
}

/* =========================================================================
   12. FAQ Accordion
   ========================================================================= */
function initFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('expanded');
      document.querySelectorAll('.faq-item').forEach(fi => {
        fi.classList.remove('expanded');
        fi.querySelector('.faq-content').style.maxHeight = '0px';
        fi.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('expanded');
        trigger.setAttribute('aria-expanded', 'true');
        const p = content.querySelector('p');
        content.style.maxHeight = p.offsetHeight + 20 + 'px';
      }
    });
  });
}

/* =========================================================================
   13. Testimonials Drag Scroll
   ========================================================================= */
function initTestimonialsDrag() {
  const wrap = document.querySelector('.testimonials-scroll-wrap');
  if (!wrap) return;

  let isDown = false, startX, scrollLeft;

  wrap.addEventListener('mousedown', e => {
    isDown = true;
    wrap.style.cursor = 'grabbing';
    startX     = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
  });
  wrap.addEventListener('mouseleave', () => { isDown = false; wrap.style.cursor = 'grab'; });
  wrap.addEventListener('mouseup',    () => { isDown = false; wrap.style.cursor = 'grab'; });
  wrap.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - wrap.offsetLeft;
    const walk = (x - startX) * 1.4;
    wrap.scrollLeft = scrollLeft - walk;
  });
}

/* =========================================================================
   14. Terminal Boot Loader
   ========================================================================= */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  const logsEl = document.getElementById('loader-logs');
  const bar = document.getElementById('loader-progress-bar');
  const pctText = document.getElementById('loader-pct');
  
  if (!loader || !logsEl || !bar || !pctText) return;

  const bootMessages = [
    '[sys] booting neural core matrix v2.4...',
    '[sys] initializing parallel core clusters...',
    '[sys] establishing secure handshake with edge nodes...',
    '[sys] syncing context-lock observers...',
    '[sys] caching canvas particle coordinates...',
    '[sys] compiling matrix pricing calculations...',
    '[sys] diagnostic self-check: OK',
    '[sys] armory neural graph online.'
  ];

  let currentMsgIndex = 0;
  let progress = 0;

  // Preload walkthrough frames in background
  WALKTHROUGH_FRAMES.forEach(frame => {
    const img = new Image();
    img.src = 'frames/' + frame.name;
  });

  const printNextMessage = () => {
    if (currentMsgIndex < bootMessages.length) {
      const p = document.createElement('div');
      p.className = 'log-line';
      p.textContent = bootMessages[currentMsgIndex];
      logsEl.appendChild(p);
      logsEl.scrollTop = logsEl.scrollHeight;
      currentMsgIndex++;
      setTimeout(printNextMessage, 150 + Math.random() * 100);
    }
  };
  
  printNextMessage();

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      bar.style.width = '100%';
      pctText.textContent = '100%';

      // Let it settle for a moment
      setTimeout(() => {
        loader.classList.add('loaded');
        document.body.classList.add('loader-finished');
        
        // Remove loader from DOM entirely after animation completes to avoid layout layer overhead
        setTimeout(() => {
          loader.remove();
        }, 800);
      }, 350);
    } else {
      bar.style.width = progress + '%';
      pctText.textContent = progress + '%';
    }
  }, 60);
}

/* =========================================================================
   15. Scroll Progress & Active Nav Link Highlight
   ========================================================================= */
function initScrollAndNavHighlight() {
  const progressBar = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    if (progressBar) {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    }
  }, { passive: true });

  // IntersectionObserver to highlight current active nav item
  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href').substring(1);
          if (href === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* =========================================================================
   16. Interactive Platform Walkthrough Player
   ========================================================================= */
const WALKTHROUGH_FRAMES = [
  { name: 'frame_05s.png', time: '00:05s', log: '[init] Launching Armory workflow node agent...' },
  { name: 'frame_15s.png', time: '00:15s', log: '[sync] Hooking telemetry event pipelines...' },
  { name: 'frame_20s.png', time: '00:20s', log: '[auth] Negotiating security handshake with GPT-4o edge cluster...' },
  { name: 'frame_30s.png', time: '00:30s', log: '[sys] Allocating 12 cores for parallel data ingestion...' },
  { name: 'frame_40s.png', time: '00:40s', log: '[db] Querying Postgres cache - latency 1.2ms...' },
  { name: 'frame_45s.png', time: '00:45s', log: '[neural] Vectorizing input streams - 4,892 tokens...' },
  { name: 'frame_50s.png', time: '00:50s', log: '[agent] Spawning sub-agent email-classifier-node...' },
  { name: 'frame_60s.png', time: '00:60s', log: '[proc] Classifying 24 payload objects...' },
  { name: 'frame_65s.png', time: '00:65s', log: '[agent] Sentiment analysis threshold: 98.7% positive...' },
  { name: 'frame_75s.png', time: '00:75s', log: '[sync] Writing transaction state metadata block...' },
  { name: 'frame_80s.png', time: '00:80s', log: '[db] DB write sync active - connection secure...' },
  { name: 'frame_81s.png', time: '00:81s', log: '[web] Sending webhooks to Telegram client node...' },
  { name: 'frame_82s.png', time: '00:82s', log: '[web] Telegram Sync: OK 200...' },
  { name: 'frame_83s.png', time: '00:83s', log: '[sys] Releasing resources from sandbox pool...' },
  { name: 'frame_84s.png', time: '00:84s', log: '[sync] Closing workflow execution window...' },
  { name: 'frame_85s.png', time: '00:85s', log: '[sys] Total execution time: 142ms...' },
  { name: 'frame_90s.png', time: '00:90s', log: '[sys] Memory footprint: 18.4MB (optimized)...' },
  { name: 'frame_95s.png', time: '00:95s', log: '[metrics] Telemetry metrics pushed to live dashboard...' },
  { name: 'frame_105s.png', time: '01:05s', log: '[idle] Workflow completed. System idling [ready]...' }
];

function initInteractiveDemo() {
  const frameImg = document.getElementById('demo-frame');
  const filenameEl = document.getElementById('viewport-filename');
  const timeEl = document.getElementById('tel-time');
  const logsEl = document.getElementById('tel-logs');
  const slider = document.getElementById('demo-slider');
  const playBtn = document.getElementById('btn-play');
  const playSvg = document.getElementById('play-svg');

  if (!frameImg || !slider || !playBtn) return;

  let currentIndex = 0;
  let isPlaying = false;
  let playInterval = null;

  const updateDemoState = (index) => {
    currentIndex = index;
    const frame = WALKTHROUGH_FRAMES[currentIndex];

    // Update viewport elements
    frameImg.style.opacity = '0.5';
    setTimeout(() => {
      frameImg.src = 'frames/' + frame.name;
      frameImg.style.opacity = '1';
    }, 50);

    filenameEl.textContent = frame.name;
    timeEl.textContent = frame.time;
    slider.value = currentIndex;

    // Update log box with active trace history
    logsEl.innerHTML = '';
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : WALKTHROUGH_FRAMES.length - 1;
    const prevFrame = WALKTHROUGH_FRAMES[prevIndex];
    
    const prevLog = document.createElement('div');
    prevLog.className = 'log-line text-muted';
    prevLog.textContent = prevFrame.log;
    logsEl.appendChild(prevLog);

    const activeLog = document.createElement('div');
    activeLog.className = 'log-line log-line--active';
    activeLog.textContent = frame.log;
    logsEl.appendChild(activeLog);
  };

  const startPlayback = () => {
    isPlaying = true;
    playSvg.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; // Pause icon SVG
    playBtn.style.background = 'var(--color-deep-saffron)';
    playInterval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % WALKTHROUGH_FRAMES.length;
      updateDemoState(nextIndex);
    }, 1200);
  };

  const stopPlayback = () => {
    isPlaying = false;
    playSvg.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon SVG
    playBtn.style.background = '';
    clearInterval(playInterval);
  };

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  });

  slider.addEventListener('input', (e) => {
    if (isPlaying) stopPlayback();
    updateDemoState(parseInt(e.target.value, 10));
  });

  // Initial State Setup
  updateDemoState(0);
}

