// Mobile-Optimized JavaScript for SHERIF-SIEGE-AUTO Website

// DOM Elements
let navbar;
let navToggle;
let navMenu;
let backToTopBtn;
let themeToggleBtn;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    initNewFeatures();
    setupContactForm();
    detectComponentImages();
    initCarSeatCarousel();
});

// Initialize DOM elements
function initializeElements() {
    navbar = document.getElementById('navbar');
    navToggle = document.getElementById('nav-toggle');
    navMenu = document.getElementById('nav-menu');
    backToTopBtn = document.getElementById('back-to-top');
    themeToggleBtn = document.getElementById('theme-toggle');
}

// Setup event listeners
function setupEventListeners() {
    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && 
            !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Back to top button
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }

    // Scroll events
    window.addEventListener('scroll', handleScroll);

    // Theme toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Touch events for better mobile interaction
    setupTouchEvents();
}

// Mobile menu functions
function toggleMobileMenu() {
    if (navMenu.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    navMenu.classList.add('active');
    navToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Scroll handling
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Navbar background
    if (navbar) {
        if (scrollTop > 100) {
            navbar.style.background = isDarkMode ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = isDarkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        }
    }

    // Back to top button
    if (backToTopBtn) {
        if (scrollTop > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    // Active navigation link
    updateActiveNavLink();
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
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

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button icon
    const icon = themeToggleBtn.querySelector('i');
    
    if (newTheme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        
        if (savedTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Initialize theme on load
loadTheme();

// Touch events setup
function setupTouchEvents() {
    // Add touch feedback to buttons and cards
    const interactiveElements = document.querySelectorAll('.btn, .advantage-card, .service-card, .info-card, .nav-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });

    // Swipe gestures for car seat carousel
    setupSwipeGestures();
}

// Swipe gestures for mobile
function setupSwipeGestures() {
    const carSeatWrapper = document.querySelector('.car-seat-wrapper');
    if (!carSeatWrapper) return;

    let startX = 0;
    let startY = 0;
    let isScrolling = false;

    carSeatWrapper.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isScrolling = false;
    });

    carSeatWrapper.addEventListener('touchmove', function(e) {
        if (!startX || !startY) return;

        const diffX = startX - e.touches[0].clientX;
        const diffY = startY - e.touches[0].clientY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            e.preventDefault();
            isScrolling = true;
        }
    });

    carSeatWrapper.addEventListener('touchend', function(e) {
        if (!isScrolling) return;

        const diffX = startX - e.changedTouches[0].clientX;
        const threshold = 50;

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swipe left - next image
                nextCarSeatImage();
            } else {
                // Swipe right - previous image
                prevCarSeatImage();
            }
        }

        startX = 0;
        startY = 0;
        isScrolling = false;
    });
}

// Contact form setup
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        // Send to webhook
        const webhookUrl = 'http://localhost:5678/webhook-test/f1a3160d-f1b7-46ae-bb3b-700ba002ea43';

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                vehicle: data.vehicle || '',
                message: data.message,
                timestamp: new Date().toISOString(),
                source: 'SHERIF-SIEGE-AUTO Mobile Website'
            })
        })
        .then(response => {
            if (response.ok) {
                showNotification('Thank you for your message. We will contact you very soon!', 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        })
        .catch(error => {
            console.error('Error sending form data:', error);
            showNotification('There was an error sending your message. Please try again or call us directly.', 'error');
        })
        .finally(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 90%;
        animation: slideDown 0.3s ease;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
        }
    `;
    document.head.appendChild(style);

    // Add to document
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Car seat carousel functionality
let currentSeatIndex = 0;
let seatImages = [];

async function detectComponentImages() {
    try {
        const knownImages = [
            'component/ChatGPT Image Oct 2, 2025, 08_56_02 PM-min.png',
            'component/ChatGPT Image Oct 2, 2025, 08_56_04 PM-min.png',
            'component/ChatGPT Image Oct 2, 2025, 08_56_05 PM-min.png',
            'component/ChatGPT Image Oct 2, 2025, 08_58_29 PM-min.png',
            'component/ChatGPT Image Oct 2, 2025, 09_21_03 PM-min.png'
        ];

        const allImages = [];
        for (const imagePath of knownImages) {
            try {
                const img = new Image();
                img.src = imagePath;
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        allImages.push(imagePath);
                        resolve();
                    };
                    img.onerror = () => {
                        console.log(`Image not found: ${imagePath}`);
                        resolve();
                    };
                });
            } catch (error) {
                console.log(`Error loading image: ${imagePath}`);
            }
        }

        console.log('Loaded images:', allImages);
        return allImages;
    } catch (error) {
        console.log('Using fallback images');
        return [
            'component/ChatGPT Image Oct 2, 2025, 08_56_02 PM-min.png',
            'component/ChatGPT Image Oct 2, 2025, 08_56_04 PM-min.png',
            'component/ChatGPT Image Oct 2, 2025, 08_56_05 PM-min.png',
            'component/ChatGPT Image Oct 2, 2025, 08_58_29 PM-min.png',
            'component/ChatGPT Image Oct 2, 2025, 09_21_03 PM-min.png'
        ];
    }
}

async function initCarSeatCarousel() {
    seatImages = await detectComponentImages();
    
    if (seatImages.length === 0) {
        console.log('No car seat images found');
        return;
    }

    const carSeatWrapper = document.querySelector('.car-seat-wrapper');
    if (!carSeatWrapper) return;

    // Create image element
    const img = document.createElement('img');
    img.src = seatImages[0];
    img.alt = 'Car Seat Restoration';
    img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    `;
    
    carSeatWrapper.appendChild(img);

    // Auto-rotate images every 3 seconds
    setInterval(() => {
        nextCarSeatImage();
    }, 3000);
}

function nextCarSeatImage() {
    if (seatImages.length === 0) return;
    
    currentSeatIndex = (currentSeatIndex + 1) % seatImages.length;
    updateCarSeatImage();
}

function prevCarSeatImage() {
    if (seatImages.length === 0) return;
    
    currentSeatIndex = (currentSeatIndex - 1 + seatImages.length) % seatImages.length;
    updateCarSeatImage();
}

function updateCarSeatImage() {
    const carSeatWrapper = document.querySelector('.car-seat-wrapper img');
    if (!carSeatWrapper || !seatImages[currentSeatIndex]) return;

    // Add transition effect
    carSeatWrapper.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        carSeatWrapper.src = seatImages[currentSeatIndex];
        carSeatWrapper.style.transform = 'scale(1)';
    }, 150);
}

// Initialize new features
function initNewFeatures() {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });

    // Add hover effects for cards on desktop
    if (!('ontouchstart' in window)) {
        const cards = document.querySelectorAll('.advantage-card, .service-card, .info-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Utility functions
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

// Optimize scroll events
const optimizedScrollHandler = debounce(handleScroll, 10);
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', optimizedScrollHandler);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for global access
window.scrollToSection = scrollToSection;
window.nextCarSeatImage = nextCarSeatImage;
window.prevCarSeatImage = prevCarSeatImage;
