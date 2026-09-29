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
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('emailAddress');
  const phoneInput = document.getElementById('phoneNumber');
  const selectServiceInput = document.getElementById('selectService');
  const selectBarberInput = document.getElementById('selectBarber');
  const bookingDateInput = document.getElementById('bookingDate');
  const bookingTimeInput = document.getElementById('bookingTime');
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
        clearError(selectServiceInput);
      }
      scrollToBooking();
      const formCard = document.querySelector('.booking-form-card');
      if (formCard) {
        formCard.style.outline = '2px solid var(--gold-primary)';
        setTimeout(() => { formCard.style.outline = 'none'; }, 1500);
      }
    });
  });

  // Barber Card "Select Barber" trigger
  selectBarberBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const barberName = btn.getAttribute('data-barber');
      if (barberName && selectBarberInput) {
        selectBarberInput.value = barberName;
        clearError(selectBarberInput);
      }
      scrollToBooking();
      const formCard = document.querySelector('.booking-form-card');
      if (formCard) {
        formCard.style.outline = '2px solid var(--gold-primary)';
        setTimeout(() => { formCard.style.outline = 'none'; }, 1500);
      }
    });
  });

  // Dynamically set minimum date to today so past dates cannot be chosen
  if (bookingDateInput) {
    const todayStr = new Date().toISOString().split('T')[0];
    bookingDateInput.min = todayStr;
    // Form is empty by default on initial page load
    bookingDateInput.value = '';
  }

  // =========================================================================
  // 9. APPOINTMENT FORM — EXACT VALIDATION BEHAVIOR
  // =========================================================================
  
  // Helper to display accessible error
  const showError = (field, message) => {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    field.setAttribute('aria-invalid', 'true');
    const errEl = group.querySelector('.error-msg');
    if (errEl) {
      errEl.textContent = message;
      errEl.style.display = 'block';
    }
  };

  // Helper to clear error
  const clearError = (field) => {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.remove('has-error');
    field.setAttribute('aria-invalid', 'false');
    const errEl = group.querySelector('.error-msg');
    if (errEl) {
      errEl.style.display = 'none';
    }
  };

  // 1. Full Name Validation
  // Required, trimmed. Invalid if empty, only spaces, <2 chars, or contains ONLY numbers.
  const validateName = () => {
    const val = nameInput.value.trim();
    if (!val || val.length < 2 || /^\d+$/.test(val)) {
      showError(nameInput, 'Please enter your full name.');
      return false;
    }
    clearError(nameInput);
    return true;
  };

  // 2. Email Validation
  // Required, trimmed. Practical email-format regex.
  const validateEmail = () => {
    const val = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!val || !emailRegex.test(val)) {
      showError(emailInput, 'Please enter a valid email address.');
      return false;
    }
    clearError(emailInput);
    return true;
  };

  // 3. Phone Validation
  // Required. Allow digits, spaces, +, -, parentheses. Digits only: min 7, max 15.
  const validatePhone = () => {
    const rawVal = phoneInput.value.trim();
    if (!rawVal) {
      showError(phoneInput, 'Please enter a valid phone number.');
      return false;
    }
    // Must contain only allowed phone characters
    if (!/^[0-9+\s\-()]+$/.test(rawVal)) {
      showError(phoneInput, 'Please enter a valid phone number.');
      return false;
    }
    const digitsOnly = rawVal.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      showError(phoneInput, 'Please enter a valid phone number.');
      return false;
    }
    clearError(phoneInput);
    return true;
  };

  // 4. Service Validation
  // Required. Default option has empty value.
  const validateService = () => {
    const val = selectServiceInput.value;
    if (!val) {
      showError(selectServiceInput, 'Please select a service.');
      return false;
    }
    clearError(selectServiceInput);
    return true;
  };

  // 5. Barber Validation
  // Required. Default option has empty value.
  const validateBarber = () => {
    const val = selectBarberInput.value;
    if (!val) {
      showError(selectBarberInput, 'Please select a barber.');
      return false;
    }
    clearError(selectBarberInput);
    return true;
  };

  // 6. Date Validation
  // Required. Must not be empty, must not be before today.
  const validateDate = () => {
    const val = bookingDateInput.value;
    if (!val) {
      showError(bookingDateInput, 'Please select an appointment date.');
      return false;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    if (val < todayStr) {
      showError(bookingDateInput, 'Please select today or a future date.');
      return false;
    }
    clearError(bookingDateInput);
    return true;
  };

  // 7. Time Validation
  // Required. Default option has empty value.
  const validateTime = () => {
    const val = bookingTimeInput.value;
    if (!val) {
      showError(bookingTimeInput, 'Please select an appointment time.');
      return false;
    }
    clearError(bookingTimeInput);
    return true;
  };

  // Live Error Removal: remove error as soon as user types or changes value to valid
  nameInput.addEventListener('input', () => {
    if (nameInput.closest('.form-group').classList.contains('has-error')) {
      validateName();
    }
  });

  emailInput.addEventListener('input', () => {
    if (emailInput.closest('.form-group').classList.contains('has-error')) {
      validateEmail();
    }
  });

  phoneInput.addEventListener('input', () => {
    if (phoneInput.closest('.form-group').classList.contains('has-error')) {
      validatePhone();
    }
  });

  selectServiceInput.addEventListener('change', () => {
    if (selectServiceInput.closest('.form-group').classList.contains('has-error')) {
      validateService();
    }
  });

  selectBarberInput.addEventListener('change', () => {
    if (selectBarberInput.closest('.form-group').classList.contains('has-error')) {
      validateBarber();
    }
  });

  bookingDateInput.addEventListener('change', () => {
    if (bookingDateInput.closest('.form-group').classList.contains('has-error')) {
      validateDate();
    }
  });

  bookingTimeInput.addEventListener('change', () => {
    if (bookingTimeInput.closest('.form-group').classList.contains('has-error')) {
      validateTime();
    }
  });

  // Handle Form Submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate every field
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isServiceValid = validateService();
    const isBarberValid = validateBarber();
    const isDateValid = validateDate();
    const isTimeValid = validateTime();

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isServiceValid || !isBarberValid || !isDateValid || !isTimeValid) {
      // Find the first invalid field
      const firstInvalidGroup = bookingForm.querySelector('.form-group.has-error');
      if (firstInvalidGroup) {
        firstInvalidGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = firstInvalidGroup.querySelector('input, select');
        if (firstInput) {
          firstInput.focus();
        }
      }
      return; // Do NOT submit, do NOT show confirmation, keep user values
    }

    // Success Behavior
    submitBookingBtn.disabled = true;
    const btnTextSpan = submitBookingBtn.querySelector('.btn-text');
    if (btnTextSpan) {
      btnTextSpan.textContent = 'PROCESSING...';
    } else {
      submitBookingBtn.textContent = 'PROCESSING...';
    }
    submitBookingBtn.classList.add('loading');

    // Wait approximately 500–800ms (650ms)
    setTimeout(() => {
      // Extract exact user-entered details before any reset
      const clientName = nameInput.value.trim();
      const serviceChosen = selectServiceInput.value;
      const barberChosen = selectBarberInput.value;
      const rawDate = bookingDateInput.value;
      const timeChosen = bookingTimeInput.value;

      // Format date nicely (e.g., Saturday, Oct 12, 2026)
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

      // Generate unique demo reference ID in format NC-DEMO-XXXX
      const random4Digit = Math.floor(1000 + Math.random() * 9000);
      const referenceId = `NC-DEMO-${random4Digit}`;

      // Dynamically populate confirmation card with exact entered values
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
      if (refCodeEl) refCodeEl.textContent = referenceId;

      // Restore button text and state
      submitBookingBtn.disabled = false;
      submitBookingBtn.classList.remove('loading');
      if (btnTextSpan) {
        btnTextSpan.textContent = 'BOOK MY APPOINTMENT';
      }

      // Show confirmation and hide form
      bookingForm.style.display = 'none';
      bookingSuccessBox.style.display = 'block';

      // Move focus into the confirmation view
      bookingSuccessBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (resetBookingBtn) {
        resetBookingBtn.focus();
      }
    }, 650);
  });

  // CONFIRMATION CLOSE BUTTON
  resetBookingBtn.addEventListener('click', () => {
    // Hide confirmation and show form
    bookingSuccessBox.style.display = 'none';
    bookingForm.style.display = 'block';

    // Reset form to clean default state
    bookingForm.reset();
    if (bookingDateInput) {
      const todayStr = new Date().toISOString().split('T')[0];
      bookingDateInput.min = todayStr;
      bookingDateInput.value = '';
    }

    // Clear any lingering error classes
    bookingForm.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('has-error');
      const input = group.querySelector('input, select');
      if (input) input.setAttribute('aria-invalid', 'false');
      const err = group.querySelector('.error-msg');
      if (err) err.style.display = 'none';
    });

    // Return focus to appointment section
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.focus();
    }
    if (nameInput) {
      nameInput.focus();
    }
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
