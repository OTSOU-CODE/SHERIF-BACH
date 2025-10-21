// SHERIF-SIEGE-AUTO - Professional Auto Upholstery Website JavaScript

// Theme Switcher Functionality
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      // Switch to light theme
      window.location.href = '../light view/index.html';
    });
  }
});

// Global Variables
let currentTestimonial = 0;
let isChatOpen = false;
let isMobile = window.innerWidth <= 768;
let touchStartX = 0;
let touchStartY = 0;

// Portfolio Data
const portfolioData = [];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
  initializeWebsite();
  initMobileFeatures();
  initTouchGestures();
  console.log('🚗 Auto upholstery website initialized successfully!');
});

// Handle window resize
window.addEventListener('resize', function() {
  isMobile = window.innerWidth <= 768;
  // Refresh any mobile-specific features
  if (isMobile) {
    initMobileFeatures();
  }
});

// Initialize Website
function initializeWebsite() {
  handleLoadingScreen();
  setupNavigation();
  setupHeroAnimations();
  setupSeatInteractivity();
  setupPortfolio();
  setupContactForm();
  setupScrollEffects();
  setupBackToTop();
  setupAccessibility();
  animateOnScroll();
}

// Loading Screen
function handleLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  
  // Simulate loading time
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    
    // Remove loading screen from DOM after transition
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }, 2000);
}

// Navigation Setup
function setupNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking on links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active navigation link
    updateActiveNavLink();
  });
}

// Update Active Navigation Link
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Smooth Scroll Function
function scrollToSection(targetId) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    const headerHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Hero Animations
function setupHeroAnimations() {
  // Animate statistics counters
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  };

  // Trigger counter animation when hero section is in view
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(animateCounter);
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroObserver.observe(heroSection);
  }
}

// Seat Interactivity
function setupSeatInteractivity() {
  const seatWrapper = document.querySelector('.car-seat-wrapper');
  
  let isAutoColorActive = false;
  let autoColorInterval;
  let detectedImages = [];
  let currentImageIndex = 0;

  // Function to detect all images in component folder (fallback)
  async function detectComponentImages() {
    try {
      // List of known images (fallback)
      const knownImages = [
        'component/ChatGPT Image Oct 2, 2025, 07_54_13 PM.png',
        'component/ChatGPT Image Oct 2, 2025, 08_56_02 PM.png',
        'component/ChatGPT Image Oct 2, 2025, 08_56_04 PM.png',
        'component/ChatGPT Image Oct 2, 2025, 08_56_05 PM.png'
      ];
      
      // Try to detect additional images by testing common patterns
      const additionalImages = [];
      const basePath = 'component/';
      
      // Test for additional images with common naming patterns
      for (let i = 1; i <= 10; i++) {
        const testPaths = [
          `${basePath}car-seat-${i}.png`,
          `${basePath}car-seat-${i}.jpg`,
          `${basePath}seat-${i}.png`,
          `${basePath}seat-${i}.jpg`,
          `${basePath}upholstery-${i}.png`,
          `${basePath}upholstery-${i}.jpg`,
          `${basePath}image-${i}.png`,
          `${basePath}image-${i}.jpg`,
          `${basePath}photo-${i}.png`,
          `${basePath}photo-${i}.jpg`
        ];
        
        for (const testPath of testPaths) {
          try {
            // Test if image exists by trying to load it
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = () => {
                if (!knownImages.includes(testPath) && !additionalImages.includes(testPath)) {
                  additionalImages.push(testPath);
                }
                resolve();
              };
              img.onerror = () => reject();
              img.src = testPath;
            });
          } catch (e) {
            // Image doesn't exist, continue
          }
        }
      }
      
      // Combine known images with detected additional images
      const allImages = [...knownImages, ...additionalImages];
      
      console.log('Detected images:', allImages);
      console.log('Additional images found:', additionalImages);
      
      return allImages;
    } catch (error) {
      console.log('Using fallback images');
      return [
        'component/ChatGPT Image Oct 2, 2025, 07_54_13 PM.png',
        'component/ChatGPT Image Oct 2, 2025, 08_56_02 PM.png',
        'component/ChatGPT Image Oct 2, 2025, 08_56_04 PM.png',
        'component/ChatGPT Image Oct 2, 2025, 08_56_05 PM.png'
      ];
    }
  }

  // Function to create car seat images dynamically
  function createCarSeatImages(images) {
    const seatWrapper = document.querySelector('.car-seat-wrapper');
    
    // Clear existing images
    seatWrapper.innerHTML = '';
    
    images.forEach((imagePath, index) => {
      const img = document.createElement('img');
      img.className = `car-seat ${index === 0 ? 'active' : ''}`;
      img.src = imagePath;
      img.alt = `Premium Car Seat - Color ${index + 1}`;
      img.setAttribute('data-color', `color-${index + 1}`);
      img.setAttribute('data-index', index);
      
      seatWrapper.appendChild(img);
    });
    
    console.log(`Created ${images.length} car seat images`);
  }
 
  // Color selection function
  function selectColor(colorIndex) {
    const carSeats = document.querySelectorAll('.car-seat');
    carSeats.forEach((seat, index) => {
      seat.classList.remove('active');
      if (index === colorIndex) {
        seat.classList.add('active');
      }
    });
    currentImageIndex = colorIndex;
  }
 
   // Texture selection function - Disabled
   function selectTexture(texture) {
     // Texture functionality is disabled
     console.log('Texture functionality is disabled');
   }
 
   // Rotation function - Disabled
   function rotateSeat(direction) {
     // Rotation functionality is disabled
     console.log('Rotation functionality is disabled');
   }
 
  // Auto color cycling function
  function startAutoColor() {
    if (detectedImages.length === 0) return;
    
    autoColorInterval = setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % detectedImages.length;
      selectColor(currentImageIndex);
    }, 2500); // Change color every 2.5 seconds
  }

  function stopAutoColor() {
    if (autoColorInterval) {
      clearInterval(autoColorInterval);
      autoColorInterval = null;
    }
  }

  // Auto color toggle function
  function toggleAutoColor() {
    isAutoColorActive = !isAutoColorActive;
    
    if (isAutoColorActive) {
      startAutoColor();
    } else {
      stopAutoColor();
    }
  }
 
  // Initialize the car seat system
  async function initializeCarSeat() {
    try {
      // Detect available images
      detectedImages = await detectComponentImages();
      
      // Create car seat images dynamically
      createCarSeatImages(detectedImages);
      
      // Initialize with first image
      selectColor(0);
      
      // Start auto color cycling automatically after 1 second
      setTimeout(() => {
        startAutoColor();
      }, 1000);
      
      console.log(`Car seat system initialized with ${detectedImages.length} images`);
    } catch (error) {
      console.error('Error initializing car seat:', error);
    }
  }

  // Start initialization
  initializeCarSeat();
 }

// Portfolio Setup
function setupPortfolio() {
  const portfolioGrid = document.getElementById('portfolio-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // Render portfolio items
  function renderPortfolio(filter = 'all') {
    const filteredItems = filter === 'all' 
      ? portfolioData 
      : portfolioData.filter(item => item.category === filter);
    
    if (filteredItems.length === 0) {
      portfolioGrid.innerHTML = `
        <div class="portfolio-empty" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
          <i class="fas fa-images" style="font-size: 4rem; color: var(--accent); margin-bottom: 1rem; opacity: 0.5;"></i>
          <h3 style="margin-bottom: 1rem; color: var(--text-primary);">No Projects Available</h3>
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">We're currently updating our portfolio.</p>
          <p style="font-size: 1rem;">Check back soon for our latest work!</p>
        </div>
      `;
    } else {
      portfolioGrid.innerHTML = filteredItems.map(item => `
        <div class="portfolio-item" data-category="${item.category}">
          <div class="portfolio-image">
            <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" 
                 onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg, var(--surface), var(--surface-light))';">
          </div>
          <div class="portfolio-content">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
        </div>
      `).join('');
    }
  }

  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Render filtered portfolio
      renderPortfolio(filter);
    });
  });

  // Initial render
  renderPortfolio();
}

// Contact Form Setup
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
      alert('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }, 2000);
  });
}

// Scroll Effects
function setupScrollEffects() {
  // Parallax effect for hero background
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
}

// Back to Top Button
function setupBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Animate on Scroll
function animateOnScroll() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    '.service-card, .about-feature, .portfolio-item, .info-card'
  );

  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Performance optimized scroll handler
const optimizedScrollHandler = debounce(() => {
  // Handle scroll-based animations and effects
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Keyboard Accessibility
document.addEventListener('keydown', function(e) {
  // Handle keyboard navigation for interactive elements
  if (e.target.classList.contains('filter-btn') || 
      e.target.classList.contains('carousel-btn') || 
      e.target.classList.contains('btn')) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.target.click();
    }
  }
});

// Make interactive elements focusable
function setupAccessibility() {
  const interactiveElements = document.querySelectorAll(
    '.filter-btn, .carousel-btn, .btn'
  );
  
  interactiveElements.forEach(element => {
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');
  });
}

// Error Handling
window.addEventListener('error', function(e) {
  console.error('JavaScript Error:', e.error);
});

// FAQ Functionality
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active', !isActive);
    });
  });
}

// Quote Calculator Functionality
function initQuoteCalculator() {
  const modal = document.getElementById('quote-modal');
  const quoteBtn = document.getElementById('quote-calculator-btn');
  const quoteBtn2 = document.getElementById('quote-calculator-btn-2');
  const quoteBtn3 = document.getElementById('quote-calculator-btn-3');
  const closeBtn = document.getElementById('close-quote-modal');
  const cancelBtn = document.getElementById('cancel-quote');
  const requestBtn = document.getElementById('request-quote');
  
  // Form elements
  const serviceSelect = document.getElementById('service-type');
  const materialSelect = document.getElementById('material-type');
  const seatCountInput = document.getElementById('seat-count');
  
  // Display elements
  const serviceCost = document.getElementById('service-cost');
  const materialCost = document.getElementById('material-cost');
  const laborCost = document.getElementById('labor-cost');
  const totalCost = document.getElementById('total-cost');
  
  // Open modal function
  function openQuoteModal() {
    modal.classList.add('active');
    calculateQuote();
  }
  
  // Open modal
  [quoteBtn, quoteBtn2, quoteBtn3].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', openQuoteModal);
    }
  });
  
  // Close modal
  [closeBtn, cancelBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  });
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
  
  // Calculate quote
  function calculateQuote() {
    const servicePrice = parseInt(serviceSelect.selectedOptions[0]?.dataset.price || 0);
    const materialPrice = parseInt(materialSelect.selectedOptions[0]?.dataset.price || 0);
    const seatCount = parseInt(seatCountInput.value || 1);
    
    const serviceTotal = servicePrice * seatCount;
    const materialTotal = materialPrice * seatCount;
    const laborTotal = Math.round((serviceTotal + materialTotal) * 0.3); // 30% labor markup
    const grandTotal = serviceTotal + materialTotal + laborTotal;
    
    serviceCost.textContent = `$${serviceTotal}`;
    materialCost.textContent = `$${materialTotal}`;
    laborCost.textContent = `$${laborTotal}`;
    totalCost.textContent = `$${grandTotal}`;
  }
  
  // Update quote when inputs change
  [serviceSelect, materialSelect, seatCountInput].forEach(element => {
    element.addEventListener('change', calculateQuote);
  });
  
  // Request quote
  requestBtn.addEventListener('click', () => {
    alert('Thank you for your interest! We will contact you within 24 hours with a detailed quote.');
    modal.classList.remove('active');
  });
}

// Live Chat Functionality
function initLiveChat() {
  const chatToggle = document.getElementById('chat-toggle');
  const chatWidget = document.getElementById('chat-widget');
  const chatClose = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');
  
  // Toggle chat widget
  chatToggle.addEventListener('click', () => {
    isChatOpen = !isChatOpen;
    chatWidget.classList.toggle('active', isChatOpen);
    
    if (isChatOpen) {
      chatInput.focus();
    }
  });
  
  // Close chat widget
  chatClose.addEventListener('click', () => {
    isChatOpen = false;
    chatWidget.classList.remove('active');
  });
  
  // Send message
  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "Thank you for your message! How can I help you today?",
        "We'd be happy to discuss your upholstery needs. What type of vehicle do you have?",
        "For immediate assistance, please call us at (555) 123-4567",
        "Would you like to schedule a free consultation?",
        "Our team is standing by to help with your project!"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'bot');
    }, 1000);
  }
  
  // Add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Event listeners
  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

// Initialize new features
function initNewFeatures() {
  initFAQ();
  initQuoteCalculator();
  initLiveChat();
}

// Mobile-specific features
function initMobileFeatures() {
  // Improve mobile navigation
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
      
      // Prevent body scroll when menu is open
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Improve mobile form interactions
  const formInputs = document.querySelectorAll('input, select, textarea');
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      // Scroll to input on mobile to avoid keyboard covering it
      if (isMobile) {
        setTimeout(() => {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    });
    
    // Improve input styling on mobile
    input.addEventListener('blur', function() {
      this.style.borderColor = '';
    });
    
    input.addEventListener('focus', function() {
      this.style.borderColor = 'var(--primary)';
    });
  });
  
  // Improve mobile modal behavior
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('touchstart', function(event) {
      event.stopPropagation();
    });
    
    // Prevent body scroll when modal is open
    const modalToggle = document.querySelector('[data-target="' + modal.id + '"]');
    if (modalToggle) {
      modalToggle.addEventListener('click', function() {
        document.body.style.overflow = 'hidden';
      });
    }
    
    // Restore body scroll when modal is closed
    const modalClose = modal.querySelector('.modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', function() {
        document.body.style.overflow = '';
      });
    }
  });
  
  // Improve button interactions on mobile
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    button.addEventListener('touchend', function() {
      this.style.transform = '';
    });
  });
  
  // Fix mobile viewport issues
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
  }
}

// Touch gesture support
function initTouchGestures() {
  // Swipe support for testimonials carousel
  const carousel = document.querySelector('.testimonials-carousel');
  if (carousel) {
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
  
  // Swipe support for portfolio items
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  portfolioItems.forEach(item => {
    item.addEventListener('touchstart', handleTouchStart, { passive: true });
    item.addEventListener('touchend', handleTouchEnd, { passive: true });
  });
}

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
  if (!touchStartX || !touchStartY) return;
  
  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;
  
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;
  
  // Check if horizontal swipe is more significant than vertical
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (Math.abs(diffX) > 50) { // Minimum swipe distance
      if (diffX > 0) {
        // Swipe left - next testimonial
        if (event.currentTarget.classList.contains('testimonials-carousel')) {
          nextTestimonial();
        }
      } else {
        // Swipe right - previous testimonial
        if (event.currentTarget.classList.contains('testimonials-carousel')) {
          previousTestimonial();
        }
      }
    }
  }
  
  // Reset touch coordinates
  touchStartX = 0;
  touchStartY = 0;
}

// Enhanced accessibility features
function initAccessibilityFeatures() {
  // Add keyboard navigation for custom elements
  const interactiveElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card');
  
  interactiveElements.forEach(element => {
    element.setAttribute('tabindex', '0');
    element.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        element.click();
      }
    });
  });
  
  // Add ARIA labels where needed
  const buttons = document.querySelectorAll('button:not([aria-label])');
  buttons.forEach(button => {
    if (!button.textContent.trim()) {
      const icon = button.querySelector('i');
      if (icon) {
        const iconClass = icon.className;
        let label = '';
        
        if (iconClass.includes('fa-facebook')) label = 'Facebook';
        else if (iconClass.includes('fa-instagram')) label = 'Instagram';
        else if (iconClass.includes('fa-youtube')) label = 'YouTube';
        else if (iconClass.includes('fa-chevron-left')) label = 'Previous';
        else if (iconClass.includes('fa-chevron-right')) label = 'Next';
        else if (iconClass.includes('fa-times')) label = 'Close';
        else if (iconClass.includes('fa-bars')) label = 'Menu';
        
        if (label) {
          button.setAttribute('aria-label', label);
        }
      }
    }
  });
  
  // Add focus management for modals
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('shown', function() {
      const firstFocusable = modal.querySelector('input, button, select, textarea');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    });
  });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
  initAccessibilityFeatures();
});

// Console Welcome Message
console.log('🚗 SHERIF-SIEGE-AUTO Auto Upholstery Website');
console.log('✨ Professional experience loaded successfully');
console.log('🎨 Interactive features initialized');
console.log('💬 Live chat and FAQ features loaded');

// Export functions for global access
window.scrollToSection = scrollToSection;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Existing initialization...
  initNewFeatures();
});