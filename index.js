// Premium Logic for Armory AI Data Automation Landing Page

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initHeroWave();
  initWorkflowBoard();
  initBentoAccordion();
  initPricingSwitcher();
  initFaqAccordion();
});

/* =========================================================================
   1. Sticky Header Scroll Effect
   ========================================================================= */
function initStickyHeader() {
  const header = document.querySelector('header.site-header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.background = 'rgba(11, 19, 23, 0.95)';
      header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
    } else {
      header.style.background = 'rgba(11, 19, 23, 0.7)';
      header.style.boxShadow = 'none';
    }
  });
}

/* =========================================================================
   2. Mobile Menu Toggle
   ========================================================================= */
function initMobileMenu() {
  const header = document.querySelector('header.site-header');
  const toggle = document.querySelector('.menu-toggle');
  if (!toggle || !header) return;
  
  toggle.addEventListener('click', () => {
    header.classList.toggle('nav-open');
    // Change menu icon between hamburger and x-mark
    const path = toggle.querySelector('path');
    if (header.classList.contains('nav-open')) {
      path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    } else {
      path.setAttribute('d', 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5');
    }
  });
}

/* =========================================================================
   3. Interactive Canvas Particle Wave (Hero Section)
   ========================================================================= */
function initHeroWave() {
  const canvas = document.getElementById('hero-wave-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationId;
  
  // Set dimensions
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  // Wave configuration
  const rows = 20;
  const cols = 28;
  const gapX = width / (cols - 1);
  const gapY = height / (rows - 1);
  
  let particles = [];
  
  // Mouse coordinates
  let mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5 };
  
  // Track mouse movements relative to the canvas
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
  });
  
  // Generate particle grid
  function generateParticles() {
    particles = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        particles.push({
          x: c * gapX,
          y: r * gapY,
          baseX: c * gapX,
          baseY: r * gapY,
          size: 1.5 + (r / rows) * 2,
          color: r % 2 === 0 ? '#FFC801' : '#114C5A'
        });
      }
    }
  }
  
  generateParticles();
  
  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Smooth mouse coordinates
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;
    
    frame += 0.015;
    
    particles.forEach((p) => {
      // Modulate height using a compound sine wave (digital wave effect)
      const waveX = Math.sin(p.baseX * 0.006 + frame) * 35;
      const waveY = Math.cos(p.baseY * 0.008 + frame * 1.2) * 25;
      
      // Calculate mouse proximity effect
      const dx = mouse.x - p.baseX;
      const dy = mouse.y - p.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;
      let force = 0;
      
      if (dist < maxDist) {
        force = (1 - dist / maxDist) * 30; // Push particles away from mouse
      }
      
      // Draw connecting lines (mesh structure)
      p.x = p.baseX + waveX * 0.2;
      p.y = p.baseY + waveY + force;
      
      // Particle drawing
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      // Fade particles as they get closer to the top or sides
      const alpha = Math.max(0.05, 1 - (p.y / height) * 0.5);
      ctx.fillStyle = p.color === '#FFC801' ? `rgba(255, 200, 1, ${alpha * 0.7})` : `rgba(17, 76, 90, ${alpha})`;
      ctx.fill();
    });
    
    // Draw horizontal connecting lines for a grid appearance
    ctx.strokeStyle = 'rgba(217, 232, 227, 0.03)';
    ctx.lineWidth = 0.5;
    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (c === 0) {
          ctx.moveTo(particles[idx].x, particles[idx].y);
        } else {
          ctx.lineTo(particles[idx].x, particles[idx].y);
        }
      }
      ctx.stroke();
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    generateParticles();
  });
}

/* =========================================================================
   4. Workflow Builder Canvas Interactions
   ========================================================================= */
function initWorkflowBoard() {
  const board = document.querySelector('.workflow-board');
  const panelBtns = document.querySelectorAll('.panel-btn');
  const nodes = document.querySelectorAll('.wf-node');
  
  if (!board) return;
  
  // Node filter simulation
  panelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      panelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      // Pulse board grid on mode toggle
      board.style.backgroundImage = 'radial-gradient(rgba(255, 200, 1, 0.08) 1.5px, transparent 1.5px)';
      setTimeout(() => {
        board.style.backgroundImage = 'radial-gradient(rgba(217, 232, 227, 0.05) 1.5px, transparent 1.5px)';
      }, 300);
    });
  });
  
  // Simple dragging animation representation
  nodes.forEach(node => {
    node.addEventListener('mousedown', (e) => {
      node.style.cursor = 'grabbing';
      node.style.borderColor = '#FF9932';
    });
    
    node.addEventListener('mouseup', () => {
      node.style.cursor = 'grab';
      node.style.borderColor = 'rgba(217, 232, 227, 0.1)';
    });
  });
}

/* =========================================================================
   5. Feature 2: Bento-to-Accordion Reflow with Context Lock
   ========================================================================= */
// Global tracking of the active feature index
let activeFeatureIndex = 0;

function initBentoAccordion() {
  const bentoNodes = document.querySelectorAll('.bento-node');
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  if (bentoNodes.length === 0 || accordionItems.length === 0) return;
  
  // Set default initial active states
  updateBentoActiveState(activeFeatureIndex);
  updateAccordionActiveState(activeFeatureIndex);
  
  // Desktop Bento nodes hover triggers
  bentoNodes.forEach((node, index) => {
    node.addEventListener('mouseenter', () => {
      activeFeatureIndex = index;
      updateBentoActiveState(activeFeatureIndex);
    });
    
    // Add focus listener for accessibility
    node.addEventListener('focus', () => {
      activeFeatureIndex = index;
      updateBentoActiveState(activeFeatureIndex);
    });
  });
  
  // Mobile Accordion items click triggers
  accordionItems.forEach((item, index) => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      if (item.classList.contains('expanded')) {
        // Collapsing currently open item
        closeAccordionItem(item);
      } else {
        // Expanding new item, collapsing others
        activeFeatureIndex = index;
        updateAccordionActiveState(activeFeatureIndex);
      }
    });
  });
  
  // THE CONTEXT LOCK: Window Resize Observer to transfer index context programmatically
  let isMobileViewport = window.innerWidth <= 768;
  
  window.addEventListener('resize', () => {
    const currentIsMobile = window.innerWidth <= 768;
    
    // Check if we crossed the breakpoint
    if (currentIsMobile !== isMobileViewport) {
      isMobileViewport = currentIsMobile;
      
      if (isMobileViewport) {
        // Transitioned to mobile: Open the accordion item matching the active index
        updateAccordionActiveState(activeFeatureIndex);
      } else {
        // Transitioned to desktop: Apply active class to bento card matching active index
        updateBentoActiveState(activeFeatureIndex);
      }
    }
  });
}

function updateBentoActiveState(activeIndex) {
  const bentoNodes = document.querySelectorAll('.bento-node');
  bentoNodes.forEach((node, idx) => {
    if (idx === activeIndex) {
      node.classList.add('active');
      node.style.borderColor = 'var(--color-forsythia)';
      node.style.boxShadow = '0 10px 30px rgba(255, 200, 1, 0.05)';
      
      // Trigger SVG gauge/bar animations by resetting state properties
      const progress = node.querySelector('.dial-progress, .semi-progress');
      if (progress) {
        // Simple class kick to restart SVG stroke animations
        progress.style.transition = 'none';
        if (progress.classList.contains('dial-progress')) {
          progress.style.strokeDashoffset = '377';
          setTimeout(() => {
            progress.style.transition = 'stroke-dashoffset 800ms var(--ease-micro)';
            progress.style.strokeDashoffset = '75';
          }, 50);
        } else {
          progress.style.strokeDashoffset = '251.2';
          setTimeout(() => {
            progress.style.transition = 'stroke-dashoffset 800ms var(--ease-micro)';
            progress.style.strokeDashoffset = '62.8';
          }, 50);
        }
      }
    } else {
      node.classList.remove('active');
      node.style.borderColor = 'var(--border-subtle)';
      node.style.boxShadow = 'none';
    }
  });
}

function updateAccordionActiveState(activeIndex) {
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach((item, idx) => {
    if (idx === activeIndex) {
      expandAccordionItem(item);
    } else {
      closeAccordionItem(item);
    }
  });
}

function expandAccordionItem(item) {
  item.classList.add('expanded');
  const content = item.querySelector('.accordion-content');
  const body = item.querySelector('.accordion-body');
  content.style.maxHeight = body.offsetHeight + 'px';
}

function closeAccordionItem(item) {
  item.classList.remove('expanded');
  const content = item.querySelector('.accordion-content');
  content.style.maxHeight = '0px';
}

/* =========================================================================
   6. Feature 1: Dynamic Pricing Matrix & Isolated Updates
   ========================================================================= */
// Multi-dimensional configuration object factorizing rates, currencies, and discounts
const PRICING_MATRIX = {
  baseRates: {
    starter: 49,
    pro: 99,
    enterprise: 249
  },
  currencies: {
    USD: { symbol: '$', rate: 1.0 },
    EUR: { symbol: '€', rate: 0.9 },
    INR: { symbol: '₹', rate: 80.0 }
  },
  discount: {
    annual: 0.8 // flat 20% discount
  }
};

let currentCurrency = 'USD';
let currentCycle = 'monthly';

function initPricingSwitcher() {
  const toggleTrack = document.getElementById('billing-toggle');
  const monthlyLabel = document.getElementById('billing-monthly');
  const annualLabel = document.getElementById('billing-annual');
  const currencyTrigger = document.getElementById('currency-trigger');
  const currencyDropdown = document.getElementById('currency-dropdown');
  const currencyOptions = document.querySelectorAll('.currency-option');
  
  if (!toggleTrack) return;
  
  // Billing cycle toggles
  function toggleBillingCycle() {
    currentCycle = currentCycle === 'monthly' ? 'annual' : 'monthly';
    
    if (currentCycle === 'annual') {
      toggleTrack.classList.add('active');
      annualLabel.classList.add('active');
      monthlyLabel.classList.remove('active');
    } else {
      toggleTrack.classList.remove('active');
      annualLabel.classList.remove('active');
      monthlyLabel.classList.add('active');
    }
    
    calculateAndRenderPrices();
  }
  
  toggleTrack.addEventListener('click', toggleBillingCycle);
  monthlyLabel.addEventListener('click', () => { if (currentCycle !== 'monthly') toggleBillingCycle(); });
  annualLabel.addEventListener('click', () => { if (currentCycle !== 'annual') toggleBillingCycle(); });
  
  // Currency dropdown open/close
  currencyTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    currencyTrigger.classList.toggle('open');
    currencyDropdown.classList.toggle('open');
  });
  
  // Close dropdown on click outside
  document.addEventListener('click', () => {
    currencyTrigger.classList.remove('open');
    currencyDropdown.classList.remove('open');
  });
  
  // Select currency option
  currencyOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const selectedCurr = opt.dataset.currency;
      currentCurrency = selectedCurr;
      
      // Update trigger label text node
      const currentSelectedTextNode = currencyTrigger.querySelector('span');
      if (currentSelectedTextNode) {
        currentSelectedTextNode.textContent = selectedCurr;
      }
      
      calculateAndRenderPrices();
    });
  });
  
  // Initial price rendering
  calculateAndRenderPrices();
}

/**
 * Performance-Isolated Price Update:
 * Factors base tier, exchange rates, and annual discount multiplier dynamically.
 * Zero global re-renders or surrounding layout flow updates. Updates targeted text nodes only.
 */
function calculateAndRenderPrices() {
  const isAnnual = currentCycle === 'annual';
  const currencyMeta = PRICING_MATRIX.currencies[currentCurrency];
  const symbol = currencyMeta.symbol;
  const multiplier = currencyMeta.rate;
  const discount = isAnnual ? PRICING_MATRIX.discount.annual : 1.0;
  
  const tiers = ['starter', 'pro', 'enterprise'];
  
  tiers.forEach(tier => {
    const baseVal = PRICING_MATRIX.baseRates[tier];
    // Formula factoring base rate, exchange rate, and annual discount
    const calculatedPrice = Math.round(baseVal * multiplier * discount);
    
    // Performance-isolated DOM element updates
    const numEl = document.getElementById(`price-num-${tier}`);
    const symEl = document.getElementById(`price-sym-${tier}`);
    const periodEl = document.getElementById(`price-period-${tier}`);
    
    if (numEl) {
      // Modifies the exact text content of the price node in place
      numEl.textContent = calculatedPrice.toLocaleString();
    }
    
    if (symEl) {
      symEl.textContent = symbol;
    }
    
    if (periodEl) {
      periodEl.textContent = isAnnual ? '/yr' : '/mo';
    }
  });
}

/* =========================================================================
   7. FAQ Accordion Logic
   ========================================================================= */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    
    trigger.addEventListener('click', () => {
      const isExpanded = item.classList.contains('expanded');
      
      // Collapse all FAQ items first
      faqItems.forEach(fit => {
        fit.classList.remove('expanded');
        fit.querySelector('.faq-content').style.maxHeight = '0px';
      });
      
      if (!isExpanded) {
        item.classList.add('expanded');
        const paragraph = content.querySelector('p');
        content.style.maxHeight = paragraph.offsetHeight + 20 + 'px'; // add pad space
      }
    });
  });
}
