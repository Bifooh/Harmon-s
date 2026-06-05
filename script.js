/* ================================================================
   script.js — Your HVAC Company
   Shared JS for index.html, about.html, contact.html
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------
     1. MOBILE HAMBURGER MENU
  --------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileDrawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer when any link inside it is clicked
    mobileDrawer.querySelectorAll('a, button').forEach(function (el) {
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
     2. ACTIVE NAV LINK HIGHLIGHT
     Marks the correct nav link as active based on the current page.
  --------------------------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-drawer a[data-page]');

  navLinks.forEach(function (link) {
    const page = link.getAttribute('data-page');
    if (page && currentPage.includes(page)) {
      link.classList.add('active');
    }
  });

  /* ---------------------------------------------------------------
     3. SCROLL REVEAL
     Uses IntersectionObserver to fade-in elements with class "reveal"
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
     4. SMOOTH SCROLL for anchor links on the same page
  --------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // account for sticky nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------------------------------------------------------------
     5. REQUEST SERVICE FORM (contact.html)
     Shows a success message on submit; no real data sent.
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

      // Check all required fields
      const required = serviceForm.querySelectorAll('[required]');
      required.forEach(function (field) {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      // Email format check (if provided)
      const emailField = document.getElementById('email');
      if (emailField && emailField.value.trim()) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(emailField.value.trim())) {
          emailField.classList.add('error');
          valid = false;
        }
      }

      if (!valid) {
        // Scroll to first error
        const firstError = serviceForm.querySelector('.error');
        if (firstError) {
          const top = firstError.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        return;
      }

      // Hide form fields, show success
      if (formWrap) formWrap.style.display = 'none';
      serviceForm.querySelector('button[type="submit"]').style.display = 'none';
      if (formSuccess) {
        formSuccess.classList.add('visible');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Clear error state on input
    serviceForm.querySelectorAll('.form-control').forEach(function (field) {
      field.addEventListener('input', function () {
        this.classList.remove('error');
      });
    });
  }

  /* ---------------------------------------------------------------
     6. FAQ ACCORDION (contact.html)
  --------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const trigger = item.querySelector('.faq-trigger');
    const body    = item.querySelector('.faq-body');

    if (!trigger || !body) return;

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        const otherBody = other.querySelector('.faq-body');
        if (otherBody) otherBody.style.maxHeight = '0px';
        const otherIcon = other.querySelector('.faq-icon');
        if (otherIcon) otherIcon.textContent = '+';
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        const icon = item.querySelector('.faq-icon');
        if (icon) icon.textContent = '×';
      }
    });

    // Initialize: set max-height to 0
    body.style.maxHeight = '0px';
    body.style.overflow = 'hidden';
    body.style.transition = 'max-height 0.3s ease';
  });

});
