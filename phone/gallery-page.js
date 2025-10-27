// Gallery Page JavaScript for SHERIF-SIEGE-AUTO Mobile Website

// Gallery data
const galleryData = [
  {
          src: 'component/ChatGPT Image Oct 2, 2025, 08_56_02 PM-min.png',
          title: 'Vibrant Blue Leather Upholstery',
          description: 'Sporty style in deep blue leather. Featuring strong side supports and quality stitching.'
        },
        {
          src: 'component/ChatGPT Image Oct 2, 2025, 08_56_04 PM-min.png',
          title: 'Vibrant Red Sport Upholstery',
          description: 'Sporty Upholstery with Vibrant Red Leather. Features ergonomic side bolsters and precision stitching for ultimate comfort and style.'
        },
        {
          src: 'component/ChatGPT Image Oct 2, 2025, 08_56_05 PM-min.png',
          title: 'Two-Tone Sport Upholstery (Black/Orange)',
          description: 'Two-Tone Sport Upholstery in Black & Orange Leather. Features ergonomic side bolsters and precision stitching for a high-contrast, modern look.'
        },
        {
          src: 'component/ChatGPT Image Oct 2, 2025, 08_58_29 PM-min.png',
          title: 'Two-Tone Modern Look (Dark Blue/White)',
          description: 'Elegant Two-Tone Upholstery in Dark Blue & White Leather. Features ergonomic side bolsters and precision stitching for a classic, refined look.'
        },
        {
          src: 'component/ChatGPT Image Oct 2, 2025, 09_21_03 PM-min.png',
          title: 'Premium Two-Tone (Black/Orange) Upholstery',
          description: 'Premium Sport Upholstery with Dynamic Orange Inserts. Combines rich black leather with vibrant Orange, engineered with supportive bolsters for comfort.'
        }
];

// Global variables
let currentGalleryIndex = 0;
let galleryItems = [];

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initGallery();
  setupGalleryEvents();
});

// Initialize gallery
function initGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  // Clear existing content
  galleryGrid.innerHTML = '';

  // Add loading state
  galleryGrid.innerHTML = `
    <div class="gallery-loading">
      <i class="fas fa-spinner"></i>
      <span>Loading gallery...</span>
    </div>
  `;

  // Load images with error handling
  loadGalleryImages();
}

// Load gallery images
async function loadGalleryImages() {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  try {
    const validImages = [];
    
    for (const item of galleryData) {
      try {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = () => {
            validImages.push(item);
            resolve();
          };
          img.onerror = () => {
            console.log(`Image not found: ${item.src}`);
            resolve(); // Continue with other images
          };
          img.src = item.src;
        });
      } catch (error) {
        console.log(`Error loading image: ${item.src}`);
      }
    }

    if (validImages.length === 0) {
      showEmptyState();
      return;
    }

    // Clear loading state
    galleryGrid.innerHTML = '';

    // Create gallery items
    validImages.forEach((item, index) => {
      const galleryItem = createGalleryItem(item, index);
      galleryGrid.appendChild(galleryItem);
    });

    // Store gallery items for modal
    galleryItems = validImages;

  } catch (error) {
    console.error('Error loading gallery:', error);
    showEmptyState();
  }
}

// Create gallery item
function createGalleryItem(item, index) {
  const galleryItem = document.createElement('div');
  galleryItem.className = 'gallery-item';
  galleryItem.setAttribute('data-index', index);

  galleryItem.innerHTML = `
    <div class="gallery-image">
      <img src="${item.src}" alt="${item.title}" loading="lazy">
      <div class="gallery-overlay">
        <i class="fas fa-search-plus"></i>
      </div>
    </div>
    <div class="gallery-content">
      <h3 class="gallery-title">${item.title}</h3>
      <p class="gallery-description">${item.description}</p>
    </div>
  `;

  // Add click event
  galleryItem.addEventListener('click', () => openGalleryModal(index));
  
  // Add touch feedback
  galleryItem.addEventListener('touchstart', function() {
    this.style.transform = 'scale(0.98)';
  });
  
  galleryItem.addEventListener('touchend', function() {
    this.style.transform = '';
  });

  return galleryItem;
}

// Show empty state
function showEmptyState() {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  galleryGrid.innerHTML = `
    <div class="gallery-empty">
      <i class="fas fa-images"></i>
      <h3>No Images Available</h3>
      <p>We're working on adding more photos to our gallery. Please check back soon!</p>
    </div>
  `;
}

// Setup gallery events
function setupGalleryEvents() {
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (document.querySelector('.gallery-modal.active')) {
      switch(e.key) {
        case 'Escape':
          closeGalleryModal();
          break;
        case 'ArrowLeft':
          prevGalleryImage();
          break;
        case 'ArrowRight':
          nextGalleryImage();
          break;
      }
    }
  });

  // Touch gestures for modal
  setupGalleryTouchGestures();
}

// Setup touch gestures for gallery modal
function setupGalleryTouchGestures() {
  const modal = document.querySelector('.gallery-modal');
  if (!modal) return;

  let startX = 0;
  let startY = 0;
  let isScrolling = false;

  modal.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isScrolling = false;
  });

  modal.addEventListener('touchmove', function(e) {
    if (!startX || !startY) return;

    const diffX = startX - e.touches[0].clientX;
    const diffY = startY - e.touches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      e.preventDefault();
      isScrolling = true;
    }
  });

  modal.addEventListener('touchend', function(e) {
    if (!isScrolling) return;

    const diffX = startX - e.changedTouches[0].clientX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe left - next image
        nextGalleryImage();
      } else {
        // Swipe right - previous image
        prevGalleryImage();
      }
    }

    startX = 0;
    startY = 0;
    isScrolling = false;
  });
}

// Open gallery modal
function openGalleryModal(index) {
  if (galleryItems.length === 0) return;

  currentGalleryIndex = parseInt(index);
  const modal = document.querySelector('.gallery-modal');
  if (!modal) return;

  // Create modal if it doesn't exist
  if (!modal.innerHTML.trim()) {
    createGalleryModal();
  }

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Update modal content
  updateGalleryModal();

  // Add touch feedback
  modal.addEventListener('touchstart', function() {
    this.style.transform = 'scale(0.98)';
  });
  
  modal.addEventListener('touchend', function() {
    this.style.transform = '';
  });
}

// Create gallery modal
function createGalleryModal() {
  const modal = document.querySelector('.gallery-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="gallery-modal-content">
      <button class="gallery-modal-close" id="gallery-close">
        <i class="fas fa-times"></i>
      </button>
      
      <div class="gallery-modal-image">
        <img id="gallery-main-image" src="" alt="">
      </div>
      
      <div class="gallery-modal-info">
        <h3 id="gallery-image-title"></h3>
        <p id="gallery-image-description"></p>
        
        <div class="gallery-modal-controls">
          <button class="gallery-modal-btn" id="gallery-prev">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="gallery-modal-btn" id="gallery-next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div class="gallery-modal-indicators" id="gallery-indicators">
          <!-- Indicators will be generated here -->
        </div>
      </div>
    </div>
  `;

  // Add event listeners
  const closeBtn = document.getElementById('gallery-close');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeGalleryModal);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', prevGalleryImage);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', nextGalleryImage);
  }

  // Close modal when clicking outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeGalleryModal();
    }
  });
}

// Update gallery modal content
function updateGalleryModal() {
  if (galleryItems.length === 0) return;

  const currentItem = galleryItems[currentGalleryIndex];
  if (!currentItem) return;

  // Update image
  const mainImage = document.getElementById('gallery-main-image');
  if (mainImage) {
    mainImage.src = currentItem.src;
    mainImage.alt = currentItem.title;
  }

  // Update title
  const title = document.getElementById('gallery-image-title');
  if (title) {
    title.textContent = currentItem.title;
  }

  // Update description
  const description = document.getElementById('gallery-image-description');
  if (description) {
    description.textContent = currentItem.description;
  }

  // Update indicators
  updateGalleryIndicators();

  // Update button states
  updateGalleryButtons();
}

// Update gallery indicators
function updateGalleryIndicators() {
  const indicatorsContainer = document.getElementById('gallery-indicators');
  if (!indicatorsContainer) return;

  indicatorsContainer.innerHTML = '';

  galleryItems.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.className = `gallery-indicator ${index === currentGalleryIndex ? 'active' : ''}`;
    indicator.addEventListener('click', () => {
      currentGalleryIndex = index;
      updateGalleryModal();
    });
    indicatorsContainer.appendChild(indicator);
  });
}

// Update gallery buttons
function updateGalleryButtons() {
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');

  if (prevBtn) {
    prevBtn.disabled = currentGalleryIndex === 0;
    prevBtn.style.opacity = currentGalleryIndex === 0 ? '0.5' : '1';
  }

  if (nextBtn) {
    nextBtn.disabled = currentGalleryIndex === galleryItems.length - 1;
    nextBtn.style.opacity = currentGalleryIndex === galleryItems.length - 1 ? '0.5' : '1';
  }
}

// Close gallery modal
function closeGalleryModal() {
  const modal = document.querySelector('.gallery-modal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Previous gallery image
function prevGalleryImage() {
  if (currentGalleryIndex > 0) {
    currentGalleryIndex--;
    updateGalleryModal();
  }
}

// Next gallery image
function nextGalleryImage() {
  if (currentGalleryIndex < galleryItems.length - 1) {
    currentGalleryIndex++;
    updateGalleryModal();
  }
}

// Lazy loading for gallery images
function setupLazyLoading() {
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

// Initialize lazy loading
setupLazyLoading();

// Performance monitoring
function logGalleryPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', function() {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Gallery page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
      }, 0);
    });
  }
}

// Initialize performance monitoring
logGalleryPerformance();

// Export functions for global access
window.openGalleryModal = openGalleryModal;
window.closeGalleryModal = closeGalleryModal;
window.prevGalleryImage = prevGalleryImage;
window.nextGalleryImage = nextGalleryImage;
