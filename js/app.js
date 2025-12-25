// Custom Application JavaScript

(function () {
  "use strict";

  // ==========================================
  // THEME TOGGLE (Dark/Light Mode)
  // ==========================================
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const themeIcon = document.querySelector(".theme-icon");

  // Check for saved theme preference or default to dark
  const currentTheme = localStorage.getItem("theme") || "dark";
  body.setAttribute("data-theme", currentTheme);

  if (currentTheme === "light") {
    themeIcon.textContent = "🌙";
  } else {
    themeIcon.textContent = "☀️";
  }

  // Theme toggle click handler
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const theme = body.getAttribute("data-theme");
      const newTheme = theme === "dark" ? "light" : "dark";

      body.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      // Update icon
      themeIcon.textContent = newTheme === "light" ? "🌙" : "☀️";
    });
  }

  // ==========================================
  // BACK TO TOP BUTTON
  // ==========================================
  const backToTopButton = document.getElementById("back-to-top");

  // ==========================================
  // PROJECT LINKS TOGGLE
  // ==========================================
  document.querySelectorAll(".toggle-links").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("data-target");
      const projectCard = document.querySelector(
        `[data-project-id="${targetId}"]`
      );
      const linksDiv = projectCard.querySelector(".project-links");
      const showText = this.querySelector(".show-text");
      const hideText = this.querySelector(".hide-text");

      if (linksDiv.style.display === "none" || linksDiv.style.display === "") {
        linksDiv.style.display = "block";
        showText.style.display = "none";
        hideText.style.display = "inline";
      } else {
        linksDiv.style.display = "none";
        showText.style.display = "inline";
        hideText.style.display = "none";
      }
    });
  });

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  if (backToTopButton) {
    backToTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ==========================================
  // CONTACT FORM WITH WEB3FORMS
  // ==========================================
  const contactForm = document.getElementById("contact-form");
  const formMessages = document.getElementById("form-messages");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Disable submit button
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      try {
        // Get form data
        const formData = new FormData(contactForm);

        // Submit to Web3Forms
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          showFormMessage(
            "success",
            "Thank you! Your message has been sent successfully. I'll get back to you soon."
          );
          contactForm.reset();
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error:", error);
        showFormMessage(
          "error",
          "Sorry, there was an error sending your message. Please try again or contact me directly at akilajayasingheofficial@gmail.com"
        );
      } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }

  function showFormMessage(type, message) {
    const alertType =
      type === "success" ? "success" : type === "error" ? "danger" : "info";
    formMessages.innerHTML = `
      <div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `;

    // Auto-hide success messages after 5 seconds
    if (type === "success") {
      setTimeout(function () {
        formMessages.innerHTML = "";
      }, 5000);
    }
  }

  // ==========================================
  // ENHANCED CAROUSEL FOR TESTIMONIALS
  // ==========================================
  setTimeout(function () {
    if (typeof jQuery !== "undefined" && jQuery(".carousel-testimony").length) {
      jQuery(".carousel-testimony").owlCarousel({
        center: true,
        loop: true,
        items: 1,
        margin: 30,
        stagePadding: 0,
        nav: false,
        navText: [
          '<span class="ion-ios-arrow-back">',
          '<span class="ion-ios-arrow-forward">',
        ],
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 1,
          },
          1000: {
            items: 1,
          },
        },
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
      });
    }
  }, 500);

  // ==========================================
  // LAZY LOADING FOR IMAGES
  // ==========================================
  if ("loading" in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
    document.body.appendChild(script);
  }

  // ==========================================
  // IMPROVED ACCESSIBILITY - FOCUS TRAP FOR MOBILE MENU
  // ==========================================
  const navToggle = document.querySelector(".navbar-toggler");
  const navMenu = document.getElementById("ftco-nav");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !isExpanded);
    });
  }

  // ==========================================
  // SERVICE WORKER REGISTRATION (PWA)
  // ==========================================
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(function (registration) {
          console.log("ServiceWorker registration successful");
        })
        .catch(function (err) {
          console.log("ServiceWorker registration failed: ", err);
        });
    });
  }

  console.log("Portfolio app initialized successfully! 🚀");
})();
