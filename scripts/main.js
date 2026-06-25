/* ================================================================
   main.js - Your HVAC Company
   Shared JavaScript for the static site.
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------
     1. MOBILE HAMBURGER MENU
  --------------------------------------------------------------- */
  const hamburger    = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navDropdowns = document.querySelectorAll('.nav-dropdown, .mobile-dropdown');

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileDrawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer when a real navigation link is clicked.
    mobileDrawer.querySelectorAll('a').forEach(function (el) {
      el.addEventListener('click', function () {
        mobileDrawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        mobileDrawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------------------------------------------------------------
     2. NAV DROPDOWNS
     Desktop opens on hover/focus through CSS; this adds tap support.
  --------------------------------------------------------------- */
  navDropdowns.forEach(function (dropdown) {
    const toggle = dropdown.querySelector('button.nav-dropdown-toggle, .mobile-dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const openClass = dropdown.classList.contains('mobile-dropdown') ? 'open' : 'is-open';
      const isOpen = dropdown.classList.toggle(openClass);
      toggle.setAttribute('aria-expanded', String(isOpen));

      navDropdowns.forEach(function (other) {
        if (other === dropdown) return;
        other.classList.remove('is-open', 'open');
        const otherToggle = other.querySelector('button.nav-dropdown-toggle, .mobile-dropdown-toggle');
        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
      });
    });
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('.nav-dropdown, .mobile-dropdown')) return;
    navDropdowns.forEach(function (dropdown) {
      dropdown.classList.remove('is-open', 'open');
      const toggle = dropdown.querySelector('button.nav-dropdown-toggle, .mobile-dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------------
     3. ACTIVE NAV LINK HIGHLIGHT
     Marks the correct nav link or dropdown as active based on page/hash.
  --------------------------------------------------------------- */
  const rawPath = window.location.pathname.split('/').pop();
  const currentPage = rawPath === '' ? 'index.html' : rawPath;
  const currentHash = window.location.hash;

  document.querySelectorAll('.nav-links a[data-page], .nav-links button[data-page], .mobile-drawer a[data-page], .mobile-drawer button[data-page]').forEach(function (link) {
    const page = link.getAttribute('data-page');
    if (!page) return;

    const isHome = currentPage === 'index.html' || currentPage === '';
    const serviceHashes = ['#services', '#cooling', '#heating'];
    const isActive =
      (page === 'index' && isHome && !serviceHashes.includes(currentHash)) ||
      (page === 'services' && isHome && serviceHashes.includes(currentHash)) ||
      (page === 'about' && (currentPage.includes('about') || currentPage.includes('resources'))) ||
      (page === 'contact' && currentPage.includes('contact'));

    if (isActive) link.classList.add('active');
  });

  /* ---------------------------------------------------------------
     3. SCROLL REVEAL
     Fades in elements with class "reveal" on scroll.
  --------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------------
     4. SMOOTH SCROLL for same-page anchor links
  --------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // let placeholder links do nothing
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // sticky nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------------------------------------------------------------
     5. RESOURCES PAGE - Filter chips
     Simple category filter. Each resource card has a data-category
     attribute. Clicking a chip shows only matching cards.
     "All" chip always shows everything.
  --------------------------------------------------------------- */
  const filterChips   = document.querySelectorAll('.filter-chip');
  const resourceCards = document.querySelectorAll('.resource-card[data-category]');
  const emptyMsg      = document.querySelector('.resources-empty');

  if (filterChips.length > 0 && resourceCards.length > 0) {
    filterChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        // Update active chip
        filterChips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');

        const selected = chip.getAttribute('data-filter');
        let visibleCount = 0;

        resourceCards.forEach(function (card) {
          const cats = card.getAttribute('data-category') || '';
          const show = selected === 'all' || cats.split(',').map(function(s){ return s.trim(); }).includes(selected);
          card.classList.toggle('hidden', !show);
          if (show) visibleCount++;
        });

        // Show/hide empty state message
        if (emptyMsg) {
          emptyMsg.classList.toggle('visible', visibleCount === 0);
        }
      });
    });
  }

  /* ---------------------------------------------------------------
     6. REQUEST SERVICE FORM (contact.html)
     Shows a success message on submit; no real data is sent.
     REPLACE THIS ENTIRE BLOCK with your real form handler or
     Squarespace Form Block before going live.
  --------------------------------------------------------------- */
  const serviceForm = document.getElementById('serviceForm');
  const formSuccess = document.getElementById('formSuccess');
  const formWrap    = document.getElementById('formFields');

  if (serviceForm) {
    serviceForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;

      // Check required fields
      serviceForm.querySelectorAll('[required]').forEach(function (field) {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      // Email format check (optional field)
      const emailField = document.getElementById('email');
      if (emailField && emailField.value.trim()) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(emailField.value.trim())) {
          emailField.classList.add('error');
          valid = false;
        }
      }

      if (!valid) {
        const firstError = serviceForm.querySelector('.error');
        if (firstError) {
          const top = firstError.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        return;
      }

      // Success: hide form, show success message
      if (formWrap) formWrap.style.display = 'none';
      const submitBtn = serviceForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.style.display = 'none';
      if (formSuccess) {
        formSuccess.classList.add('visible');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Clear error state on user input
    serviceForm.querySelectorAll('.form-control').forEach(function (field) {
      field.addEventListener('input', function () { this.classList.remove('error'); });
    });
  }

  /* ---------------------------------------------------------------
     7. FAQ ACCORDION (resources.html)
  --------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const trigger = item.querySelector('.faq-trigger');
    const body    = item.querySelector('.faq-body');
    if (!trigger || !body) return;

    // Initialize closed
    body.style.maxHeight  = '0px';
    body.style.overflow   = 'hidden';
    body.style.transition = 'max-height 0.3s ease';

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        const ob = other.querySelector('.faq-body');
        if (ob) ob.style.maxHeight = '0px';
        const oi = other.querySelector('.faq-icon');
        if (oi) oi.textContent = '+';
        const ot = other.querySelector('.faq-trigger');
        if (ot) ot.setAttribute('aria-expanded', 'false');
      });

      // Open this one if it was closed
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
        const icon = item.querySelector('.faq-icon');
        if (icon) icon.textContent = 'x';
      }
    });
  });

});

