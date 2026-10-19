'use strict';

/**
 * animations.js
 * Premium animation controller for the portfolio website.
 * Works alongside animations.css.
 * No external dependencies — pure browser APIs.
 */

/* ============================================================
   0. REDUCED-MOTION CHECK
   ============================================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ============================================================
   MODULE-SCOPE HELPERS (called from multiple sections below)
   ============================================================ */

/**
 * Marks .project-img containers as img-loaded once their
 * child image is fully decoded — removes the shimmer overlay.
 */
function wireImageLoadedState() {
  document.querySelectorAll('.project-img img').forEach(img => {
    const figure = img.closest('.project-img');
    if (!figure) return;

    if (img.complete && img.naturalWidth > 0) {
      figure.classList.add('img-loaded');
    } else {
      img.addEventListener('load',  () => figure.classList.add('img-loaded'), { once: true });
      img.addEventListener('error', () => figure.classList.add('img-loaded'), { once: true });
    }
  });
}


/* ============================================================
   1. INTERSECTION OBSERVER — scroll reveal engine
   ============================================================ */
if (!prefersReducedMotion) {

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Once revealed, stop observing for performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  /**
   * Queue elements for reveal once the page is ready.
   * We do this on each page activation so newly-shown
   * articles get their children wired up too.
   */
  function wireRevealElements() {

    // ── Article-level sections ──
    document.querySelectorAll('.about-text').forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });

    // ── Expertise / service cards (staggered) ──
    document.querySelectorAll('.service-list').forEach(el => {
      el.classList.add('reveal-stagger');
      revealObserver.observe(el);
    });

    // ── Timeline items (individual) ──
    document.querySelectorAll('.timeline-item').forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 80}ms`;
      revealObserver.observe(el);
    });

    // ── Timeline list vertical line ──
    document.querySelectorAll('.timeline-list').forEach(el => {
      revealObserver.observe(el);
    });

    // ── Project / cert cards ──
    document.querySelectorAll('.project-item').forEach((el, i) => {
      el.classList.add('reveal-scale');
      // stagger handled by existing active-class animation
      revealObserver.observe(el);
    });

    // ── Section headers ──
    document.querySelectorAll('.article-title').forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });

    // ── Title wrappers (career, education icons) ──
    document.querySelectorAll('.timeline .title-wrapper').forEach(el => {
      el.classList.add('reveal-left');
      revealObserver.observe(el);
    });

    // ── Contact form ──
    document.querySelectorAll('.contact-form').forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  // Run immediately for initial page load
  document.addEventListener('DOMContentLoaded', wireRevealElements);

  // Also run when navigation changes the active page
  // (we hook into nav link clicks via MutationObserver on article)
  const articleObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.target.classList.contains('active') &&
          mutation.attributeName === 'class') {
        // Small delay so the article is visible before observing
        setTimeout(wireRevealElements, 60);
      }
    });
  });

  document.querySelectorAll('[data-page]').forEach(article => {
    articleObserver.observe(article, { attributes: true });
  });

}


/* ============================================================
   2. IMAGE SHIMMER — remove shimmer class once image loads
   ============================================================ */
document.addEventListener('DOMContentLoaded', wireImageLoadedState);


/* ============================================================
   3. NAVBAR — highlight active indicator on click + scroll
   ============================================================ */
(function enhanceNavbar() {
  const navLinks = document.querySelectorAll('[data-nav-link]');

  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      // Animate a quick scale pulse on click
      this.style.transition = 'transform 120ms ease';
      this.style.transform = 'scale(0.92)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.style.transform = '';
        }, 120);
      });
    });
  });
})();


/* ============================================================
   4. SIDEBAR TOGGLE — stagger contact items on open
   ============================================================ */
(function enhanceSidebarToggle() {
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');
  const sidebar = document.querySelector('[data-sidebar]');
  if (!sidebarBtn || !sidebar) return;

  sidebarBtn.addEventListener('click', () => {
    const isOpening = sidebar.classList.contains('active');
    const contactItems = sidebar.querySelectorAll('.contact-item');
    const socialItems  = sidebar.querySelectorAll('.social-item');

    if (isOpening) {
      // Stagger-in contact items
      [...contactItems, ...socialItems].forEach((item, i) => {
        item.style.opacity   = '0';
        item.style.transform = 'translateY(10px)';
        setTimeout(() => {
          item.style.transition = `opacity 300ms ease ${i * 60}ms, transform 300ms ease ${i * 60}ms`;
          item.style.opacity   = '1';
          item.style.transform = 'translateY(0)';
        }, 40);
      });
    }
  });
})();


/* ============================================================
   5. PROJECT CARD HOVER — tilt micro-interaction (desktop)
   ============================================================ */
(function addCardTilt() {
  if (prefersReducedMotion) return;
  if (window.matchMedia('(hover: none)').matches) return; // skip touch devices

  document.querySelectorAll('.project-item > a').forEach(card => {
    const figure = card.querySelector('.project-img');
    if (!figure) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalise to [-1, 1]
      const nx = (x / rect.width  - 0.5) * 2;
      const ny = (y / rect.height - 0.5) * 2;

      // Gentle tilt — max 5°
      const tiltX =  ny * 5;
      const tiltY = -nx * 5;

      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      card.style.transition = 'transform 80ms linear, box-shadow 200ms ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 350ms ease';
    });
  });
})();


/* ============================================================
   6. SERVICE CARD HOVER — accent glow cursor follow
   ============================================================ */
(function addServiceGlow() {
  if (prefersReducedMotion) return;
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.service-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.background = `
        radial-gradient(
          160px circle at ${x}px ${y}px,
          rgba(47, 191, 113, 0.06),
          transparent 70%
        ),
        var(--bg-card)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


/* ============================================================
   7. FORM — floating label shimmer on focus
   ============================================================ */
(function enhanceFormInputs() {
  const inputs = document.querySelectorAll('.form-input');

  inputs.forEach(input => {
    const label = input.previousElementSibling;

    input.addEventListener('focus', () => {
      if (label && label.classList.contains('form-label')) {
        label.style.transition = 'color 200ms ease';
        label.style.color = 'var(--accent-highlight)';
      }
    });

    input.addEventListener('blur', () => {
      if (label && label.classList.contains('form-label')) {
        label.style.color = '';
      }
    });
  });
})();


/* ============================================================
   8. PAGE TRANSITION — scroll to top with smooth fade
      Overrides the instant scroll inside the nav handler
   ============================================================ */
(function smoothPageTransition() {
  if (prefersReducedMotion) return;

  const navLinks = document.querySelectorAll('[data-nav-link]');
  const pages    = document.querySelectorAll('[data-page]');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Find the newly active article and replay its entrance
      setTimeout(() => {
        const activePage = document.querySelector('[data-page].active');
        if (activePage) {
          // Reset animation
          activePage.style.animation = 'none';
          void activePage.offsetWidth; // reflow
          activePage.style.animation = '';

          // Scroll top
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Re-trigger image shimmer wire-up
          wireImageLoadedState();
        }
      }, 30);
    });
  });
})();


/* ============================================================
   9. AVATAR — accent ring on every page load (CSS handles it,
      but keep JS hook for any future interactivity)
   ============================================================ */
// Nothing to do here; handled entirely by CSS animations.css §5


/* ============================================================
   10. STAGGER PROJECT CARDS ON FILTER CHANGE
   ============================================================ */
(function staggerFilteredCards() {
  if (prefersReducedMotion) return;

  function restaggerCards(containerSelector) {
    const btns = document.querySelectorAll(containerSelector);
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          const visibleCards = document.querySelectorAll('.project-item.active');
          visibleCards.forEach((card, i) => {
            card.style.animationDelay = `${i * 60}ms`;
          });
        }, 10);
      });
    });
  }

  restaggerCards('[data-portfolio-filter-btn]');
  restaggerCards('[data-cert-filter-btn]');
})();
