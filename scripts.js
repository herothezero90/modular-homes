/* eslint-disable no-undef */
$(document).ready(function () {
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Animation
  const animationModule = {
    animateElements: function ($elements, className) {
      const observer = new IntersectionObserver(
        debounce(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              $(entry.target).addClass(className);
            }
          });
        }, 100),
        { threshold: 0.5 }
      );

      $elements.each(function () {
        observer.observe(this);
      });
    },
    init: function () {
      const $cards = $(".animated-card");
      const $sections = $(".animated-section");

      this.animateElements($cards, "slide-up");
      this.animateElements($sections, "slide-up");
    },
  };

  // Popup
  const popupModule = {
    showPopup: function () {
      $("#popupForm").fadeIn();
    },
    hidePopup: function () {
      $("#popupForm").fadeOut();
    },
    handleSubmit: function (event) {
      event.preventDefault();
      const email = $("#emailInput").val();

      if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      console.log("Email submitted:", email);
      this.hidePopup();
    },
    init: function () {
      const self = this;
      $(".shop-button").on("click", function () {
        self.showPopup();
      });
      $(".close-popup").on("click", function () {
        self.hidePopup();
      });
      $("#subscriptionForm").on(
        "submit",
        function (event) {
          self.handleSubmit(event);
        }.bind(this)
      );
    },
  };
  animationModule.init();
  popupModule.init();
});
