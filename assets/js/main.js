/* =========================================================
   CORPORATE GIFT — main.js
   Vanilla JS ES6 — no jQuery, no framework dependencies
   ========================================================= */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "6281234567890"; // TODO: replace with live business WhatsApp number

  document.addEventListener("DOMContentLoaded", function () {
    initNavbarScroll();
    initActiveNavLink();
    initSmoothScroll();
    initWhatsappLinks();
    initContactForm();
    initNewsletterForm();
    initYear();
    initLazyImages();
    initScrollReveal();
    initProductFilter();
    initAboutImageHover();
    initBackToTop();
    initGalleryFilter();
    initLightbox();
    initTocToggle();
    initLoadMoreBlog();
    initFaqReveal();
    initHeroProductSlider();
  });

  /* 1. Navbar background/shadow state on scroll */
  function initNavbarScroll() {
    var navbar = document.querySelector(".navbar-cg");
    if (!navbar) return;
    var toggle = function () {
      if (window.scrollY > 24) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  /* 2. Highlight active nav link based on current page */
  function initActiveNavLink() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".navbar-cg .nav-link, .offcanvas .nav-link").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;
      var page = href.split("/").pop();
      if (page === current) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* 3. Smooth scroll for in-page anchor links */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var targetId = this.getAttribute("href").slice(1);
        var target = document.getElementById(targetId);
        if (!target) return;
        e.preventDefault();
        var offset = 90;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
        var offcanvasEl = document.getElementById("mainOffcanvas");
        if (offcanvasEl && window.bootstrap) {
          var instance = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
          if (instance) instance.hide();
        }
      });
    });
  }

  /* 4. Build WhatsApp deep links with prefilled message from data-wa-message */
  function initWhatsappLinks() {
    document.querySelectorAll("[data-wa-message]").forEach(function (link) {
      var message = link.getAttribute("data-wa-message") || "Halo, saya ingin bertanya mengenai Corporate Gift.";
      link.setAttribute(
        "href",
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message)
      );
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* 5. Contact form — frontend-only validation + confirmation UI (no backend) */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var successBox = document.getElementById("contactFormSuccess");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      form.classList.remove("was-validated");
      form.classList.add("d-none");
      if (successBox) successBox.classList.remove("d-none");
      form.reset();
    });
  }

  /* 6. Newsletter / footer subscribe form (frontend only) */
  function initNewsletterForm() {
    var form = document.getElementById("newsletterForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type='submit']");
      var input = form.querySelector("input[type='email']");
      if (!input || !input.value) return;
      if (btn) {
        var original = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check2"></i>';
        setTimeout(function () {
          btn.innerHTML = original;
          form.reset();
        }, 1800);
      }
    });
  }

  /* 7. Auto-update footer year */
  function initYear() {
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* 8. Native lazy-loading fallback flag (loading="lazy" is set inline in HTML) */
  function initLazyImages() {
    if ("loading" in HTMLImageElement.prototype) return;
    // Minimal fallback: browsers without native lazy-load just load images normally.
  }

  /* 9. Reveal Animation */
  function initScrollReveal() {

    const cards = document.querySelectorAll(
      `
    .reveal-card,
    .reveal-left,
    .reveal-right,

    .reveal-service-left,
    .reveal-service-up,
    .reveal-service-right,

    .reveal-product,
    .reveal-step,
    .reveal-article,
    .faq-left,
    .faq-right,
    .cta-reveal,
    .contact-left,
    .contact-right
    `
    );

    if (cards.length) {
      const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add("show");

            observer.unobserve(entry.target);

          }

        });

      }, {
        threshold: 0.05
      });

      cards.forEach(function (card) {
        observer.observe(card);
      });
    }

    /* Plain .reveal elements (used on blog.html & gallery.html cards/headers)
       use the .active class per custom.css, not .show — handle separately so
       this content is not left permanently hidden (opacity: 0). */
    const plainReveal = document.querySelectorAll(".reveal");

    if (!plainReveal.length) return;

    const plainObserver = new IntersectionObserver(function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {

          entry.target.classList.add("active");

          plainObserver.unobserve(entry.target);

        }

      });

    }, {
      threshold: 0.05
    });

    plainReveal.forEach(function (el) {
      plainObserver.observe(el);
    });

  }

  /* 9b. FAQ reveal (dipindah ke dalam DOMContentLoaded, pakai IntersectionObserver
     yang sama efisiennya dgn initScrollReveal, tidak lagi ada scroll listener manual) */
  function initFaqReveal() {
    const faqItems = document.querySelectorAll(".faq-left, .faq-right");
    if (!faqItems.length) return;

    const faqObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          faqObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    faqItems.forEach(item => faqObserver.observe(item));
  }

  function initProductFilter() {

    const buttons = document.querySelectorAll(".filter-btn");
    const items = document.querySelectorAll(".product-item");

    if (!buttons.length || !items.length) return;

    // Reveal pertama kali
    items.forEach((item, index) => {

      setTimeout(() => {
        item.classList.add("show");
      }, index * 80);

    });

    buttons.forEach(btn => {

      btn.addEventListener("click", () => {

        buttons.forEach(b => {

          b.classList.remove("btn-cg-primary", "active");
          b.classList.add("btn-cg-outline-dark");

        });

        btn.classList.add("btn-cg-primary", "active");
        btn.classList.remove("btn-cg-outline-dark");

        const filter = btn.dataset.filter;

        items.forEach((item, index) => {

          const visible =
            filter === "all" ||
            item.dataset.category === filter;

          if (visible) {

            item.style.display = "";

            setTimeout(() => {

              item.classList.remove("hide");
              item.classList.add("show");

            }, index * 60);

          } else {

            item.classList.remove("show");
            item.classList.add("hide");

            setTimeout(() => {
              item.style.display = "none";
            }, 300);

          }

        });

      });

    });

  }

  /* Premium About Image Hover */
  function initAboutImageHover() {

    const cards = document.querySelectorAll(".shadow-cg-card");

    cards.forEach(card => {

      const img = card.querySelector("img");

      if (!img) return;

      card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const moveX = (x - rect.width / 2) / 18;
        const moveY = (y - rect.height / 2) / 18;

        img.style.transform =
          `scale(1.08) translate(${moveX}px, ${moveY}px)`;

      });

      card.addEventListener("mouseleave", () => {

        img.style.transform = "scale(1) translate(0,0)";

      });

    });

  }

  /* 12. Back-to-top button: shows after scrolling down, smooth-scrolls to top on click */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;

    var toggle = function () {
      if (window.scrollY > 400) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* 13. Gallery category filter (Galeri page) */
  function initGalleryFilter() {
    var buttons = document.querySelectorAll(".gallery-filter-btn");
    var items = document.querySelectorAll(".gallery-item");
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("btn-cg-primary", "active");
          b.classList.add("btn-cg-outline-dark");
        });
        btn.classList.add("btn-cg-primary", "active");
        btn.classList.remove("btn-cg-outline-dark");

        var filter = btn.getAttribute("data-filter");
        items.forEach(function (item) {
          var show = filter === "all" || item.getAttribute("data-category") === filter;
          item.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* 14. Lightbox for gallery images: click to enlarge, prev/next, ESC/overlay to close */
  function initLightbox() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox="gallery"]'));
    var overlay = document.getElementById("lightboxOverlay");
    if (!triggers.length || !overlay) return;

    var imgEl = document.getElementById("lightboxImage");
    var captionEl = document.getElementById("lightboxCaption");
    var closeBtn = document.getElementById("lightboxClose");
    var prevBtn = document.getElementById("lightboxPrev");
    var nextBtn = document.getElementById("lightboxNext");
    var currentIndex = 0;

    function getVisibleTriggers() {
      return triggers.filter(function (t) {
        var item = t.closest(".gallery-item");
        return !item || item.style.display !== "none";
      });
    }

    function show(index) {
      var visible = getVisibleTriggers();
      if (!visible.length) return;
      currentIndex = (index + visible.length) % visible.length;
      var t = visible[currentIndex];
      imgEl.src = t.getAttribute("data-full");
      imgEl.alt = t.getAttribute("data-caption") || "";
      captionEl.textContent = t.getAttribute("data-caption") || "";
      overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    }

    function close() {
      overlay.classList.remove("show");
      document.body.style.overflow = "";
    }

    triggers.forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        var visible = getVisibleTriggers();
        var idx = visible.indexOf(t);
        show(idx === -1 ? 0 : idx);
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (prevBtn) prevBtn.addEventListener("click", function () { show(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(currentIndex + 1); });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("show")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(currentIndex - 1);
      if (e.key === "ArrowRight") show(currentIndex + 1);
    });
  }

  /* 15. Table of Contents toggle (artikel) */
  function initTocToggle() {
    var btn = document.querySelector(".toc-toggle");
    var content = document.getElementById("tocContent");
    if (!btn || !content) return;

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      content.classList.toggle("show");
    });
  }

  /* ==========================
   Load More Blog
========================== */

  function initLoadMoreBlog() {

    const button = document.getElementById("loadMoreBtn");

    if (!button) return;

    const hiddenPosts = document.querySelectorAll(".extra-post");

    button.addEventListener("click", function () {

      hiddenPosts.forEach(function (post, index) {

        setTimeout(function () {

          post.classList.remove("d-none");

          post.classList.add("show");

        }, index * 120);

      });

      button.style.display = "none";

    });

  }

  /* 17. Hero Product Auto Slider */
  function initHeroProductSlider() {
    var slider = document.getElementById("heroProductSlider");
    if (!slider) return;

    var slides = slider.querySelectorAll(".hero-slide");
    var container = slider.closest(".hero-visual-frame") || slider.parentElement;
    var indicators = container.querySelectorAll(".hero-indicator");
    if (slides.length <= 1) return;

    var currentIndex = 0;
    var timer = null;
    var intervalTime = 3500;

    function goToSlide(index) {
      slides[currentIndex].classList.remove("active");
      if (indicators[currentIndex]) {
        indicators[currentIndex].classList.remove("active");
      }

      currentIndex = (index + slides.length) % slides.length;

      slides[currentIndex].classList.add("active");
      if (indicators[currentIndex]) {
        indicators[currentIndex].classList.add("active");
      }
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(nextSlide, intervalTime);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    indicators.forEach(function (indicator, idx) {
      indicator.addEventListener("click", function (e) {
        e.preventDefault();
        goToSlide(idx);
        startTimer();
      });
    });

    container.addEventListener("mouseenter", stopTimer);
    container.addEventListener("mouseleave", startTimer);

    var touchStartX = 0;
    var touchEndX = 0;

    container.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopTimer();
    }, { passive: true });

    container.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
      startTimer();
    }, { passive: true });

    startTimer();
  }

})();