/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.animated-card');
    const sections = document.querySelectorAll('.animated-section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
            }
        });
    }, {
        threshold: 0.5 
    });

    cards.forEach(card => {
        observer.observe(card);
    });

    sections.forEach(section => {
        observer.observe(section);
    });
      $('.shop-button').click(function() {
        $('#popupForm').fadeIn();
    });
    $('.close-popup').click(function() {
        $('#popupForm').fadeOut();
    });
    $('#subscriptionForm').submit(function(e) {
        e.preventDefault();
        let email = $('#emailInput').val();
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        console.log('Email submitted:', email);
        $('#popupForm').fadeOut();
    });
});
