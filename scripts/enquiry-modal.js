/* =========================================================
   Sri Sri Wellbeing — enquiry modal (lead capture)

   Accessibility: the panel is a real aria-modal dialog. Focus moves
   in on open, is trapped while open, and is restored to the trigger
   on close. Escape and overlay clicks both dismiss.
   ========================================================= */

(function () {
  'use strict';

  var modal = document.getElementById('enquiry-modal');
  if (!modal) return;

  var panel   = modal.querySelector('.modal-panel');
  var form    = modal.querySelector('.enquiry-form');
  var success = modal.querySelector('.form-success');
  var lastFocused = null;
  var openedFrom  = '';   // which CTA opened the modal, for attribution

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]),' +
                  'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function visibleFocusable() {
    return Array.prototype.filter.call(
      panel.querySelectorAll(FOCUSABLE),
      function (el) { return el.offsetParent !== null; }
    );
  }

  /* ---------- open / close ---------- */

  function open(trigger) {
    lastFocused = trigger || document.activeElement;

    // A card link can name the therapy it came from — preselect it so the
    // visitor doesn't retype what they already told us by clicking.
    openedFrom = (trigger && (trigger.getAttribute('data-cta') ||
                  (trigger.textContent || '').trim())) || 'unknown';

    var programme = trigger && trigger.getAttribute('data-programme');
    var select = document.getElementById('f-programme');
    if (programme && select) {
      var match = Array.prototype.filter.call(select.options, function (o) {
        return o.value === programme || o.text === programme;
      })[0];
      if (match) select.value = match.value;
    }

    modal.hidden = false;
    document.body.classList.add('modal-open');

    // Next frame, so the transition has a start state to animate from.
    requestAnimationFrame(function () {
      modal.classList.add('is-open');
    });

    // Prefer the first real input over the close button, so a keyboard
    // or screen-reader user starts on the form rather than on "dismiss".
    var target = panel.querySelector('.enquiry-form input, .enquiry-form select, .enquiry-form textarea');
    if (!target || form.hidden) target = visibleFocusable()[0];
    if (target) target.focus();

    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    modal.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown);
    document.body.classList.remove('modal-open');

    var finished = false;
    var done = function () {
      if (finished) return;        // transitionend and the timer can both fire
      finished = true;
      modal.hidden = true;
      panel.removeEventListener('transitionend', done);
      resetForm();
    };

    // Fall back to a timer if transitionend never fires (reduced motion).
    panel.addEventListener('transitionend', done);
    setTimeout(done, 420);

    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }

    if (e.key !== 'Tab') return;

    var items = visibleFocusable();
    if (!items.length) return;

    var first = items[0];
    var last  = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---------- triggers ---------- */

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-open-enquiry]');
    if (trigger) {
      e.preventDefault();
      open(trigger);
      return;
    }

    if (e.target.closest('[data-close]')) {
      e.preventDefault();
      close();
    }
  });

  /* ---------- validation ---------- */

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // Accepts spaces, dashes and an optional country prefix; 7–15 digits.
  var PHONE_RE = /^\+?[\d\s-]{7,18}$/;

  function setError(field, on) {
    var wrap = field.closest('.field') || field.closest('.consent');
    var msg  = form.querySelector('[data-error-for="' + field.id + '"]');

    if (wrap && wrap.classList) wrap.classList.toggle('has-error', on);
    if (msg) msg.hidden = !on;
    field.setAttribute('aria-invalid', on ? 'true' : 'false');
  }

  function validateField(field) {
    var value = (field.value || '').trim();
    var ok = true;

    if (field.type === 'checkbox') {
      ok = field.checked;
    } else if (field.required && !value) {
      ok = false;
    } else if (field.type === 'email' && value) {
      ok = EMAIL_RE.test(value);
    } else if (field.type === 'tel' && value) {
      ok = PHONE_RE.test(value) && (value.replace(/\D/g, '').length >= 7);
    }

    setError(field, !ok);
    return ok;
  }

  var required = ['f-name', 'f-email', 'f-phone', 'f-consent'].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);

  // Re-validate on blur, and live-clear an error once it's corrected.
  required.forEach(function (field) {
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
    field.addEventListener('change', function () {
      if (field.type === 'checkbox') validateField(field);
    });
  });

  /* ---------- submit ---------- */

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstBad = null;
    required.forEach(function (field) {
      if (!validateField(field) && !firstBad) firstBad = field;
    });

    if (firstBad) {
      firstBad.focus();
      return;
    }

    var lead = {
      name:      form.name.value.trim(),
      email:     form.email.value.trim(),
      phone:     form.phone.value.trim(),
      programme: form.programme.value,
      date:      form.date.value,
      message:   form.message.value.trim(),
      source:    openedFrom      // which CTA drove this lead
    };

    // No backend is wired up in this static build. Hand the lead to a
    // dataLayer/analytics listener if present, and log it for now —
    // replace this block with a POST to your CRM endpoint.
    if (window.dataLayer && typeof window.dataLayer.push === 'function') {
      window.dataLayer.push({ event: 'enquiry_submitted', lead: lead });
    }
    console.info('[enquiry] lead captured', lead);

    form.hidden = true;
    success.hidden = false;

    var btn = success.querySelector('.nature-button');
    if (btn) btn.focus();
  });

  /* ---------- FAQ accordion fallback ----------
     Modern browsers make <details name="faq"> mutually exclusive natively.
     Older ones ignore the attribute, so close siblings manually there. */
  (function () {
    var items = document.querySelectorAll('.faq-item[name], .faq-item');
    if (!items.length) return;

    var supportsName = 'name' in document.createElement('details');
    if (supportsName) return;

    Array.prototype.forEach.call(items, function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        Array.prototype.forEach.call(items, function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  })();

  /* ---------- mobile sticky CTA ---------- */

  var sticky = document.querySelector('.sticky-cta');
  var hero   = document.querySelector('.hero');

  if (sticky && hero) {
    document.body.classList.add('has-sticky-cta');

    var stickyLink = sticky.querySelector('a');

    var setSticky = function (show) {
      sticky.classList.toggle('is-visible', show);
      // Hidden from AT and tab order while off-screen.
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (stickyLink) stickyLink.tabIndex = show ? 0 : -1;
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        setSticky(!entries[0].isIntersecting);
      }, { rootMargin: '-40% 0px 0px 0px' }).observe(hero);
    } else {
      window.addEventListener('scroll', function () {
        setSticky(window.scrollY > hero.offsetHeight * 0.6);
      }, { passive: true });
    }
  }

  // Clear both the values and any lingering error state, so an abandoned
  // half-filled form doesn't reopen still showing red.
  function resetForm() {
    form.reset();
    form.hidden = false;
    success.hidden = true;
    required.forEach(function (field) { setError(field, false); });
  }
})();
