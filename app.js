document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('aurelia-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      themeToggle.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
      localStorage.setItem('aurelia-theme', theme);
    };
    applyTheme(savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light');
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile');
  if (hamburger && navMenu) {
    const toggleMenu = () => {
      const isActive = navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    };
    hamburger.addEventListener('click', toggleMenu);
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) toggleMenu();
      });
    });
  }
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('active'));
  }
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionLink = document.querySelector(`.nav-links a[href="#${section.id}"]`);
        if (sectionLink) {
          sectionLink.classList.toggle('active', scrollY > sectionTop && scrollY <= sectionTop + section.offsetHeight);
        }
      });
    });
  }
  const productModal = document.getElementById('productModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalCta = document.getElementById('modalCta');
  const modalTriggers = document.querySelectorAll('.modal-trigger');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalDesc = document.getElementById('modalDesc');
  const modalImg = document.getElementById('modalImg');
  if (productModal) {
    const closeModal = () => {
      productModal.classList.remove('active');
      productModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    modalTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const title = trigger.dataset.title || '';
        modalTitle.textContent = title;
        modalPrice.textContent = trigger.dataset.price || '';
        modalDesc.textContent = trigger.dataset.desc || '';
        modalImg.src = trigger.dataset.img || '';
        modalImg.alt = title || 'Product Image';
        productModal.classList.add('active');
        productModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
    [modalClose, modalOverlay, modalCta].forEach((element) => {
      if (element) element.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && productModal.classList.contains('active')) closeModal();
    });
  }
  const testimonials = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');
  const dotsContainer = document.getElementById('sliderDots');
  if (testimonials.length) {
    let currentIndex = 0;
    let autoSlideInterval;
    const goToSlide = (index) => {
      const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
      testimonials[currentIndex].classList.remove('active');
      if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
      currentIndex = (index + testimonials.length) % testimonials.length;
      testimonials[currentIndex].classList.add('active');
      if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    };
    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    };
    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };
    if (dotsContainer) {
      testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `dot${index === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Show review ${index + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(index);
          resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
      });
    }
    if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); resetAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); resetAutoSlide(); });
    startAutoSlide();
  }
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const formFeedback = document.getElementById('formFeedback');
  if (newsletterForm && newsletterEmail && formFeedback) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = newsletterEmail.value.trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      formFeedback.textContent = validEmail ? 'Welcome to Aurelia ✨' : 'Please enter a valid email address.';
      formFeedback.className = `form-feedback ${validEmail ? 'success' : 'error'}`;
      if (validEmail) newsletterEmail.value = '';
    });
  }
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => backToTopBtn.classList.toggle('visible', window.scrollY > 400));
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});
