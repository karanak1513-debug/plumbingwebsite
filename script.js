// ==========================================================================
// Navigation & Mobile Menu Logic
// ==========================================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky Navbar & Active Link Highlight
window.addEventListener('scroll', () => {
    // Sticky
    if (window.scrollY > 50) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }

    // Highlight active section link
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu on clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ==========================================================================
// Scroll Reveal Animation (Intersection Observer)
// ==========================================================================
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Optional: stop observing once revealed
        }
    });
};

const revealOptions = {
    threshold: 0.1, // Trigger when 10% visible
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits bottom
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// ==========================================================================
// Loan EMI Calculator
// ==========================================================================
// Formula: EMI = P × R × (1+R)^N / ((1+R)^N − 1)
const calcBtn = document.getElementById('calc-btn');
const amountInput = document.getElementById('loan-amount');
const rateInput = document.getElementById('interest-rate');
const tenureInput = document.getElementById('loan-tenure');
const errorText = document.getElementById('calc-error');

const emiDisplay = document.getElementById('emi-value');
const interestDisplay = document.getElementById('interest-value');
const totalDisplay = document.getElementById('total-value');

// Utility to format numbers into INR currency string
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

// Counter animation for numbers
const animateNumber = (element, targetValue) => {
    const duration = 1000;
    const steps = 30;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let current = 0;
    const increment = targetValue / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        element.innerText = formatCurrency(current);
    }, stepTime);
};

calcBtn.addEventListener('click', () => {
    const P = parseFloat(amountInput.value);
    const yearlyRate = parseFloat(rateInput.value);
    const years = parseFloat(tenureInput.value);

    // Validation
    if (isNaN(P) || isNaN(yearlyRate) || isNaN(years) || P <= 0 || yearlyRate <= 0 || years <= 0) {
        errorText.innerText = "Please enter valid positive values for all fields.";
        errorText.style.display = "block";
        return;
    }
    errorText.style.display = "none";

    // Variables for calculation
    const R = yearlyRate / 12 / 100; // Monthly interest rate
    const N = years * 12; // Loan duration in months

    // Calculation
    const mathFactor = Math.pow(1 + R, N);
    const emi = (P * R * mathFactor) / (mathFactor - 1);

    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    // Output with animation
    animateNumber(emiDisplay, emi);
    animateNumber(interestDisplay, totalInterest);
    animateNumber(totalDisplay, totalPayment);
});

// ==========================================================================
// Contact Form Validation
// ==========================================================================
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

// Simple regex for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate each input inside the form
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        const group = input.parentElement;

        if (input.value.trim() === '') {
            group.classList.add('invalid');
            isValid = false;
        } else if (input.type === 'email' && !emailRegex.test(input.value.trim())) {
            group.classList.add('invalid');
            isValid = false;
        } else {
            group.classList.remove('invalid');
        }

        // Remove error on input dynamically
        input.addEventListener('input', () => {
            group.classList.remove('invalid');
        });
    });

    if (isValid) {
        // Fake success
        successMsg.innerHTML = '<i class="fa-solid fa-circle-check"></i> Your message has been sent successfully. We will get back to you soon.';
        form.reset();

        // Hide message after 5 seconds
        setTimeout(() => {
            successMsg.innerHTML = '';
        }, 5000);
    } else {
        successMsg.innerHTML = '';
    }
});
