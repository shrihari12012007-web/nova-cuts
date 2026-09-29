/**
 * NOVA CUTS — Premium Modern Barbershop
 * Vanilla JavaScript Engine
 * Author: NOVA CUTS Development Team
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. DOM SELECTORS
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');

  // Booking Form Elements
  const bookingForm = document.getElementById('appointmentForm');
  const bookingSuccessBox = document.getElementById('bookingSuccessBox');
  const resetBookingBtn = document.getElementById('resetBookingBtn');
  const selectServiceInput = document.getElementById('selectService');
  const selectBarberInput = document.getElementById('selectBarber');
  const bookingDateInput = document.getElementById('bookingDate');
  const submitBookingBtn = document.getElementById('submitBookingBtn');

  // Service & Barber CTA Triggers
  const bookServiceBtns = document.querySelectorAll('.book-service-btn');
  const selectBarberBtns = document.querySelectorAll('.select-barber-btn');

  // Gallery & Lightbox Elements
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');

  // Counter Elements
  const counterElements = document.querySelectorAll('.counter');

  // =========================================================================
  // 2. STICKY NAVBAR & BACK-TO-TOP SCROLL LISTENER
  // =========================================================================
  const handleScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Sticky nav styling
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Active navigation spy
    highlightActiveNavLink(scrollY);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check on page load

  // Smooth scroll back to top
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // =========================================================================
  // 3. NAVIGATION SPY (HIGHLIGHT ACTIVE SECTION)
  // =========================================================================
  function highlightActiveNavLink(scrollY) {
    const currentScroll = scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // =========================================================================
  // 4. MOBILE NAVIGATION DRAWER
  // =========================================================================
  const openMobileMenu = () => {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', () => {
    if (mobileDrawer.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  closeDrawerBtn.addEventListener('click', closeMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileDrawer.classList.contains('active')) closeMobileMenu();
      if (lightboxModal.classList.contains('active')) closeLightbox();
    }
  });

  // =========================================================================
  // 5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser lacks IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // =========================================================================
  // 6. ANIMATED STATISTICS COUNTER (CLEAN PORTFOLIO METRICS)
  // =========================================================================
  let counterStarted = false;
  const startCounters = () => {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      if (isNaN(target)) return;

      let current = 0;
      const stepTime = 120;
      const steps = 15;
      const increment = Math.max(1, target / steps);

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.round(current);
      }, stepTime);
    });
  };

  const aboutSection = document.getElementById('about');
  if (aboutSection && 'IntersectionObserver' in window) {
    const aboutObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counterStarted) {
        counterStarted = true;
        startCounters();
      }
    }, { threshold: 0.3 });
    aboutObserver.observe(aboutSection);
  }

  // =========================================================================
  // 7. GALLERY FILTERING & LIGHTBOX
  // =========================================================================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hide');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.classList.add('hide');
          }, 300);
        }
      });
    });
  });

  // Lightbox Functionality
  const openLightbox = (imgSrc, title, desc) => {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300);
  };

  galleryItems.forEach(item => {
    const card = item.querySelector('.gallery-card');
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title').textContent;
    const desc = item.querySelector('.gallery-item-desc').textContent;

    card.addEventListener('click', () => {
      openLightbox(img.src, title, desc);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // =========================================================================
  // 8. INTERACTIVE CTA PRE-SELECTION (SERVICES & BARBERS)
  // =========================================================================
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Service Card "Book Now" trigger
  bookServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      if (serviceName && selectServiceInput) {
        selectServiceInput.value = serviceName;
        selectServiceInput.dispatchEvent(new Event('change'));
      }
      scrollToBooking();
      // Highlight the booking card
      const formCard = document.querySelector('.booking-form-card');
      formCard.style.outline = '2px solid var(--gold-primary)';
      setTimeout(() => { formCard.style.outline = 'none'; }, 1500);
    });
  });

  // Barber Card "Select Barber" trigger
  selectBarberBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const barberName = btn.getAttribute('data-barber');
      if (barberName && selectBarberInput) {
        selectBarberInput.value = barberName;
      }
      scrollToBooking();
      const formCard = document.querySelector('.booking-form-card');
      formCard.style.outline = '2px solid var(--gold-primary)';
      setTimeout(() => { formCard.style.outline = 'none'; }, 1500);
    });
  });

  // Dynamically set minimum date to today so past dates cannot be chosen
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
    // Set default date to today
    bookingDateInput.value = today;
  }

  // =========================================================================
  // 9. FORM VALIDATION & DYNAMIC DEMO APPOINTMENT CONFIRMATION
  // =========================================================================
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('emailAddress');
  const phoneInput = document.getElementById('phoneNumber');
  const timeInput = document.getElementById('bookingTime');

  // Validation rules
  const validateName = () => {
    const val = nameInput.value.trim();
    const parent = nameInput.closest('.form-group');
    if (val.length < 2) {
      parent.classList.add('has-error');
      return false;
    }
    parent.classList.remove('has-error');
    return true;
  };

  const validateEmail = () => {
    const val = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const parent = emailInput.closest('.form-group');
    if (!emailRegex.test(val)) {
      parent.classList.add('has-error');
      return false;
    }
    parent.classList.remove('has-error');
    return true;
  };

  const validatePhone = () => {
    const val = phoneInput.value.trim().replace(/[\s\-\(\)\.]/g, '');
    const parent = phoneInput.closest('.form-group');
    // Ensure at least 10 numeric characters
    if (val.length < 10 || !/^\+?\d+$/.test(val)) {
      parent.classList.add('has-error');
      return false;
    }
    parent.classList.remove('has-error');
    return true;
  };

  const validateService = () => {
    const parent = selectServiceInput.closest('.form-group');
    if (!selectServiceInput.value) {
      parent.classList.add('has-error');
      return false;
    }
    parent.classList.remove('has-error');
    return true;
  };

  const validateDate = () => {
    const parent = bookingDateInput.closest('.form-group');
    const val = bookingDateInput.value;
    if (!val) {
      parent.classList.add('has-error');
      return false;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    if (val < todayStr) {
      parent.classList.add('has-error');
      return false;
    }
    parent.classList.remove('has-error');
    return true;
  };

  const validateTime = () => {
    const parent = timeInput.closest('.form-group');
    if (!timeInput.value) {
      parent.classList.add('has-error');
      return false;
    }
    parent.classList.remove('has-error');
    return true;
  };

  // Real-time blur validation
  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  phoneInput.addEventListener('blur', validatePhone);
  selectServiceInput.addEventListener('change', validateService);
  bookingDateInput.addEventListener('change', validateDate);
  timeInput.addEventListener('change', validateTime);

  // Clear errors on input
  [nameInput, emailInput, phoneInput].forEach(inp => {
    inp.addEventListener('input', () => {
      inp.closest('.form-group').classList.remove('has-error');
    });
  });

  // Handle Form Submit
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isServiceValid = validateService();
    const isDateValid = validateDate();
    const isTimeValid = validateTime();

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isServiceValid || !isDateValid || !isTimeValid) {
      // Focus the first invalid field
      const firstError = bookingForm.querySelector('.has-error input, .has-error select');
      if (firstError) firstError.focus();
      return;
    }

    // Set Loading State
    submitBookingBtn.classList.add('loading');
    submitBookingBtn.disabled = true;

    // Simulate realistic front-end demo processing delay
    setTimeout(() => {
      submitBookingBtn.classList.remove('loading');
      submitBookingBtn.disabled = false;

      // Extract exact user-entered details dynamically
      const clientName = nameInput.value.trim();
      const serviceChosen = selectServiceInput.value;
      const barberChosen = selectBarberInput.value || 'First Available Barber';
      const rawDate = bookingDateInput.value;
      const timeChosen = timeInput.value;

      // Format date dynamically based on user selection
      let formattedDate = rawDate;
      try {
        const parts = rawDate.split('-');
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        formattedDate = dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } catch (err) {
        formattedDate = rawDate;
      }

      // Generate random demo reference code
      const randomCode = `#NC-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;

      // Populate confirmation card dynamically with exact entered info
      const clientNameEl = document.getElementById('successClientName');
      const clientNameDisplayEl = document.getElementById('successClientNameDisplay');
      const serviceEl = document.getElementById('successService');
      const barberEl = document.getElementById('successBarber');
      const dateEl = document.getElementById('successDate');
      const timeEl = document.getElementById('successTime');
      const refCodeEl = document.getElementById('successRefCode');

      if (clientNameEl) clientNameEl.textContent = clientName;
      if (clientNameDisplayEl) clientNameDisplayEl.textContent = clientName;
      if (serviceEl) serviceEl.textContent = serviceChosen;
      if (barberEl) barberEl.textContent = barberChosen;
      if (dateEl) dateEl.textContent = formattedDate;
      if (timeEl) timeEl.textContent = timeChosen;
      if (refCodeEl) refCodeEl.textContent = randomCode;

      // Clear the form fields after confirmation has recorded the values
      bookingForm.reset();
      const todayStr = new Date().toISOString().split('T')[0];
      bookingDateInput.value = todayStr;

      // Swap Form with Confirmation Card
      bookingForm.style.display = 'none';
      bookingSuccessBox.style.display = 'block';

      // Scroll smoothly to confirmation view
      bookingSuccessBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 650);
  });

  // CLOSE / Reset Confirmation Card
  resetBookingBtn.addEventListener('click', () => {
    bookingSuccessBox.style.display = 'none';
    bookingForm.style.display = 'block';
  });

  // =========================================================================
  // 10. SOCIAL LINKS — EXACT NEW-TAB BEHAVIOR
  // =========================================================================
  const socialLinks = document.querySelectorAll('.social-link-btn, .barber-social-link');
  socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetUrl = this.getAttribute('href');
      if (targetUrl) {
        // Step 1: Open a new tab preserving current NOVA CUTS tab
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    });

    // Keyboard support: Enter or Space
    link.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const targetUrl = this.getAttribute('href');
        if (targetUrl) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      }
    });
  });

  // =========================================================================
  // 11. SMOOTH SCROLLING FOR IN-PAGE ANCHORS
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Console Welcome Badge
  console.log(
    '%c NOVA CUTS %c Sharp Cuts. Clean Style. (Concept Portfolio Demo) ',
    'background: #c5a059; color: #070709; font-weight: bold; padding: 4px 8px; border-radius: 3px;',
    'background: #141419; color: #f5f5f7; padding: 4px 8px; border-radius: 3px;'
  );
});
