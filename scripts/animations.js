/* =========================================================
   Sri Sri Wellbeing — GSAP + ScrollTrigger motion
   Calm, botanical pacing: things settle rather than snap.
   ========================================================= */

(function () {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Respect reduced-motion: leave everything in its natural, visible state.
  if (reduced) {
    document.documentElement.classList.remove('js-anim');
    return;
  }

  // Signals to CSS that JS will handle reveal, so pre-states can hide safely.
  document.documentElement.classList.add('js-anim');

  var EASE = 'power3.out';

  /* ---------- HERO ---------- */
  // Curtain-up: headline lines, copy, then button — while the image
  // settles from a gentle scale so the wave edge feels like it "breathes".
  var heroTl = gsap.timeline({ defaults: { ease: EASE } });

  heroTl
    .from('.hero-image', { scale: 1.12, duration: 1.8, ease: 'power2.out' })
    .from('.hero-copy h1', { y: 46, opacity: 0, duration: 1.1 }, 0.25)
    .from('.hero-copy p', { y: 26, opacity: 0, duration: 0.9 }, 0.55)
    .from('.hero-button', { y: 20, opacity: 0, duration: 0.8 }, 0.75)
    .from('.site-header .logo, .primary-nav', { y: -14, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.1);

  // Slow parallax drift on the hero photograph as the page scrolls away.
  gsap.to('.hero-image', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  /* ---------- INTRO ---------- */
  gsap.from('.leaf-divider', {
    scale: 0.7,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)',
    scrollTrigger: { trigger: '.intro', start: 'top 78%', once: true }
  });

  gsap.from(['.intro-title', '.seed-rule', '.intro-text'], {
    y: 32,
    opacity: 0,
    duration: 0.9,
    stagger: 0.14,
    ease: EASE,
    scrollTrigger: { trigger: '.intro', start: 'top 72%', once: true }
  });

  /* ---------- TREATMENT CARDS ---------- */
  // Staggered rise; each card also gets a subtle inner image push
  // so the photograph lags a beat behind its frame.
  gsap.from('.treatment-card', {
    y: 64,
    opacity: 0,
    duration: 1,
    stagger: 0.16,
    ease: EASE,
    clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.card-grid', start: 'top 80%', once: true }
  });

  gsap.utils.toArray('.treatment-card img').forEach(function (img) {
    gsap.fromTo(img,
      { scale: 1.16 },
      {
        scale: 1,
        duration: 1.4,
        ease: 'power2.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: img, start: 'top 88%', once: true }
      }
    );
  });

  /* ---------- PERSONALISED JOURNEY ---------- */
  gsap.from('.journey-copy h2, .journey-copy .heading-rule', {
    y: 38,
    opacity: 0,
    duration: 0.95,
    stagger: 0.12,
    ease: EASE,
    scrollTrigger: { trigger: '.journey', start: 'top 72%', once: true }
  });

  // Steps cascade in, each badge popping slightly ahead of its text.
  gsap.utils.toArray('.steps li').forEach(function (item, i) {
    var tl = gsap.timeline({
      scrollTrigger: { trigger: item, start: 'top 86%', once: true }
    });
    tl.from(item.querySelector('.step-num'), {
      scale: 0.4, opacity: 0, duration: 0.55, ease: 'back.out(2)'
    })
      .from(item.querySelector('.step-text'), {
        x: 24, opacity: 0, duration: 0.6, ease: EASE
      }, 0.1);
  });

  // The arch image rises and un-scales, so the dome shape reveals itself.
  gsap.from('.journey-figure', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: EASE,
    scrollTrigger: { trigger: '.journey-figure', start: 'top 82%', once: true }
  });

  gsap.fromTo('.arch-image',
    { scale: 1.18 },
    {
      scale: 1,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.journey-figure', start: 'top 84%', once: true }
    }
  );

  /* ---------- TESTIMONIALS ---------- */
  gsap.from('.testimonials-head > *', {
    y: 28,
    opacity: 0,
    duration: 0.85,
    stagger: 0.12,
    ease: EASE,
    scrollTrigger: { trigger: '.testimonials', start: 'top 76%', once: true }
  });

  // Cards lift in sequence; the quote mark fades a beat later so the
  // eye lands on the words first.
  gsap.from('.testimonial', {
    y: 56,
    opacity: 0,
    duration: 0.95,
    stagger: 0.15,
    ease: EASE,
    scrollTrigger: { trigger: '.testimonial-grid', start: 'top 82%', once: true }
  });

  gsap.from('.testimonial .quote-mark', {
    scale: 0.6,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: 'back.out(1.8)',
    scrollTrigger: { trigger: '.testimonial-grid', start: 'top 78%', once: true }
  });

  /* ---------- TRUST ---------- */
  gsap.from('.trust-head > *', {
    y: 26,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: EASE,
    scrollTrigger: { trigger: '.trust', start: 'top 78%', once: true }
  });

  gsap.from('.trust-stats li', {
    y: 26,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: EASE,
    clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.trust-stats', start: 'top 85%', once: true }
  });

  gsap.from('.trust-mark', {
    y: 18,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: EASE,
    clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.trust-marks', start: 'top 90%', once: true }
  });

  /* ---------- FAQ ---------- */
  gsap.from('.faq-head > *', {
    y: 28,
    opacity: 0,
    duration: 0.85,
    stagger: 0.12,
    ease: EASE,
    scrollTrigger: { trigger: '.faq', start: 'top 76%', once: true }
  });

  gsap.from('.faq-item', {
    y: 34,
    opacity: 0,
    duration: 0.7,
    stagger: 0.09,
    ease: EASE,
    clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.faq-list', start: 'top 82%', once: true }
  });

  /* ---------- STAY & CTA ---------- */
  gsap.from('.stay-figure', {
    x: -46,
    opacity: 0,
    duration: 1.1,
    ease: EASE,
    scrollTrigger: { trigger: '.stay-inner', start: 'top 80%', once: true }
  });

  gsap.from('.cta-panel', {
    x: 46,
    opacity: 0,
    duration: 1.1,
    ease: EASE,
    scrollTrigger: { trigger: '.stay-inner', start: 'top 80%', once: true }
  });

  gsap.from('.cta-content > *', {
    y: 26,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: EASE,
    scrollTrigger: { trigger: '.cta-panel', start: 'top 74%', once: true }
  });

  // Water ripples in the CTA corner expand slowly and continuously —
  // the one looping element on the page, kept very low contrast.
  gsap.to('.cta-ripples', {
    scale: 1.12,
    opacity: 0.14,
    duration: 5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    transformOrigin: '50% 60%'
  });

  /* ---------- BOTANICAL ACCENTS ---------- */
  // Margin sprigs drift at different rates for a layered, unhurried feel.
  gsap.utils.toArray('.botanical-accent').forEach(function (el, i) {
    gsap.to(el, {
      yPercent: i % 2 === 0 ? -18 : 14,
      rotation: i % 2 === 0 ? -4 : 5,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  });

  /* ---------- FOOTER ---------- */
  gsap.from('.footer-inner > *', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: EASE,
    scrollTrigger: { trigger: '.site-footer', start: 'top 92%', once: true }
  });

  // Recalculate once fonts and images have settled, so triggers
  // measured against pre-load layout don't drift.
  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
    settleVisible();
  });

  /* ---------- safety net ----------
     A `from()` tween parks its target at the start state (e.g. y:64) until
     its trigger fires. If a trigger is missed — short viewport, restored
     scroll position, no scroll event, refresh mid-load — the element stays
     visibly offset and can overlap what follows it. Force-complete any
     reveal whose element is already in the viewport. */
  function settleVisible() {
    var vh = window.innerHeight || document.documentElement.clientHeight;

    ScrollTrigger.getAll().forEach(function (st) {
      var el = st.trigger;
      if (!el || !st.animation) return;

      var box = el.getBoundingClientRect();
      var inView = box.top < vh && box.bottom > 0;

      // Leave scrubbed parallax alone — its progress is meant to track scroll.
      if (inView && !st.vars.scrub && st.animation.progress() === 0) {
        st.animation.progress(1);
      }
    });
  }

  // Also settle after late layout shifts (webfont swap, image decode).
  ScrollTrigger.addEventListener('refresh', settleVisible);
})();
