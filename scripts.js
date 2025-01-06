/* eslint-disable no-undef */
const products = [
  {
    title: "Gourmet Tacos",
    price: "$14.50",
    image: "./media/tacos.jpeg",
  },
  {
    title: "Chicken Alfredo",
    price: "$18.00",
    image: "./media/chicken_alfredo.jpeg",
  },
  {
    title: "Grilled Salmon",
    price: "$22.00",
    image: "./media/salmon.jpeg",
  },
  {
    title: "Starter Pack",
    price: "$35.00",
    image: "./media/premade_meals.jpeg",
  },
];

function renderShopCards() {
  const shopRow = document.getElementById("shopRow");
  if (!shopRow) return; // Safety check if element isn't found

  shopRow.innerHTML = "";

  products.forEach((product) => {
  
    const colDiv = document.createElement("div");
    colDiv.className = "col-6 col-md-4 col-lg-3 mb-4";

    // Fill in the card HTML
    colDiv.innerHTML = `
      <div class="card border-0 h-100">
        <img
          src="${product.image}"
          class="card-img-top"
          alt="${product.title}"
        />
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text"><strong>${product.price}</strong></p>
          <button class="btn btn-primary open-popup">Add to Cart</button>
        </div>
      </div>
    `;

    shopRow.appendChild(colDiv);
  });
}

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

  renderShopCards();

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

      $(".open-popup").on("click", function () {
        self.showPopup();
      });

      $(".close-popup").on("click", function () {
        self.hidePopup();
      });

      $("#subscriptionForm").on("submit", function (event) {
        self.handleSubmit(event);
      });
    },
  };
  animationModule.init();
  popupModule.init();
});
