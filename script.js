document.addEventListener('DOMContentLoaded', () => {

    // --- Cursor Glow ---
    const glow = document.getElementById('cursor-glow');
    if (glow && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            glow.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // --- Mobile Menu ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // --- Number Counter ---
    const stats = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    function startCounting() {
        if (hasCounted) return;
        hasCounted = true;

        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out quad
                const eased = 1 - (1 - progress) * (1 - progress);
                stat.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
        });
    }

    // --- Scroll Reveal ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Stats counting
                if (entry.target.closest('.stats-section')) {
                    startCounting();
                }
            }
        });
    }, observerOptions);

    // Elements to reveal
    const revealEls = document.querySelectorAll(
        '.contrast-card, .service-card, .testimonial-card, .pricing-card, ' +
        '.section-label, .section-heading, .stat-block, .big-cta-content, ' +
        '.booking-info, .booking-form-card, .portfolio-item, .text-review, .video-testimonial-card'
    );

    revealEls.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Also observe stats section
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsSection.classList.add('reveal');
        observer.observe(statsSection);
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => {
                    if (other !== item && other.open) {
                        other.removeAttribute('open');
                    }
                });
            }
        });
    });

    // --- Form ---
    const form = document.getElementById('booking-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('form-submit');
            const original = btn.innerHTML;

            btn.innerHTML = '<span>Saving & Redirecting...</span>';
            btn.style.opacity = '0.7';

            // Gather form data
            const formData = new FormData(form);

            // Replace with your actual Google Apps Script Web App URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwJaoi50UU5tzgFLmA_cA8eXeOHztnf2N0wPDnXvYITOTzGhgP92zIugNKjBNyoTxDx/exec';

            // We use keepalive: true so the browser continues sending the request 
            // in the background even after we redirect the user to Calendly.
            fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors', keepalive: true })
                .catch(error => console.error('Error!', error.message));

            // Redirect almost instantly (300ms gives enough time for the user to see the button click)
            setTimeout(() => {
                window.location.href = "appointment.html";
                
                // Reset button state in case they hit the back button
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.style.opacity = '1';
                    form.reset();
                }, 1000);
            }, 300);
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
