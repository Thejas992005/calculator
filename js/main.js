/* ===== CalcHub — Core JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initNavbarScroll();
  initSearch();
  initFAQ();
  initScrollAnimations();
});

/* ===== Theme Toggle ===== */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Load saved theme
  const savedTheme = localStorage.getItem('calchub-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('calchub-theme', next);
  });
}

/* ===== Mobile Menu ===== */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    links.classList.toggle('active');
  });

  // Close menu when clicking a link
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('active');
      links.classList.remove('active');
    });
  });
}

/* ===== Navbar Scroll Effect ===== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });
}

/* ===== Search Filter (Homepage) ===== */
function initSearch() {
  const searchInput = document.getElementById('calcSearch');
  const cards = document.querySelectorAll('.calc-card');
  const categoryBtns = document.querySelectorAll('.category-btn');

  if (!searchInput || cards.length === 0) return;

  // Search input filter
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    // Reset category buttons
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    const allBtn = document.querySelector('.category-btn[data-category="all"]');
    if (allBtn) allBtn.classList.add('active');

    cards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const category = (card.getAttribute('data-category') || '').toLowerCase();
      const matches = title.includes(query) || category.includes(query);
      card.style.display = matches ? '' : 'none';
      
      if (matches) {
        card.style.animation = 'fadeInUp 0.3s ease both';
      }
    });
  });

  // Category filter buttons
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      // Update active button
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Clear search
      searchInput.value = '';

      // Filter cards
      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.3s ease both';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===== FAQ Accordion ===== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => i.classList.remove('active'));

      // Open clicked if it was closed
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ===== Scroll Animations ===== */
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if (animateElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(el => observer.observe(el));
}

/* ===== Utility Functions (shared across calculators) ===== */

/**
 * Format a number with commas and optional decimal places
 */
function formatNumber(num, decimals = 2) {
  return parseFloat(num).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format as currency (Indian Rupees)
 */
function formatCurrency(num) {
  return '₹' + formatNumber(num, 2);
}

/**
 * Copy text to clipboard with visual feedback
 */
function copyToClipboard(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    if (btnElement) {
      const original = btnElement.textContent;
      btnElement.textContent = 'Copied!';
      btnElement.classList.add('copied');
      setTimeout(() => {
        btnElement.textContent = original;
        btnElement.classList.remove('copied');
      }, 2000);
    }
  });
}

/**
 * Show result section with animation
 */
function showResult(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.style.display = 'block';
    el.style.animation = 'fadeInUp 0.4s ease both';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * Validate that a value is a positive number
 */
function isValidNumber(value) {
  return !isNaN(value) && value !== '' && parseFloat(value) > 0;
}

/**
 * Show validation error on an input
 */
function showInputError(inputId, message) {
  const input = document.getElementById(inputId);
  if (input) {
    input.style.borderColor = 'var(--error)';
    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }, 3000);
  }
}
