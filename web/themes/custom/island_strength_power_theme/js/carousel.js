/**
 * Island Strength & Power - Carousel
 * Auto-rotating carousel with manual controls
 */

(function() {
  'use strict';

  const Carousel = {
    currentSlide: 0,
    slides: [],
    autoRotateInterval: null,
    autoRotateDelay: 5000,

    init: function() {
      // Get all carousel containers
      const carousels = document.querySelectorAll('[data-carousel]');
      
      carousels.forEach(carousel => {
        this.setupCarousel(carousel);
      });
    },

    setupCarousel: function(container) {
      const slides = container.querySelectorAll('[data-slide]');
      if (slides.length === 0) return;

      // Store slides data
      const carouselData = {
        container: container,
        slides: slides,
        currentSlide: 0,
        autoRotateInterval: null
      };

      // Setup navigation
      const prevBtn = container.querySelector('[data-carousel-prev]');
      const nextBtn = container.querySelector('[data-carousel-next]');
      const dots = container.querySelectorAll('[data-carousel-dot]');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          this.prevSlide(container, carouselData);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.nextSlide(container, carouselData);
        });
      }

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          this.goToSlide(container, carouselData, index);
        });
      });

      // Show first slide
      this.showSlide(container, carouselData, 0);

      // Start auto-rotation
      this.startAutoRotate(container, carouselData);

      // Pause on hover
      container.addEventListener('mouseenter', () => {
        this.stopAutoRotate(carouselData);
      });

      container.addEventListener('mouseleave', () => {
        this.startAutoRotate(container, carouselData);
      });
      container.addEventListener('pointerdown', (e) => {
        const anchor = e.target.closest('a');

        if (anchor && anchor.href) {
          // Manually force browser execution if the layout drops the native click sequence
          window.location.href = anchor.href;
        }
      });
    },

    showSlide: function(container, carouselData, index) {
      const slides = carouselData.slides;
      const dots = container.querySelectorAll('[data-carousel-dot]');

      // Wrap around
      if (index >= slides.length) {
        carouselData.currentSlide = 0;
      } else if (index < 0) {
        carouselData.currentSlide = slides.length - 1;
      } else {
        carouselData.currentSlide = index;
      }

      // Hide all slides
      slides.forEach(slide => {
        slide.style.display = 'none';
        slide.style.opacity = '0';
      });

      // Show current slide
      const currentSlide = slides[carouselData.currentSlide];
      currentSlide.style.display = 'block';
      
      // Trigger animation
      setTimeout(() => {
        currentSlide.style.opacity = '1';
      }, 10);

      // Update dots
      dots.forEach((dot, i) => {
        if (i === carouselData.currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    },

    nextSlide: function(container, carouselData) {
      this.showSlide(container, carouselData, carouselData.currentSlide + 1);
      this.restartAutoRotate(container, carouselData);
    },

    prevSlide: function(container, carouselData) {
      this.showSlide(container, carouselData, carouselData.currentSlide - 1);
      this.restartAutoRotate(container, carouselData);
    },

    goToSlide: function(container, carouselData, index) {
      this.showSlide(container, carouselData, index);
      this.restartAutoRotate(container, carouselData);
    },

    startAutoRotate: function(container, carouselData) {
      if (carouselData.autoRotateInterval) {
        clearInterval(carouselData.autoRotateInterval);
      }

      carouselData.autoRotateInterval = setInterval(() => {
        this.nextSlide(container, carouselData);
      }, this.autoRotateDelay);
    },

    stopAutoRotate: function(carouselData) {
      if (carouselData.autoRotateInterval) {
        clearInterval(carouselData.autoRotateInterval);
      }
    },

    restartAutoRotate: function(container, carouselData) {
      this.stopAutoRotate(carouselData);
      this.startAutoRotate(container, carouselData);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      Carousel.init();
    });
  } else {
    Carousel.init();
  }

  // Expose to window for manual control
  window.ISPCarousel = Carousel;
})();
