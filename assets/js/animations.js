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
   1. INTERSECTION OBSERVER — scroll reveal engine
      Optimized for both mobile and desktop with a positive bottom
      margin so items reveal smoothly before scrolling into view.
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
    threshold: 0.04,
    rootMargin: '0px 0px 60px 0px'
  });

  /**
   * Queue elements for reveal once the page is ready.
   * We do this on each page activation so newly-shown
   * articles get their children wired up too.
   */
  function wireRevealElements() {

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

    // ── Project / cert cards are controlled by the filter system (display:none → block)
    // ── Their entrance animation (projectCardIn) fires via .project-item.active CSS rule.

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
  const articleObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.target.classList.contains('active') &&
          mutation.attributeName === 'class') {
        setTimeout(wireRevealElements, 60);
      }
    });
  });

  document.querySelectorAll('[data-page]').forEach(article => {
    articleObserver.observe(article, { attributes: true });
  });

}


/* ============================================================
   2. PROJECT CARD HOVER — tilt micro-interaction (desktop only)
   ============================================================ */
(function addCardTilt() {
  if (prefersReducedMotion) return;
  // Strict check: enable ONLY on desktop mice/fine pointers
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

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
   3. SERVICE CARD HOVER — accent glow cursor follow (desktop only)
   ============================================================ */
(function addServiceGlow() {
  if (prefersReducedMotion) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

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
   4. FORM — floating label shimmer on focus
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
   5. PAGE TRANSITION & HORIZON ALIGNMENT
      Ensure left and right columns always align on the exact same horizon
   ============================================================ */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('pageshow', () => {
  window.scrollTo(0, 0);
});

(function smoothPageTransition() {
  if (prefersReducedMotion) return;

  const navLinks = document.querySelectorAll('[data-nav-link]');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        const activePage = document.querySelector('[data-page].active');
        if (activePage) {
          activePage.style.animation = 'none';
          void activePage.offsetWidth; // reflow
          activePage.style.animation = '';

          // Reset scroll immediately so both columns align on the exact same horizon
          window.scrollTo(0, 0);
        }
      }, 30);
    });
  });
})();
